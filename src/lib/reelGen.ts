import { enhancedSensayAPI } from "./sensay";

import { EXPERT_CONFIGS } from "@/data/experts";

export class MentorScrollContentGenerator {
  private experts: any[] = EXPERT_CONFIGS;

  // Generate a learning reel from Sensay expert
  async generateLearningReel(
    topic: string,
    expertId: string,
    difficulty: "beginner" | "intermediate" | "advanced" = "beginner",
    contentType: "hook" | "explanation" | "deep-dive" = "explanation"
  ): Promise<any | null> {
    try {
      const expert = this.experts.find((e) => e.id === expertId);
      if (!expert) return null;

      // Generate content based on type
      const prompt = this.createPrompt(topic, contentType, difficulty, expert);

      const response = await enhancedSensayAPI.chatWithExpert(
        expert.replicaId,
        prompt
      );

      if (!response.success) return null;

      // Parse the response to extract structured content
      const parsedContent = this.parseExpertResponse(
        response.content,
        expert,
        topic,
        difficulty
      );

      return parsedContent;
    } catch (error) {
      console.error("Error generating learning reel:", error);
      return null;
    }
  }

  // Generate alternative perspectives on the same topic
  async generateAlternativePerspectives(
    topic: string,
    originalExpertId: string,
    maxAlternatives: number = 3
  ): Promise<any[]> {
    try {
      const alternativeExperts = this.experts
        .filter((e) => e.id !== originalExpertId)
        .slice(0, maxAlternatives);

      const alternatives = await Promise.all(
        alternativeExperts.map((expert) =>
          this.generateLearningReel(
            topic,
            expert.id,
            "intermediate",
            "explanation"
          )
        )
      );

      return alternatives.filter(Boolean) as any[];
    } catch (error) {
      console.error("Error generating alternatives:", error);
      return [];
    }
  }

  // Generate a learning series
  async generateLearningSeries(
    topic: string,
    expertId: string,
    episodeCount: number = 5
  ): Promise<any[]> {
    try {
      const expert = this.experts.find((e) => e.id === expertId);
      if (!expert) return [];

      // First, get the series outline
      const outlinePrompt = `Create a ${episodeCount}-part learning series about "${topic}". 
            For each episode, provide:
            1. Episode title (max 60 characters)
            2. Key concept to teach
            3. Engaging hook (one sentence with emoji)
            4. Main insight/takeaway

            Format as:
            Episode 1: [Title]
            Hook: [Hook with emoji]
            Concept: [Key concept]
            Insight: [Main takeaway]

            [Repeat for all episodes]`;

      const outlineResponse = await enhancedSensayAPI.chatWithExpert(
        expert.replicaId,
        outlinePrompt
      );

      if (!outlineResponse.success) return [];

      // Parse the outline and generate full content for each episode
      const episodes = this.parseSeriesOutline(outlineResponse.content);
      const seriesId = `${expertId}-${topic
        .toLowerCase()
        .replace(/\s+/g, "-")}-${Date.now()}`;

      const fullEpisodes = await Promise.all(
        episodes.map(async (episode, index) => {
          const episodePrompt = `Create detailed educational content for Episode ${
            index + 1
          } of a series about "${topic}".

                    Title: ${episode.title}
                    Hook: ${episode.hook}
                    Key Concept: ${episode.concept}

                    Provide:
                    1. Detailed explanation (300-500 words) that builds understanding
                    2. Practical examples and analogies
                    3. A profound key insight
                    4. 3-4 actionable takeaways
                    5. A thought-provoking quiz question with 4 options (mark correct answer)

                    Write in an engaging, conversational tone that makes complex topics accessible.`;

          const contentResponse = await enhancedSensayAPI.chatWithExpert(
            expert.replicaId,
            episodePrompt
          );

          if (contentResponse.success) {
            return this.parseEpisodeContent(
              contentResponse.content,
              expert,
              episode.title,
              episode.hook,
              seriesId,
              index + 1,
              episodeCount
            );
          }
          return null;
        })
      );

      return fullEpisodes.filter(Boolean) as any[];
    } catch (error) {
      console.error("Error generating learning series:", error);
      return [];
    }
  }

  // Create optimized prompts for different content types
  private createPrompt(
    topic: string,
    contentType: string,
    difficulty: string,
    expert: any
  ): string {
    const baseContext = `You are ${expert.name}, ${expert.role}. Your personality: ${expert.personality}.`;

    const prompts = {
      hook: `${baseContext}

            Create a captivating hook about "${topic}" for ${difficulty} learners. 
            
            Requirements:
            - Start with a mind-blowing emoji and fact
            - Make it impossible to ignore
            - Connect to something relatable
            - Under 50 words
            - Make people think "I NEED to know more"
            
            Format: [Emoji] [Surprising statement that makes people stop scrolling]`,

      explanation: `${baseContext}

            Create educational content about "${topic}" for ${difficulty} learners.
            
            Structure:
            1. HOOK: Attention-grabbing opener with emoji (1 sentence)
            2. EXPLANATION: Clear, detailed explanation with examples (300-400 words)
            3. KEY INSIGHT: Profound takeaway that changes perspective (1-2 sentences with emoji)
            4. ACTIONS: 3-4 specific things readers can do next
            5. QUIZ: One multiple-choice question with 4 options (mark correct answer)
            
            Tone: Conversational, enthusiastic, use analogies and real-world examples.
            Make complex topics feel accessible and exciting.`,

      "deep-dive": `${baseContext}

            Create an in-depth exploration of "${topic}" for ${difficulty} learners.
            
            Include:
            - Comprehensive explanation with multiple perspectives
            - Historical context and recent developments  
            - Practical applications and implications
            - Common misconceptions to avoid
            - Advanced concepts for deeper understanding
            - Resources for further learning
            
            Write 500-700 words in your expertise style.`,
    };

    return prompts[contentType as keyof typeof prompts] || prompts.explanation;
  }

  // Parse expert response into structured content
  private parseExpertResponse(
    content: string,
    expert: any,
    topic: string,
    difficulty: "beginner" | "intermediate" | "advanced"
  ): any {
    // This is a simplified parser - in production, you'd use more sophisticated NLP
    const lines = content.split("\n").filter((line) => line.trim());

    let hook = "";
    let mainContent = "";
    let keyInsight = "";
    let actionItems: string[] = [];
    let quiz = null;

    // Extract different sections based on patterns
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (
        line.toLowerCase().includes("hook") ||
        (i === 0 && line.includes("🤯"))
      ) {
        hook = line.replace(/^.*?hook:?\s*/i, "");
      } else if (
        line.toLowerCase().includes("key insight") ||
        line.includes("💡")
      ) {
        keyInsight = line.replace(/^.*?key insight:?\s*/i, "");
      } else if (line.toLowerCase().includes("action") || line.includes("•")) {
        // Collect action items
        let j = i;
        while (
          j < lines.length &&
          (lines[j].includes("•") ||
            lines[j].includes("-") ||
            lines[j].match(/^\d+\./))
        ) {
          actionItems.push(lines[j].replace(/^[\s\-\•\d\.]+/, "").trim());
          j++;
        }
        i = j - 1;
      } else if (!hook && !keyInsight && line.length > 50) {
        // Main content
        mainContent += line + "\n";
      }
    }

    // Generate ID and other metadata
    const reelId = `${expert.id}-${topic
      .toLowerCase()
      .replace(/\s+/g, "-")}-${Date.now()}`;

    return {
      id: reelId,
      title: this.extractTitle(content, topic),
      hook: hook || `🧠 Discover the fascinating world of ${topic}`,
      mainContent: mainContent.trim() || content,
      keyInsight:
        keyInsight ||
        `💡 Understanding ${topic} opens new perspectives on how the world works.`,
      expertName: expert.name,
      expertRole: expert.role,
      expertAvatar: expert.avatar,
      sensayReplicaId: expert.replicaId,
      tags: expert.expertise,
      difficulty,
      readTime: this.estimateReadTime(mainContent),
      stats: {
        views: Math.floor(Math.random() * 50000) + 1000,
        likes: Math.floor(Math.random() * 5000) + 100,
        saves: Math.floor(Math.random() * 1000) + 50,
        discussions: Math.floor(Math.random() * 200) + 10,
      },
      colorTheme: expert.colorTheme,
      visualElements: {
        icon: this.getIconForTopic(topic),
        pattern: this.getPatternForExpert(expert.id),
        animation: this.getAnimationForDifficulty(difficulty),
      },
      interactiveElements: {
        actionItems:
          actionItems.length > 0
            ? actionItems
            : [
                `Explore more about ${topic}`,
                `Apply this knowledge in your daily life`,
                `Share this insight with others`,
              ],
        deepDive: {
          title: `Deep Dive with ${expert.name}`,
          description: `Get personalized insights about ${topic}`,
          replicaId: expert.replicaId,
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Helper methods for content parsing and generation
  private extractTitle(content: string, fallbackTopic: string): string {
    const lines = content.split("\n");
    const firstLine = lines[0]?.trim();

    if (firstLine && firstLine.length < 80 && !firstLine.includes(".")) {
      return firstLine.replace(/^title:?\s*/i, "");
    }

    return `Understanding ${fallbackTopic}`;
  }

  private estimateReadTime(content: string): string {
    const words = content.split(" ").length;
    const minutes = Math.ceil(words / 200); // Average reading speed
    return `${minutes} min`;
  }

  private getPatternForExpert(
    expertId: string
  ): "dots" | "waves" | "geometric" | "particles" {
    const patterns = {
      "dr-quantum": "particles" as const,
      "dr-mind": "geometric" as const,
      "prof-timeline": "dots" as const,
      "eco-emma": "waves" as const,
      "codemaster-alex": "geometric" as const,
    };
    return patterns[expertId as keyof typeof patterns] || "dots";
  }

  private getAnimationForDifficulty(
    difficulty: string
  ): "float" | "pulse" | "rotate" | "bounce" {
    const animations = {
      beginner: "bounce" as const,
      intermediate: "float" as const,
      advanced: "pulse" as const,
    };
    return animations[difficulty as keyof typeof animations] || "float";
  }

  // Parse series outline from expert response
  private parseSeriesOutline(content: string) {
    const episodes = [];
    const lines = content.split("\n");

    let currentEpisode: any = {};

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.match(/^Episode \d+:/)) {
        if (currentEpisode.title) {
          episodes.push(currentEpisode);
        }
        currentEpisode = {
          title: trimmed.replace(/^Episode \d+:\s*/, ""),
        };
      } else if (trimmed.toLowerCase().startsWith("hook:")) {
        currentEpisode.hook = trimmed.replace(/^hook:\s*/i, "");
      } else if (trimmed.toLowerCase().startsWith("concept:")) {
        currentEpisode.concept = trimmed.replace(/^concept:\s*/i, "");
      } else if (trimmed.toLowerCase().startsWith("insight:")) {
        currentEpisode.insight = trimmed.replace(/^insight:\s*/i, "");
      }
    }

    if (currentEpisode.title) {
      episodes.push(currentEpisode);
    }

    return episodes;
  }

  // Parse individual episode content
  private parseEpisodeContent(
    content: string,
    expert: any,
    title: string,
    hook: string,
    seriesId: string,
    episodeNumber: number,
    totalEpisodes: number
  ): any {
    return {
      id: `${seriesId}-ep${episodeNumber}`,
      title,
      hook,
      mainContent: content,
      keyInsight: this.extractKeyInsight(content),
      expertName: expert.name,
      expertRole: expert.role,
      expertAvatar: expert.avatar,
      sensayReplicaId: expert.replicaId,
      tags: expert.expertise,
      difficulty: "intermediate",
      readTime: this.estimateReadTime(content),
      seriesId,
      episodeNumber,
      totalEpisodes,
      stats: {
        views: Math.floor(Math.random() * 30000) + 5000,
        likes: Math.floor(Math.random() * 3000) + 200,
        saves: Math.floor(Math.random() * 800) + 100,
        discussions: Math.floor(Math.random() * 150) + 20,
      },
      colorTheme: expert.colorTheme,
      visualElements: {
        icon: this.getIconForTopic(title),
        pattern: this.getPatternForExpert(expert.id),
        animation: "float",
      },
      interactiveElements: {
        actionItems: this.extractActionItems(content),
        deepDive: {
          title: `Continue with ${expert.name}`,
          description: `Dive deeper into ${title}`,
          replicaId: expert.replicaId,
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private extractKeyInsight(content: string): string {
    const lines = content.split("\n");
    const insightLine = lines.find(
      (line) =>
        line.toLowerCase().includes("key insight") ||
        line.includes("💡") ||
        line.toLowerCase().includes("takeaway")
    );

    return insightLine
      ? insightLine.replace(/^.*?(key insight|takeaway):?\s*/i, "")
      : "💡 Every new understanding opens doors to deeper questions and possibilities.";
  }

  private extractActionItems(content: string): string[] {
    const lines = content.split("\n");
    const actions = [];

    for (const line of lines) {
      if (line.match(/^[\s\-\•\d\.]+/) && line.length > 10) {
        actions.push(line.replace(/^[\s\-\•\d\.]+/, "").trim());
      }
    }

    return actions.length > 0
      ? actions.slice(0, 4)
      : [
          "Reflect on how this applies to your life",
          "Share this insight with someone",
          "Look for examples in your daily experience",
        ];
  }
}

// Export singleton instance
export const mentorScrollContentGenerator = new MentorScrollContentGenerator();
