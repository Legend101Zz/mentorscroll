import { EnhancedSensayAPI } from "./sensay";
import { EXPERT_CONFIGS, getExpertBySlug } from "../data/experts";

export interface GeneratedReel {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  expertSlug: string;
  expertName: string;
  topic: string;
  tags: string[];
  color: string;
  thumbnailUrl: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "hook" | "explanation" | "practical";
}

export interface ReelPrompts {
  hook: string;
  explanation: string;
  practical: string;
}

// Color schemes for different expert domains
const EXPERT_COLORS = {
  "dr-quantum": "from-purple-600 to-blue-600",
  "codemaster-alex": "from-green-600 to-teal-600",
  "prof-timeline": "from-amber-600 to-orange-600",
  "dr-mind": "from-pink-600 to-rose-600",
  "eco-emma": "from-emerald-600 to-green-600",
};

// Educational topics for each expert
const TOPIC_BANK = {
  "dr-quantum": [
    "Quantum tunneling in smartphones",
    "Why parallel universes might exist",
    "How cats changed physics forever",
    "The universe's speed limit explained",
    "Time travel paradoxes solved",
    "Why you're constantly teleporting",
    "Black holes aren't what you think",
    "The double-slit experiment revelation",
  ],
  "codemaster-alex": [
    "How Netflix saves $1B with algorithms",
    "The one line powering the internet",
    "Why autocorrect fails so badly",
    "Building your first app in 30 minutes",
    "The bug that crashed everything",
    "How AI actually works (simply)",
    "Why software updates break things",
    "The algorithm controlling your life",
  ],
  "prof-timeline": [
    "The sandwich that started WWI",
    "How Rome predicted social media",
    "The accidental discovery changing everything",
    "Why civilizations really collapse",
    "The pattern repeating right now",
    "Ancient solutions to modern problems",
    "The historical figure you've never heard of",
    "How climate shaped human history",
  ],
  "dr-mind": [
    "Why your brain tricks you daily",
    "The psychology of social media addiction",
    "How to rewire your brain for happiness",
    "Why smart people make dumb decisions",
    "The one mindset shift that changes everything",
    "How your phone changes your brain",
    "The psychology behind procrastination",
    "Why we believe fake news",
  ],
  "eco-emma": [
    "The technology saving the planet",
    "Why renewable energy is unstoppable",
    "How your choices impact climate",
    "The surprising solution in your pocket",
    "Turning climate anxiety into action",
    "The breakthrough nobody talks about",
    "Why electric cars are inevitable",
    "How to save money saving the planet",
  ],
};

export class ContentGenerator {
  private expertReplicas: any[] = [];

  async initialize() {
    // Get all expert replicas
    this.expertReplicas = await EnhancedSensayAPI.getExpertReplicas();
    console.log(
      `🎯 Content generator initialized with ${this.expertReplicas.length} experts`
    );
  }

  // Generate a single educational reel
  async generateReel(
    expertSlug: string,
    topic: string,
    type: "hook" | "explanation" | "practical" = "hook"
  ): Promise<GeneratedReel | null> {
    try {
      const expert = this.expertReplicas.find((r) => r.slug === expertSlug);
      const expertConfig = getExpertBySlug(expertSlug);

      if (!expert || !expertConfig) {
        console.error(`Expert ${expertSlug} not found`);
        return null;
      }

      // Create the prompt based on type
      const prompts: ReelPrompts = {
        hook: `Create a captivating 30-second educational reel script about "${topic}" that would go viral on TikTok. Structure it as:

HOOK (0-3 seconds): Start with a mind-blowing statement or question that makes people stop scrolling
REVELATION (3-20 seconds): Share the fascinating science/insight with an easy-to-visualize analogy
CLIFFHANGER (20-30 seconds): End with an intriguing question or "wait, it gets weirder" moment

Make it conversational, use emojis, and include visual cues for what viewers would see. Keep it under 150 words.`,

        explanation: `Explain "${topic}" in a clear, engaging 45-second educational reel. Structure it as:

SETUP (0-5 seconds): Introduce the concept simply
BREAKDOWN (5-35 seconds): Use analogies and examples to explain how it works
TAKEAWAY (35-45 seconds): Give one practical insight viewers can remember

Make it accessible to beginners but still fascinating. Use metaphors people can visualize. Keep it under 200 words.`,

        practical: `Create a practical "how-to" reel about "${topic}" in 60 seconds. Structure it as:

PROMISE (0-5 seconds): What viewers will be able to do after watching
STEPS (5-50 seconds): 3-5 clear, actionable steps they can follow
MOTIVATION (50-60 seconds): Encourage them to try it and what they'll gain

Make it immediately actionable with specific steps. Keep it under 250 words.`,
      };

      // Generate content using the expert
      const response = await EnhancedSensayAPI.chatWithExpert(
        expert.uuid,
        prompts[type]
      );

      if (!response.success) {
        console.error(`Failed to generate content for ${topic}`);
        return null;
      }

      // Create the reel object
      const reel: GeneratedReel = {
        id: `reel_${expertSlug}_${Date.now()}`,
        title: this.extractTitle(response.content, topic),
        subtitle: expertConfig.shortDescription,
        content: response.content,
        expertSlug: expertSlug,
        expertName: expertConfig.name,
        topic: topic,
        tags: expertConfig.tags,
        color:
          EXPERT_COLORS[expertSlug as keyof typeof EXPERT_COLORS] ||
          "from-gray-600 to-gray-800",
        thumbnailUrl: expertConfig.profileImage,
        duration: this.getDuration(type),
        difficulty: "beginner",
        type: type,
      };

      console.log(
        `✅ Generated ${type} reel: "${reel.title}" by ${reel.expertName}`
      );
      return reel;
    } catch (error: any) {
      console.error(`Error generating reel for ${expertSlug}:`, error.message);
      return null;
    }
  }

  // Generate multiple reels for a topic from different expert perspectives
  async generateAlternativePerspectives(
    topic: string
  ): Promise<GeneratedReel[]> {
    const reels: GeneratedReel[] = [];

    // Find relevant experts for this topic
    const relevantExperts = this.findRelevantExperts(topic);

    for (const expertSlug of relevantExperts) {
      const reel = await this.generateReel(expertSlug, topic, "explanation");
      if (reel) {
        reels.push(reel);
      }

      // Add delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return reels;
  }

  // Generate a learning series on a topic
  async generateLearningJourney(
    expertSlug: string,
    baseTopic: string
  ): Promise<GeneratedReel[]> {
    const journey: GeneratedReel[] = [];

    try {
      const expert = this.expertReplicas.find((r) => r.slug === expertSlug);
      if (!expert) return journey;

      // Generate a series progression
      const seriesPrompt = `Create a 5-part learning journey about "${baseTopic}". For each part, provide:
1. A catchy title
2. The key concept to teach
3. How it builds on previous parts

Format as:
Part 1: [Title] - [Concept]
Part 2: [Title] - [Concept]
...

Keep each title under 50 characters and make them intriguing.`;

      const seriesResponse = await EnhancedSensayAPI.chatWithExpert(
        expert.uuid,
        seriesPrompt
      );

      if (seriesResponse.success) {
        // Parse the response to extract topics
        const topics = this.parseSeriesTopics(seriesResponse.content);

        // Generate reels for each topic
        for (let i = 0; i < topics.length; i++) {
          const type =
            i === 0
              ? "hook"
              : i === topics.length - 1
              ? "practical"
              : "explanation";
          const reel = await this.generateReel(
            expertSlug,
            topics[i],
            type as any
          );

          if (reel) {
            reel.id = `${reel.id}_series_${i + 1}`;
            journey.push(reel);
          }

          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    } catch (error: any) {
      console.error(`Error generating learning journey:`, error.message);
    }

    return journey;
  }

  // Generate trending reels using random topics
  async generateTrendingReels(count: number = 10): Promise<GeneratedReel[]> {
    const reels: GeneratedReel[] = [];

    try {
      for (let i = 0; i < count; i++) {
        // Pick random expert and topic
        const expertSlugs = Object.keys(TOPIC_BANK);
        const randomExpert =
          expertSlugs[Math.floor(Math.random() * expertSlugs.length)];
        const topics = TOPIC_BANK[randomExpert as keyof typeof TOPIC_BANK];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const randomType = ["hook", "explanation", "practical"][
          Math.floor(Math.random() * 3)
        ] as "hook" | "explanation" | "practical";

        const reel = await this.generateReel(
          randomExpert,
          randomTopic,
          randomType
        );

        if (reel) {
          reels.push(reel);
        }

        // Add delay between generations
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error: any) {
      console.error("Error generating trending reels:", error.message);
    }

    return reels;
  }

  // Chat with an expert about a specific reel
  async chatAboutReel(reelId: string, question: string): Promise<string> {
    try {
      // Find the reel (you'd implement reel storage)
      // For now, we'll use a simple approach
      const expertSlug = reelId.split("_")[1]; // Assuming format: reel_expertslug_timestamp
      const expert = this.expertReplicas.find((r) => r.slug === expertSlug);

      if (!expert) {
        return "Sorry, I couldn't find the expert for this reel.";
      }

      const contextualQuestion = `A user is asking about educational content you created. Their question: "${question}". Please provide a helpful, encouraging response that builds on the educational content and maintains your personality.`;

      const response = await sensayAPI.chatWithExpert(
        expert.uuid,
        contextualQuestion
      );

      return response.success
        ? response.content
        : "Sorry, I'm having trouble responding right now. Please try again!";
    } catch (error: any) {
      console.error("Error chatting about reel:", error.message);
      return "Sorry, there was an error. Please try again!";
    }
  }

  // Helper methods
  private extractTitle(content: string, fallbackTopic: string): string {
    // Try to extract a catchy title from the content
    const lines = content.split("\n").filter((line) => line.trim());
    const firstLine = lines[0];

    // If first line looks like a title (short and catchy), use it
    if (firstLine && firstLine.length < 60 && !firstLine.includes(".")) {
      return firstLine.replace(/[^\w\s!'?-]/g, "").trim();
    }

    // Look for quoted text or emphasized text
    const quotedMatch = content.match(/"([^"]+)"/);
    if (quotedMatch && quotedMatch[1].length < 60) {
      return quotedMatch[1];
    }

    // Fall back to topic
    return fallbackTopic;
  }

  private getDuration(type: string): string {
    return type === "hook"
      ? "30 sec"
      : type === "explanation"
      ? "45 sec"
      : "60 sec";
  }

  private findRelevantExperts(topic: string): string[] {
    const topicLower = topic.toLowerCase();
    const relevantExperts: string[] = [];

    // Simple keyword matching
    if (
      topicLower.includes("physics") ||
      topicLower.includes("quantum") ||
      topicLower.includes("science")
    ) {
      relevantExperts.push("dr-quantum");
    }
    if (
      topicLower.includes("code") ||
      topicLower.includes("program") ||
      topicLower.includes("tech")
    ) {
      relevantExperts.push("codemaster-alex");
    }
    if (
      topicLower.includes("history") ||
      topicLower.includes("historical") ||
      topicLower.includes("ancient")
    ) {
      relevantExperts.push("prof-timeline");
    }
    if (
      topicLower.includes("psychology") ||
      topicLower.includes("mind") ||
      topicLower.includes("behavior")
    ) {
      relevantExperts.push("dr-mind");
    }
    if (
      topicLower.includes("climate") ||
      topicLower.includes("environment") ||
      topicLower.includes("green")
    ) {
      relevantExperts.push("eco-emma");
    }

    // If no specific matches, include all experts for diverse perspectives
    if (relevantExperts.length === 0) {
      return ["dr-quantum", "codemaster-alex", "prof-timeline"];
    }

    return relevantExperts;
  }

  private parseSeriesTopics(content: string): string[] {
    const lines = content.split("\n").filter((line) => line.trim());
    const topics: string[] = [];

    for (const line of lines) {
      const match = line.match(/Part \d+:\s*(.+?)(?:\s*-|$)/);
      if (match) {
        topics.push(match[1].trim());
      }
    }

    return topics.slice(0, 5); // Limit to 5 topics
  }
}

// Export singleton instance
export const contentGenerator = new ContentGenerator();
