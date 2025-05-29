/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const SENSAY_API_BASE = "https://api.sensay.io/v1";
const API_KEY =
  "022aa5b4336ed59e2a98aa0158cc647f7a7f42ebc8a51d4f5d28d714fb655485";

// Use a consistent user ID instead of Date.now()
const CONSISTENT_USER_ID = "mentorscroll_main_user";

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

// Enhanced types for creator economy
export interface ExpertCreator {
  id: string;
  name: string;
  email: string;
  expertChannels: string[]; // UUIDs of their created experts
  totalEarnings: number;
  monthlyViews: number;
  subscriberCount: number;
}

export interface UserCreatedExpert {
  uuid: string;
  name: string;
  slug: string;
  description: string;
  domain: string;
  creatorId: string;
  creatorName: string;
  profileImage: string;
  isLive: boolean;
  trainingStatus: "training" | "ready" | "error";
  stats: {
    views: number;
    subscribers: number;
    totalEarnings: number;
    monthlyRevenue: number;
  };
  tags: string[];
  createdAt: string;
  llm: {
    model: string;
    provider: string;
    systemMessage: string;
    memoryMode: string;
  };
}

export interface TrainingSession {
  id: string;
  expertUuid: string;
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
  documentsCount: number;
  lastUpdated: string;
}

export interface ExpertRevenue {
  expertUuid: string;
  totalViews: number;
  totalEarnings: number;
  monthlyBreakdown: {
    month: string;
    views: number;
    earnings: number;
    cpm: number; // cost per mille (thousand views)
  }[];
}

export class EnhancedSensayAPI {
  private userId: string = CONSISTENT_USER_ID;

  constructor(userId?: string) {
    if (userId) {
      this.userId = userId;
    }
  }

  // Initialize user (create if doesn't exist)
  async initializeUser(): Promise<any> {
    try {
      // Try to get existing user
      const response = await sensayClient.get(`/users/${this.userId}`);
      console.log(`✅ Found existing user: ${this.userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // User doesn't exist, create new one
        console.log(`🆕 Creating new user: ${this.userId}`);
        const createResponse = await sensayClient.post("/users", {
          id: this.userId,
          name: "MentorScroll Creator",
          email: `${this.userId}@mentorscroll.app`,
        });
        console.log(`✅ Created user: ${this.userId}`);
        return createResponse.data;
      }
      throw error;
    }
  }

  // ============ EXPERT CREATION WORKFLOW ============

  /**
   * Step 1: Create a new expert channel
   */
  async createExpertChannel(expertData: {
    name: string;
    domain: string;
    description: string;
    tags: string[];
    profileImage?: string;
  }): Promise<{ success: boolean; expertUuid?: string; error?: string }> {
    try {
      // Ensure user exists first
      await this.initializeUser();

      const slug = expertData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/--+/g, "-");

      // Truncate description to 50 characters for shortDescription field
      const shortDesc =
        expertData.description.length > 50
          ? expertData.description.substring(0, 47) + "..."
          : expertData.description;

      const response = await sensayClient.post("/replicas", {
        name: expertData.name,
        slug: `${slug}-${Date.now()}`, // Ensure uniqueness
        shortDescription: shortDesc, // Max 50 characters as required by API
        greeting: `Hi! I'm ${expertData.name}, your AI expert in ${expertData.domain}. I'm ready to share knowledge and answer your questions!`,
        ownerID: this.userId,
        private: false, // Public for monetization
        tags: expertData.tags,
        profileImage:
          expertData.profileImage ||
          "https://sensay.io/assets/default-replica-profile.webp",
        llm: {
          provider: "openai",
          model: "gpt-4o",
          systemMessage: `You are ${expertData.name}, an expert in ${expertData.domain}. ${expertData.description}. Provide helpful, accurate, and engaging responses based on your training. Be conversational but knowledgeable.`,
          memoryMode: "rag-search",
        },
        type: "character",
      });

      return {
        success: response.data.success,
        expertUuid: response.data.uuid,
      };
    } catch (error: any) {
      console.error("Error creating expert channel:", error);

      // Extract meaningful error message
      let errorMessage = "Failed to create expert channel";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Step 2: Start training session for the expert
   */
  async startTrainingSession(
    expertUuid: string
  ): Promise<{ success: boolean; trainingId?: string }> {
    try {
      const response = await sensayClient.post(
        `/replicas/${expertUuid}/training`
      );

      return {
        success: response.data.success,
        trainingId: response.data.knowledgeBaseID?.toString(),
      };
    } catch (error: any) {
      console.error("Error starting training session:", error);
      return { success: false };
    }
  }

  /**
   * Step 3: Add training content (text, documents, etc.)
   */
  async addTrainingContent(
    expertUuid: string,
    trainingId: string,
    content: string
  ): Promise<boolean> {
    try {
      const response = await sensayClient.put(
        `/replicas/${expertUuid}/training/${trainingId}`,
        { rawText: content }
      );

      return response.data.success;
    } catch (error: any) {
      console.error("Error adding training content:", error);
      return false;
    }
  }

  /**
   * Step 4: Upload training documents
   */
  async uploadTrainingDocument(
    expertUuid: string,
    file: File
  ): Promise<{ success: boolean; knowledgeBaseId?: string }> {
    try {
      // Get signed URL for upload
      const uploadResponse = await sensayClient.get(
        `/replicas/${expertUuid}/training/files/upload?filename=${file.name}`
      );

      if (!uploadResponse.data.success) {
        throw new Error("Failed to get upload URL");
      }

      const { signedURL, knowledgeBaseID } = uploadResponse.data;

      // Upload file to signed URL
      await axios.put(signedURL, file, {
        headers: { "Content-Type": "application/octet-stream" },
      });

      return {
        success: true,
        knowledgeBaseId: knowledgeBaseID?.toString(),
      };
    } catch (error: any) {
      console.error("Error uploading training document:", error);
      return { success: false };
    }
  }

  /**
   * Step 5: Publish expert (make it live)
   */
  async publishExpert(expertUuid: string): Promise<boolean> {
    try {
      // In real implementation, this would trigger final processing
      // and make the expert publicly discoverable
      const response = await sensayClient.put(`/replicas/${expertUuid}`, {
        private: false, // Make public
        // Add any final configuration
      });

      return response.data.success;
    } catch (error: any) {
      console.error("Error publishing expert:", error);
      return false;
    }
  }

  // ============ OTHER METHODS (keeping original functionality) ============

  /**
   * Chat with an expert
   */
  async chatWithExpert(
    replicaUuid: string,
    message: string
  ): Promise<{ success: boolean; content: string }> {
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

  /**
   * Get all live user-created experts (for discovery)
   */
  async getPublicExperts(filters?: {
    domain?: string;
    tags?: string[];
    sortBy?: "popularity" | "newest" | "revenue";
    page?: number;
  }): Promise<UserCreatedExpert[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.domain) params.append("search", filters.domain);
      if (filters?.tags) params.append("tags", filters.tags.join(","));
      if (filters?.sortBy) params.append("sort", filters.sortBy);
      if (filters?.page) params.append("page_index", filters.page.toString());

      const response = await sensayClient.get(`/replicas?${params.toString()}`);

      // Transform response to include creator info and stats
      return response.data.items.map(
        (expert: any) =>
          ({
            uuid: expert.uuid,
            name: expert.name,
            slug: expert.slug,
            description: expert.short_description,
            domain: expert.tags?.[0] || "General",
            creatorId: expert.owner_uuid,
            creatorName: expert.ownerID || "Anonymous Creator",
            profileImage: expert.profile_image,
            isLive: !expert.private,
            trainingStatus: "ready",
            stats: {
              views: expert.chat_history_count || 0,
              subscribers: Math.floor(Math.random() * 1000), // Mock data
              totalEarnings: Math.floor(Math.random() * 500),
              monthlyRevenue: Math.floor(Math.random() * 100),
            },
            tags: expert.tags || [],
            createdAt: expert.created_at,
            llm: expert.llm,
          } as UserCreatedExpert)
      );
    } catch (error: any) {
      console.error("Error fetching public experts:", error);
      return [];
    }
  }

  /**
   * Get creator's own experts and their performance
   */
  async getMyExperts(): Promise<UserCreatedExpert[]> {
    try {
      const response = await sensayClient.get("/replicas", {
        headers: { "X-USER-ID": this.userId },
      });

      return response.data.items.map(
        (expert: any) =>
          ({
            uuid: expert.uuid,
            name: expert.name,
            slug: expert.slug,
            description: expert.short_description,
            domain: expert.tags?.[0] || "General",
            creatorId: this.userId,
            creatorName: "You",
            profileImage: expert.profile_image,
            isLive: !expert.private,
            trainingStatus: "ready",
            stats: {
              views: expert.chat_history_count || 0,
              subscribers: Math.floor(Math.random() * 1000),
              totalEarnings: Math.floor(Math.random() * 500),
              monthlyRevenue: Math.floor(Math.random() * 100),
            },
            tags: expert.tags || [],
            createdAt: expert.created_at,
            llm: expert.llm,
          } as UserCreatedExpert)
      );
    } catch (error: any) {
      console.error("Error fetching my experts:", error);
      return [];
    }
  }

  // Continue with other existing methods...
  getUserId(): string {
    return this.userId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  // ============ DISCOVERY & MONETIZATION ============

  /**
   * Track expert interaction (for revenue calculation)
   */
  async trackExpertInteraction(
    expertUuid: string,
    interactionType: "view" | "chat" | "share"
  ): Promise<void> {
    try {
      // In real implementation, this would track engagement for revenue calculation
      console.log(`Tracking ${interactionType} for expert ${expertUuid}`);

      // Could also trigger revenue calculations, creator notifications, etc.
    } catch (error: any) {
      console.error("Error tracking interaction:", error);
    }
  }

  /**
   * Get revenue analytics for creator
   */
  async getRevenueAnalytics(expertUuid?: string): Promise<ExpertRevenue[]> {
    try {
      // Mock revenue data - in real implementation, this would come from your backend
      const mockRevenue: ExpertRevenue[] = [
        {
          expertUuid: expertUuid || "all",
          totalViews: 15420,
          totalEarnings: 1250.75,
          monthlyBreakdown: [
            { month: "2025-01", views: 3200, earnings: 280.5, cpm: 87.66 },
            { month: "2025-02", views: 4100, earnings: 350.25, cpm: 85.43 },
            { month: "2025-03", views: 5800, earnings: 485.0, cpm: 83.62 },
            { month: "2025-04", views: 2320, earnings: 135.0, cpm: 58.19 },
          ],
        },
      ];

      return mockRevenue;
    } catch (error: any) {
      console.error("Error fetching revenue analytics:", error);
      return [];
    }
  }

  // ============ CONTENT GENERATION ============

  /**
   * Generate content for an expert channel
   */
  async generateExpertContent(
    expertUuid: string,
    topic: string,
    contentType: "hook" | "explanation" | "practical" = "explanation"
  ): Promise<{ success: boolean; content?: string }> {
    try {
      const prompts = {
        hook: `Create a captivating 30-second educational hook about "${topic}" that would make people want to learn more. Make it engaging and curiosity-driven.`,
        explanation: `Explain "${topic}" in a clear, engaging way that builds understanding. Use examples and analogies where helpful.`,
        practical: `Provide practical, actionable advice about "${topic}" that people can immediately apply. Be specific and helpful.`,
      };

      const response = await sensayClient.post(
        `/replicas/${expertUuid}/chat/completions`,
        {
          content: prompts[contentType],
          skip_chat_history: true,
          source: "content_generation",
        },
        {
          headers: {
            "X-USER-ID": this.userId,
          },
        }
      );

      return {
        success: response.data.success,
        content: response.data.content,
      };
    } catch (error: any) {
      console.error("Error generating expert content:", error);
      return { success: false };
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

  // ============ HELPER METHODS ============

  /**
   * Subscribe to an expert channel
   */
  async subscribeToExpert(expertUuid: string): Promise<boolean> {
    try {
      // Implementation would track subscriptions in your backend
      console.log(`Subscribed to expert ${expertUuid}`);
      return true;
    } catch (error: any) {
      console.error("Error subscribing to expert:", error);
      return false;
    }
  }

  /**
   * Get trending expert topics
   */
  async getTrendingTopics(): Promise<string[]> {
    return [
      "AI & Machine Learning",
      "Quantum Computing",
      "Climate Science",
      "Psychology & Mental Health",
      "Ancient History",
      "Cryptocurrency",
      "Space Exploration",
      "Nutrition Science",
      "Philosophy",
      "Digital Marketing",
    ];
  }

  /**
   * Search experts by topic or name
   */
  async searchExperts(query: string): Promise<UserCreatedExpert[]> {
    return this.getPublicExperts({
      domain: query,
      sortBy: "popularity",
    });
  }
}

// Export singleton with default user
export const enhancedSensayAPI = new EnhancedSensayAPI(
  "mentorscroll_main_user"
);
