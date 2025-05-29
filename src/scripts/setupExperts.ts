/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { sensayAPI } from "../lib/sensay";
import { EXPERT_CONFIGS } from "../data/experts";

interface SetupResult {
  expertName: string;
  slug: string;
  uuid?: string;
  success: boolean;
  error?: string;
}

// Training content for each expert domain
const TRAINING_CONTENT = {
  "dr-quantum": `
    Advanced Physics and Quantum Mechanics Knowledge Base:
    
    QUANTUM MECHANICS FUNDAMENTALS:
    - Quantum superposition: particles exist in multiple states simultaneously
    - Wave-particle duality: light and matter exhibit both wave and particle properties
    - Heisenberg uncertainty principle: cannot know both position and momentum precisely
    - Quantum tunneling: particles can pass through energy barriers
    - Quantum entanglement: particles remain connected regardless of distance
    
    EVERYDAY PHYSICS APPLICATIONS:
    - Smartphone processors use quantum tunneling in transistors
    - LED lights work through quantum mechanics
    - MRI machines use quantum properties of atoms
    - Solar panels convert light to electricity via photoelectric effect
    - GPS satellites account for relativistic time dilation
    
    MIND-BLOWING FACTS:
    - You have a 1 in 10^10^70 chance of quantum tunneling through a wall
    - Every atom in your body came from exploding stars
    - Time moves slower when you're moving faster
    - The universe is expanding faster than light at its edges
    - Quantum computers can solve certain problems exponentially faster
    
    ANALOGIES FOR COMPLEX CONCEPTS:
    - Quantum superposition = spinning coin in the air (heads AND tails)
    - Wave-particle duality = person who is both doctor AND lawyer
    - Quantum entanglement = magical coins that always land opposite
    - Relativity = time zone differences but for speed and gravity
    - Black holes = cosmic vacuum cleaners with event horizon point of no return
  `,

  "codemaster-alex": `
    Programming and Software Development Knowledge Base:
    
    FUNDAMENTAL CONCEPTS:
    - Variables: containers that store data
    - Functions: reusable blocks of code that perform specific tasks
    - Loops: repeat code until a condition is met
    - Conditionals: make decisions in code (if/then/else)
    - Arrays: ordered lists of data
    - Objects: collections of related data and functions
    
    REAL-WORLD APPLICATIONS:
    - Netflix recommendation algorithm saves $1B annually
    - Google search processes 8.5 billion queries daily
    - Facebook's newsfeed algorithm determines what 2.9B users see
    - Uber's routing algorithm optimizes millions of trips
    - Instagram filters use image processing algorithms
    
    COMMON DEBUGGING STRATEGIES:
    - Rubber duck debugging: explain your code to an inanimate object
    - Binary search debugging: eliminate half the code at a time
    - Print statement debugging: add outputs to track execution
    - Unit testing: test small pieces of code in isolation
    - Version control: track changes and revert when needed
    
    PROGRAMMING BUILDING BLOCKS:
    - HTML: structure of web pages (skeleton)
    - CSS: styling and layout (makeup)
    - JavaScript: interactivity and behavior (personality)
    - Databases: organized storage of information
    - APIs: ways for different programs to communicate
    
    CAREER GUIDANCE:
    - Start with fundamentals before frameworks
    - Build projects to learn, not just tutorials
    - Read other people's code regularly
    - Contribute to open source projects
    - Focus on problem-solving, not just syntax
  `,

  "prof-timeline": `
    Historical Analysis and Storytelling Knowledge Base:
    
    MAJOR HISTORICAL PATTERNS:
    - Rise and fall of civilizations follow predictable cycles
    - Technological revolutions always disrupt social structures
    - Economic inequality often precedes social upheaval
    - Climate changes have shaped human migration patterns
    - Information technologies transform how societies organize
    
    FASCINATING HISTORICAL CONNECTIONS:
    - Roman Republic's fall mirrors modern democratic challenges
    - Medieval trade networks resemble modern globalization
    - Printing press disruption parallels internet revolution
    - Spanish flu pandemic response similar to COVID-19
    - Ancient Greek democracy's problems echo in modern politics
    
    HISTORICAL TURNING POINTS:
    - Agricultural Revolution (10,000 BCE): enabled civilization
    - Invention of writing (3200 BCE): preserved knowledge
    - Fall of Rome (476 CE): ended ancient world
    - Printing press (1440): democratized information
    - Industrial Revolution (1760): mechanized production
    - Internet invention (1969): connected humanity
    
    STORYTELLING TECHNIQUES:
    - Start with compelling characters and personal stakes
    - Use narrative tension and cliffhangers
    - Show cause and effect relationships
    - Connect past events to present situations
    - Include surprising twists and lesser-known facts
    
    HISTORICAL THINKING SKILLS:
    - Analyze multiple perspectives on events
    - Distinguish between correlation and causation
    - Evaluate reliability of historical sources
    - Understand context and bias in historical accounts
    - Draw lessons applicable to contemporary issues
  `,

  "dr-mind": `
    Psychology and Behavioral Science Knowledge Base:
    
    COGNITIVE BIASES:
    - Confirmation bias: seeking information that confirms existing beliefs
    - Availability heuristic: judging likelihood by ease of recall
    - Anchoring bias: over-relying on first piece of information
    - Loss aversion: losses feel twice as powerful as gains
    - Dunning-Kruger effect: incompetent people overestimate abilities
    
    BEHAVIORAL PSYCHOLOGY PRINCIPLES:
    - Habit loop: cue → routine → reward → repetition
    - Variable ratio reinforcement: most addictive reward schedule
    - Social proof: people follow others' behavior in uncertain situations
    - Cognitive load theory: brain has limited processing capacity
    - Flow state: optimal experience when challenge matches skill
    
    MENTAL HEALTH FUNDAMENTALS:
    - Depression affects 280 million people worldwide
    - Anxiety disorders are most common mental health condition
    - Therapy success rates: 75% of people benefit from treatment
    - Mindfulness meditation reduces stress and improves focus
    - Exercise is as effective as antidepressants for mild depression
    
    PRACTICAL TECHNIQUES:
    - Pomodoro Technique: work in 25-minute focused intervals
    - Cognitive reframing: challenge negative thought patterns
    - Progressive muscle relaxation: reduce physical tension
    - Gratitude journaling: improve mood and life satisfaction
    - Deep breathing: activate parasympathetic nervous system
    
    SOCIAL PSYCHOLOGY INSIGHTS:
    - People conform to group pressure 75% of the time
    - First impressions form within 100 milliseconds
    - Reciprocity principle: people feel obligated to return favors
    - Authority bias: people defer to perceived experts
    - Mere exposure effect: familiarity breeds liking
  `,

  "eco-emma": `
    Environmental Science and Sustainability Knowledge Base:
    
    CLIMATE SCIENCE BASICS:
    - Greenhouse effect: certain gases trap heat in atmosphere
    - Carbon dioxide levels highest in 3 million years
    - Global temperature risen 1.1°C since pre-industrial times
    - Ocean pH decreased by 0.1 units due to CO2 absorption
    - Arctic sea ice declining 13% per decade
    
    RENEWABLE ENERGY PROGRESS:
    - Solar power costs dropped 90% in past decade
    - Wind energy now cheapest electricity source in many regions
    - Battery storage capacity doubled every 2-3 years
    - Electric vehicle sales growing 50% annually
    - Renewable energy employed 13.7 million people globally in 2022
    
    INNOVATIVE SOLUTIONS:
    - Direct air capture: machines that remove CO2 from atmosphere
    - Vertical farming: grows 95% more food using 95% less water
    - Lab-grown meat: reduces emissions by 96% vs conventional meat
    - Ocean cleanup: technologies removing plastic from seas
    - Carbon-negative concrete: building materials that absorb CO2
    
    INDIVIDUAL ACTIONS WITH IMPACT:
    - Transportation: walking, biking, public transit, electric vehicles
    - Diet: reduce meat consumption, especially beef
    - Energy: use efficient appliances, renewable electricity
    - Consumption: buy less, choose durable goods, repair vs replace
    - Advocacy: vote, support green policies, influence others
    
    ENVIRONMENTAL SUCCESS STORIES:
    - Ozone layer healing due to Montreal Protocol
    - California condor population recovered from 27 to 500+
    - Renewable energy now employs more people than fossil fuels
    - Electric vehicle market share growing exponentially
    - Many cities achieving carbon neutrality ahead of schedule
  `,
};

export async function setupAllExperts(): Promise<SetupResult[]> {
  console.log("🚀 Starting MentorScroll Expert Setup...");

  const results: SetupResult[] = [];

  try {
    // Initialize user first
    console.log("👤 Initializing user...");
    await sensayAPI.initializeUser();
    console.log("✅ User initialized successfully");

    // Create each expert replica
    for (const expert of EXPERT_CONFIGS) {
      console.log(`\n🧠 Creating ${expert.name}...`);

      try {
        // Create the replica
        const replicaResult = await sensayAPI.createExpertReplica({
          name: expert.name,
          slug: expert.slug,
          shortDescription: expert.shortDescription,
          greeting: expert.greeting,
          systemMessage: expert.systemMessage,
          tags: expert.tags,
          profileImage: expert.profileImage,
        });

        if (replicaResult.success && replicaResult.uuid) {
          console.log(
            `✅ Created ${expert.name} with UUID: ${replicaResult.uuid}`
          );

          // Train the expert with domain knowledge
          console.log(`📚 Training ${expert.name}...`);
          const trainingContent =
            TRAINING_CONTENT[expert.slug as keyof typeof TRAINING_CONTENT];

          if (trainingContent) {
            const trainingSuccess = await sensayAPI.trainExpert(
              replicaResult.uuid,
              trainingContent
            );

            if (trainingSuccess) {
              console.log(`✅ Successfully trained ${expert.name}`);
            } else {
              console.log(`⚠️ Warning: Training failed for ${expert.name}`);
            }
          }

          results.push({
            expertName: expert.name,
            slug: expert.slug,
            uuid: replicaResult.uuid,
            success: true,
          });
        } else {
          console.log(`❌ Failed to create ${expert.name}`);
          results.push({
            expertName: expert.name,
            slug: expert.slug,
            success: false,
            error: "Replica creation failed",
          });
        }

        // Wait a bit between creations to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error: any) {
        console.log(`❌ Error creating ${expert.name}:`, error.message);
        results.push({
          expertName: expert.name,
          slug: expert.slug,
          success: false,
          error: error.message,
        });
      }
    }
  } catch (error: any) {
    console.error("❌ Fatal error during setup:", error);
    results.push({
      expertName: "Setup Process",
      slug: "setup",
      success: false,
      error: error.message,
    });
  }

  // Print summary
  console.log("\n📊 Setup Summary:");
  console.log("================");

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ Successful: ${successful.length}`);
  successful.forEach((r) =>
    console.log(`   - ${r.expertName} (${r.slug}): ${r.uuid}`)
  );

  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.length}`);
    failed.forEach((r) => console.log(`   - ${r.expertName}: ${r.error}`));
  }

  console.log(
    "\n🎉 Setup complete! Your experts are ready to create educational content."
  );

  return results;
}

// Function to test expert functionality
export async function testExpert(expertSlug: string): Promise<void> {
  console.log(`\n🧪 Testing ${expertSlug}...`);

  try {
    const replicas = await sensayAPI.getExpertReplicas();
    const expert = replicas.find((r) => r.slug === expertSlug);

    if (!expert) {
      console.log(`❌ Expert ${expertSlug} not found`);
      return;
    }

    console.log(`Found expert: ${expert.name}`);

    // Test chat functionality
    const response = await sensayAPI.chatWithExpert(
      expert.uuid,
      "Create a 30-second educational reel script about quantum tunneling that would go viral on TikTok"
    );

    console.log("💬 Expert Response:");
    console.log(response.content);
  } catch (error: any) {
    console.error(`❌ Error testing ${expertSlug}:`, error.message);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupAllExperts()
    .then(() => {
      console.log(
        "\n✅ All done! You can now run: npm run test-expert dr-quantum"
      );
    })
    .catch((error) => {
      console.error("❌ Setup failed:", error);
      process.exit(1);
    });
}
