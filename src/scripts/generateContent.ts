/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { contentGenerator } from "../lib/contentGenerator";
import { EXPERT_CONFIGS } from "../data/experts";

const GENERATED_REELS_FILE = "src/data/generatedReels.ts";

interface GenerationOptions {
  expert?: string;
  topic?: string;
  count?: number;
  type?: "hook" | "explanation" | "practical";
  trending?: boolean;
}

async function generateContent(options: GenerationOptions = {}) {
  console.log("🎬 MentorScroll Content Generator");
  console.log("=".repeat(50));

  try {
    // Initialize content generator
    console.log("🚀 Initializing AI experts...");
    await contentGenerator.initialize();
    console.log("✅ Experts ready!");

    let generatedReels: any[] = [];

    if (options.trending) {
      // Generate trending reels
      console.log(`\n📈 Generating ${options.count || 10} trending reels...`);
      generatedReels = await contentGenerator.generateTrendingReels(
        options.count || 10
      );
    } else if (options.expert && options.topic) {
      // Generate specific reel
      console.log(`\n🎯 Generating ${options.type || "hook"} reel...`);
      console.log(`   Expert: ${options.expert}`);
      console.log(`   Topic: ${options.topic}`);

      const reel = await contentGenerator.generateReel(
        options.expert,
        options.topic,
        options.type || "hook"
      );

      if (reel) {
        generatedReels = [reel];
      }
    } else if (options.expert) {
      // Generate learning journey for expert
      const expertConfig = EXPERT_CONFIGS.find(
        (e) => e.slug === options.expert
      );
      if (!expertConfig) {
        console.log(`❌ Expert '${options.expert}' not found`);
        return;
      }

      console.log(
        `\n📚 Generating learning journey for ${expertConfig.name}...`
      );
      const baseTopic = expertConfig.sampleTopics[0];
      generatedReels = await contentGenerator.generateLearningJourney(
        options.expert,
        baseTopic
      );
    } else {
      // Generate sample content from all experts
      console.log("\n🌟 Generating sample content from all experts...");

      for (const expert of EXPERT_CONFIGS) {
        console.log(`\n👨‍🏫 ${expert.name}:`);

        // Generate one reel from each expert
        const topic =
          expert.sampleTopics[
            Math.floor(Math.random() * expert.sampleTopics.length)
          ];
        const type = ["hook", "explanation", "practical"][
          Math.floor(Math.random() * 3)
        ] as any;

        const reel = await contentGenerator.generateReel(
          expert.slug,
          topic,
          type
        );

        if (reel) {
          generatedReels.push(reel);
          console.log(`   ✅ Generated: ${reel.title}`);
        } else {
          console.log(`   ❌ Failed to generate content`);
        }

        // Add delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    if (generatedReels.length === 0) {
      console.log("❌ No content generated");
      return;
    }

    // Load existing generated reels if they exist
    let existingReels: any[] = [];
    if (existsSync(GENERATED_REELS_FILE)) {
      try {
        const fileContent = readFileSync(GENERATED_REELS_FILE, "utf8");
        const match = fileContent.match(
          /export const generatedReels[^=]*=\s*(\[[\s\S]*?\]);/
        );
        if (match) {
          existingReels = eval(match[1]); // Note: eval is okay here for development
        }
      } catch (error) {
        console.log("⚠️  Could not parse existing reels file");
      }
    }

    // Merge with existing reels (avoid duplicates)
    const allReels = [...existingReels];
    for (const newReel of generatedReels) {
      const exists = allReels.some(
        (existing) =>
          existing.title === newReel.title &&
          existing.expertSlug === newReel.expertSlug
      );
      if (!exists) {
        allReels.unshift(newReel); // Add to beginning
      }
    }

    // Keep only latest 50 reels to avoid file getting too large
    const finalReels = allReels.slice(0, 50);

    // Generate TypeScript file
    const fileContent = `// src/data/generatedReels.ts
// Auto-generated educational reels from Sensay AI experts
// Generated on: ${new Date().toISOString()}

import { ReelData } from '../data/deckReels';

export const generatedReels: ReelData[] = ${JSON.stringify(
      finalReels,
      null,
      2
    )};

// Helper functions
export const getLatestReels = (count: number = 10): ReelData[] => {
  return generatedReels.slice(0, count);
};

export const getReelsByExpert = (expertSlug: string): ReelData[] => {
  return generatedReels.filter(reel => reel.instructorSlug === expertSlug);
};

export const getReelsByType = (type: 'hook' | 'explanation' | 'practical'): ReelData[] => {
  return generatedReels.filter(reel => reel.type === type);
};
`;

    // Write to file
    writeFileSync(GENERATED_REELS_FILE, fileContent, "utf8");

    console.log("\n🎉 Content Generation Complete!");
    console.log("=".repeat(50));
    console.log(`📊 Generated: ${generatedReels.length} new reels`);
    console.log(`💾 Total reels: ${finalReels.length}`);
    console.log(`📁 Saved to: ${GENERATED_REELS_FILE}`);

    // Show preview
    console.log("\n📋 Generated Content Preview:");
    console.log("-".repeat(30));
    generatedReels.slice(0, 3).forEach((reel, i) => {
      console.log(`${i + 1}. ${reel.title}`);
      console.log(`   by ${reel.expertName} (${reel.type})`);
      console.log(`   Topic: ${reel.topic}\n`);
    });

    if (generatedReels.length > 3) {
      console.log(`   ... and ${generatedReels.length - 3} more reels`);
    }

    console.log("\n💡 Next steps:");
    console.log("1. Import the generated reels in your app:");
    console.log('   import { generatedReels } from "./data/generatedReels";');
    console.log("2. Test the app: npm run dev");
    console.log(
      "3. Generate more content: npm run generate-content -- --trending --count 20"
    );
  } catch (error: any) {
    console.error("❌ Content generation failed:", error.message);

    if (error.response?.status === 401) {
      console.log("🔑 Check your Sensay API key");
    } else if (error.response?.status === 429) {
      console.log("⏰ Rate limited. Try again in a few minutes.");
    }
  }
}

// Parse command line arguments
function parseArgs(): GenerationOptions {
  const args = process.argv.slice(2);
  const options: GenerationOptions = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--expert":
        options.expert = args[++i];
        break;
      case "--topic":
        options.topic = args[++i];
        break;
      case "--type":
        options.type = args[++i] as any;
        break;
      case "--count":
        options.count = parseInt(args[++i]);
        break;
      case "--trending":
        options.trending = true;
        break;
    }
  }

  return options;
}

// Show help if no arguments
if (process.argv.length === 2) {
  console.log("📚 MentorScroll Content Generator");
  console.log("=".repeat(40));
  console.log("\nUsage Examples:");
  console.log(
    "  npm run generate-content                    # Sample from all experts"
  );
  console.log(
    "  npm run generate-content -- --trending --count 15    # 15 trending reels"
  );
  console.log(
    "  npm run generate-content -- --expert dr-quantum      # Learning journey"
  );
  console.log(
    '  npm run generate-content -- --expert dr-quantum --topic "black holes" --type hook'
  );

  console.log("\nAvailable Experts:");
  EXPERT_CONFIGS.forEach((expert) => {
    console.log(`  ${expert.slug}: ${expert.name}`);
  });

  console.log("\nTypes: hook, explanation, practical");
} else {
  // Run content generation
  const options = parseArgs();
  generateContent(options)
    .then(() => {
      console.log("\n✅ Generation completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Generation failed:", error);
      process.exit(1);
    });
}
