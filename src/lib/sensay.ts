import axios from "axios";

const SENSAY_API_BASE = "https://api.sensay.io/v1";
const API_KEY =
  "022aa5b4336ed59e2a98aa0158cc647f7a7f42ebc8a51d4f5d28d714fb655485";
const ORGANIZATION_ID = "18db70f4-ad9d-4519-9bd2-9bcf6928a323";

// Create axios instance with default headers
const sensayClient = axios.create({
  baseURL: SENSAY_API_BASE,
  headers: {
    "X-ORGANIZATION-SECRET": API_KEY,
    "X-API-Version": "2025-03-25",
    "Content-Type": "application/json",
  },
});

// Types for our API responses
export interface SensayUser {
  id: string;
  name?: string;
  email?: string;
  linkedAccounts: any[];
}

export interface SensayReplica {
  uuid: string;
  name: string;
  slug: string;
  shortDescription: string;
  greeting: string;
  tags: string[];
  ownerID: string;
  private: boolean;
  profileImage?: string;
  llm: {
    model: string;
    provider: string;
    systemMessage?: string;
    memoryMode?: string;
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  success: boolean;
  content: string;
}

export class SensayAPI {
  private userId: string = "mentorscroll_user_" + Date.now();

  // Initialize user (create if doesn't exist)
  async initializeUser(): Promise<SensayUser> {
    try {
      // Try to get existing user
      const response = await sensayClient.get(`/users/${this.userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // User doesn't exist, create new one
        const createResponse = await sensayClient.post("/users", {
          id: this.userId,
          name: "MentorScroll User",
          email: `user_${Date.now()}@mentorscroll.app`,
        });
        return createResponse.data;
      }
      throw error;
    }
  }

  // Create an expert replica
  async createExpertReplica(expertData: {
    name: string;
    slug: string;
    shortDescription: string;
    greeting: string;
    systemMessage: string;
    tags: string[];
    profileImage?: string;
  }): Promise<{ success: boolean; uuid?: string }> {
    try {
      const response = await sensayClient.post("/replicas", {
        name: expertData.name,
        slug: expertData.slug,
        shortDescription: expertData.shortDescription,
        greeting: expertData.greeting,
        ownerID: this.userId,
        private: false,
        tags: expertData.tags,
        profileImage:
          expertData.profileImage ||
          "https://sensay.io/assets/default-replica-profile.webp",
        llm: {
          provider: "openai",
          model: "gpt-4o",
          systemMessage: expertData.systemMessage,
          memoryMode: "rag-search",
        },
        type: "character",
      });

      return response.data;
    } catch (error) {
      console.error("Error creating replica:", error);
      return { success: false };
    }
  }

  // List all replicas
  async getExpertReplicas(): Promise<SensayReplica[]> {
    try {
      const response = await sensayClient.get("/replicas", {
        headers: {
          "X-USER-ID": this.userId,
        },
      });
      return response.data.items || [];
    } catch (error) {
      console.error("Error fetching replicas:", error);
      return [];
    }
  }

  // Chat with an expert
  async chatWithExpert(
    replicaUuid: string,
    message: string
  ): Promise<ChatResponse> {
    try {
      const response = await sensayClient.post(
        `/replicas/${replicaUuid}/chat/completions`,
        {
          content: message,
          skip_chat_history: false,
          source: "web",
        },
        {
          headers: {
            "X-USER-ID": this.userId,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error chatting with expert:", error);
      return {
        success: false,
        content: "Sorry, I had trouble responding. Please try again.",
      };
    }
  }

  // Get chat history with an expert
  async getChatHistory(replicaUuid: string): Promise<ChatMessage[]> {
    try {
      const response = await sensayClient.get(
        `/replicas/${replicaUuid}/chat/history`,
        {
          headers: {
            "X-USER-ID": this.userId,
          },
        }
      );

      return (
        response.data.items?.map((item: any) => ({
          role: item.role,
          content: item.content,
          timestamp: item.created_at,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching chat history:", error);
      return [];
    }
  }

  // Train replica with educational content
  async trainExpert(replicaUuid: string, content: string): Promise<boolean> {
    try {
      // Create knowledge base entry
      const createResponse = await sensayClient.post(
        `/replicas/${replicaUuid}/training`
      );

      if (createResponse.data.success) {
        const knowledgeBaseId = createResponse.data.knowledgeBaseID;

        // Add content to knowledge base
        const updateResponse = await sensayClient.put(
          `/replicas/${replicaUuid}/training/${knowledgeBaseId}`,
          {
            rawText: content,
          }
        );

        return updateResponse.data.success;
      }

      return false;
    } catch (error) {
      console.error("Error training expert:", error);
      return false;
    }
  }

  // Generate educational reel content
  async generateReelContent(
    expertUuid: string,
    topic: string,
    style: "hook" | "explanation" | "practical"
  ): Promise<string> {
    const prompts = {
      hook: `Create an engaging 30-second educational reel script about ${topic}. Start with a mind-blowing hook, include a fascinating fact, and end with a question that makes people want to learn more. Make it TikTok-style engaging but educational. Use emojis and conversational tone.`,

      explanation: `Explain ${topic} in simple terms for a 45-second educational reel. Use analogies, break down complex concepts, and make it relatable to everyday life. Include specific examples and end with an actionable insight.`,

      practical: `Create a practical "how-to" reel about ${topic} in 60 seconds. Give step-by-step guidance that viewers can immediately apply. Make it actionable and valuable.`,
    };

    try {
      const response = await this.chatWithExpert(expertUuid, prompts[style]);
      return response.content;
    } catch (error) {
      console.error("Error generating reel content:", error);
      return `Failed to generate content about ${topic}. Please try again.`;
    }
  }

  // Generate alternative perspectives on a topic
  async generateAlternativePerspectives(
    topic: string,
    currentExpertUuid: string,
    alternativeExperts: string[]
  ): Promise<{ expertUuid: string; perspective: string }[]> {
    const perspectives = await Promise.all(
      alternativeExperts.map(async (expertUuid) => {
        const prompt = `Give a unique perspective on "${topic}" from your expert domain. Keep it concise and highlight what makes your viewpoint different from others. Focus on insights only you would provide.`;

        const response = await this.chatWithExpert(expertUuid, prompt);
        return {
          expertUuid,
          perspective: response.content,
        };
      })
    );

    return perspectives;
  }

  getUserId(): string {
    return this.userId;
  }
}

// Export singleton instance
export const sensayAPI = new SensayAPI();
