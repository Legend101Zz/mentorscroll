/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { sensayAPI } from "../lib/sensay";

const OLD_EXPERT_UUIDS = [
  "fa62be14-a91d-49f5-bab3-63806db40722", // Dr. Quantum
  "b03b196c-3b2b-42b4-bfc8-54cb4b3186aa", // CodeMaster Alex
  "dd767cbf-fc2a-41fd-8729-eb25b3aa022d", // Prof. Timeline
  "deb1e583-3619-4b9e-9ab5-b82b1dde07db", // Dr. Mind
  "ed0b4720-f8df-4592-bae4-f4035cf14b92", // Eco Emma
];

async function cleanup() {
  console.log("🧹 MentorScroll Cleanup & Migration");
  console.log("=".repeat(50));

  console.log(
    "ℹ️  This will clean up old experts and recreate them under a consistent user ID"
  );
  console.log("💡 Your new consistent user ID: mentorscroll_main_user");

  try {
    // Initialize with consistent user ID
    console.log("\n👤 Initializing consistent user...");
    await sensayAPI.initializeUser();

    // Check if we can access the old experts (probably not)
    console.log("\n🔍 Checking current expert access...");
    const currentReplicas = await sensayAPI.getExpertReplicas();
    console.log(`📊 Found ${currentReplicas.length} accessible experts`);

    if (currentReplicas.length > 0) {
      console.log("✅ Experts already accessible with consistent user ID!");
      console.log("\nAccessible experts:");
      currentReplicas.forEach((replica) => {
        console.log(`   - ${replica.name} (${replica.slug}): ${replica.uuid}`);
      });

      if (currentReplicas.length >= 5) {
        console.log("\n🎉 All experts are accessible! No cleanup needed.");
        return;
      }
    }

    console.log("\n⚠️  Experts not accessible with consistent user ID.");
    console.log("🔄 You have two options:");
    console.log("   1. Re-run setup (recommended): npm run setup-experts");
    console.log("   2. The old experts may still exist but are not accessible");

    console.log("\n💡 Next steps:");
    console.log("1. Run: npm run setup-experts");
    console.log("2. This will create new experts under the consistent user ID");
    console.log("3. Test with: npm run test-expert dr-quantum");
  } catch (error: any) {
    console.error("❌ Cleanup failed:", error.message);

    if (error.response?.status === 401) {
      console.log("\n🔑 Authentication issue - this is expected");
      console.log("💡 Just run: npm run setup-experts");
    }
  }
}

// Show current user info
async function showUserInfo() {
  console.log("\n📋 Current Configuration:");
  console.log("-".repeat(30));
  console.log(`🆔 User ID: ${sensayAPI.getUserId()}`);
  console.log(
    `🔑 API Key: ${
      process.env.NEXT_PUBLIC_SENSAY_API_KEY || "Set in sensay.ts"
    }`
  );

  try {
    const replicas = await sensayAPI.getExpertReplicas();
    console.log(`📊 Accessible Experts: ${replicas.length}`);

    if (replicas.length > 0) {
      console.log("\nAccessible Experts:");
      replicas.forEach((replica) => {
        console.log(`   ✅ ${replica.name} (${replica.slug})`);
      });
    }
  } catch (error) {
    console.log(
      `❌ Cannot access experts (this is expected if migration needed)`
    );
  }
}

// Main execution
if (require.main === module) {
  const command = process.argv[2];

  if (command === "info") {
    showUserInfo()
      .then(() => {
        console.log("\n✅ Info displayed!");
        process.exit(0);
      })
      .catch((error) => {
        console.error("❌ Error:", error);
        process.exit(1);
      });
  } else {
    cleanup()
      .then(() => {
        console.log("\n✅ Cleanup completed!");
        process.exit(0);
      })
      .catch((error) => {
        console.error("❌ Cleanup failed:", error);
        process.exit(1);
      });
  }
}
