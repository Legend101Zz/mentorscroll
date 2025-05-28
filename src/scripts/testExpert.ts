import { sensayAPI } from "../lib/sensay";
import { contentGenerator } from "../lib/contentGenerator";
import { EXPERT_CONFIGS } from "../data/experts";

const expertSlug = process.argv[2] || "dr-quantum";

async function testExpert(slug: string) {
  console.log(`\n🧪 Testing Expert: ${slug}`);
  console.log("=".repeat(50));

  try {
    // Initialize systems
    await contentGenerator.initialize();

    const expertConfig = EXPERT_CONFIGS.find((e) => e.slug === slug);
    if (!expertConfig) {
      console.log(`❌ Expert '${slug}' not found in config`);
      console.log(
        "Available experts:",
        EXPERT_CONFIGS.map((e) => e.slug).join(", ")
      );
      return;
    }

    // Get expert replica
    const replicas = await sensayAPI.getExpertReplicas();
    const expert = replicas.find((r) => r.slug === slug);

    if (!expert) {
      console.log(
        `❌ Expert '${slug}' not found in Sensay. Run: npm run setup-experts`
      );
      return;
    }

    console.log(`✅ Found expert: ${expert.name}`);
    console.log(`📝 Description: ${expertConfig.shortDescription}`);
    console.log(`🏷️  Tags: ${expertConfig.tags.join(", ")}`);

    // Test 1: Basic chat functionality
    console.log("\n🗣️  Test 1: Basic Chat");
    console.log("-".repeat(30));

    const chatResponse = await sensayAPI.chatWithExpert(
      expert.uuid,
      "Introduce yourself and explain your expertise in 2-3 sentences."
    );

    if (chatResponse.success) {
      console.log(`💬 Response: ${chatResponse.content}`);
    } else {
      console.log("❌ Chat test failed");
      return;
    }

    // Test 2: Content generation
    console.log("\n🎬 Test 2: Reel Content Generation");
    console.log("-".repeat(30));

    const testTopic = expertConfig.sampleTopics[0];
    console.log(`📚 Topic: ${testTopic}`);

    const hookReel = await contentGenerator.generateReel(
      slug,
      testTopic,
      "hook"
    );

    if (hookReel) {
      console.log(`✅ Generated Hook Reel:`);
      console.log(`   Title: ${hookReel.title}`);
      console.log(`   Duration: ${hookReel.duration}`);
      console.log(
        `   Content Preview: ${hookReel.content?.substring(0, 100)}...`
      );
    } else {
      console.log("❌ Content generation failed");
    }

    // Test 3: Educational conversation
    console.log("\n🎓 Test 3: Educational Follow-up");
    console.log("-".repeat(30));

    const followUpResponse = await sensayAPI.chatWithExpert(
      expert.uuid,
      `A student watched content about "${testTopic}" and asks: "Can you explain this more simply with an analogy I can relate to?"`
    );

    if (followUpResponse.success) {
      console.log(`🎯 Educational Response: ${followUpResponse.content}`);
    } else {
      console.log("❌ Educational follow-up failed");
    }

    // Test 4: Alternative perspectives
    console.log("\n🔄 Test 4: Alternative Perspectives");
    console.log("-".repeat(30));

    const alternatives = await contentGenerator.generateAlternativePerspectives(
      testTopic
    );

    if (alternatives.length > 0) {
      console.log(
        `✅ Generated ${alternatives.length} alternative perspectives:`
      );
      alternatives.forEach((alt, i) => {
        console.log(`   ${i + 1}. ${alt.expertName}: ${alt.title}`);
      });
    } else {
      console.log("⚠️  No alternative perspectives generated");
    }

    console.log("\n🎉 Expert test completed successfully!");

    // Provide usage suggestions
    console.log("\n💡 Try these commands:");
    console.log(
      `   Chat: await sensayAPI.chatWithExpert('${expert.uuid}', 'your question')`
    );
    console.log(
      `   Generate: await contentGenerator.generateReel('${slug}', 'topic', 'hook')`
    );
  } catch (error: any) {
    console.error(`❌ Test failed:`, error.message);

    if (error.response?.status === 401) {
      console.log("🔑 Check your API key in src/lib/sensay.ts");
    } else if (error.response?.status === 404) {
      console.log("🏗️  Run: npm run setup-experts");
    }
  }
}

// Show available experts if no argument provided
if (!process.argv[2]) {
  console.log("🧠 Available Experts:");
  console.log("=".repeat(30));
  EXPERT_CONFIGS.forEach((expert) => {
    console.log(`📚 ${expert.slug}: ${expert.name}`);
    console.log(`   ${expert.shortDescription}`);
    console.log(`   Sample: ${expert.sampleTopics[0]}\n`);
  });
  console.log("Usage: npm run test-expert <expert-slug>");
  console.log("Example: npm run test-expert dr-quantum");
} else {
  // Run the test
  testExpert(expertSlug)
    .then(() => {
      console.log("\n✅ Test completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Test failed:", error);
      process.exit(1);
    });
}
