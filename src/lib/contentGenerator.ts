/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { EXPERT_CONFIGS, getExpertBySlug } from "../data/experts";

export interface GeneratedReel {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  instructor: string;
  instructorSlug: string;
  topic: string;
  tags: string[];
  color: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "hook" | "explanation" | "practical";
  isGenerated: boolean;
}

// Enhanced color schemes for different expert domains
const EXPERT_COLORS = {
  "dr-quantum": "from-purple-600 via-blue-600 to-indigo-600",
  "codemaster-alex": "from-green-600 via-teal-600 to-emerald-600",
  "prof-timeline": "from-amber-600 via-orange-600 to-red-600",
  "dr-mind": "from-pink-600 via-rose-600 to-purple-600",
  "eco-emma": "from-emerald-600 via-green-600 to-teal-600",
};

// Enhanced educational topics with engagement hooks
const TOPIC_BANK = {
  "dr-quantum": [
    "🤯 You're quantum tunneling RIGHT NOW",
    "⚛️ Why parallel universes might be real",
    "🐱 How Schrödinger's cat broke physics",
    "🚀 The universe's ultimate speed limit",
    "⏰ Time travel paradoxes SOLVED",
    "🌌 Why you're constantly teleporting",
    "🕳️ Black holes aren't what you think",
    "🔬 The experiment that broke reality",
  ],
  "codemaster-alex": [
    "💰 Netflix's $1B algorithm secret",
    "🌐 The ONE line powering the internet",
    "🤖 Why autocorrect STILL fails you",
    "📱 Build your first app in 30 minutes",
    "💥 The bug that crashed everything",
    "🧠 How AI actually works (simply)",
    "🔄 Why updates always break things",
    "👁️ The algorithm watching your every move",
  ],
  "prof-timeline": [
    "🥪 The sandwich that started WWI",
    "🏛️ How Rome predicted social media",
    "💡 The accident that changed everything",
    "📉 Why civilizations REALLY collapse",
    "🔄 The pattern happening RIGHT NOW",
    "🏺 Ancient solutions to modern problems",
    "👑 The historical figure you've never heard of",
    "🌍 How climate shaped human history",
  ],
  "dr-mind": [
    "🧠 Your brain is lying to you RN",
    "📱 The psychology of social media addiction",
    "😊 How to literally rewire your brain",
    "🤔 Why smart people make dumb decisions",
    "💫 The ONE mindset shift that changes everything",
    "📵 How your phone rewires your brain",
    "⏳ The psychology behind procrastination",
    "🗞️ Why we believe fake news",
  ],
  "eco-emma": [
    "🌍 The tech literally saving our planet",
    "⚡ Why renewable energy is unstoppable",
    "🌱 How YOUR choices impact climate",
    "📱 The climate solution in your pocket",
    "💚 Turn climate anxiety into ACTION",
    "🔬 The breakthrough nobody talks about",
    "🚗 Why electric cars are inevitable",
    "💰 Save money while saving the planet",
  ],
};

// Generate realistic view counts
const generateViews = (): string => {
  const num = Math.floor(Math.random() * 5000000) + 100000;
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${Math.floor(num / 1000)}K`;
  }
  return num.toString();
};

export class ContentGenerator {
  private expertReplicas: any[] = [];
  private initialized: boolean = false;

  async initialize() {
    if (this.initialized) return;

    // Simulate expert loading (in real app, you'd load from Sensay API)
    this.expertReplicas = EXPERT_CONFIGS.map((config) => ({
      uuid: `uuid_${config.slug}`,
      slug: config.slug,
      name: config.name,
      ...config,
    }));

    this.initialized = true;
    console.log(
      `🎯 Content generator initialized with ${this.expertReplicas.length} experts`
    );
  }

  // Generate a single educational reel with enhanced interactivity
  async generateReel(
    expertSlug: string,
    topic: string,
    type: "hook" | "explanation" | "practical" = "hook"
  ): Promise<GeneratedReel | null> {
    try {
      await this.initialize();

      const expert = this.expertReplicas.find((r) => r.slug === expertSlug);
      const expertConfig = getExpertBySlug(expertSlug);

      if (!expert || !expertConfig) {
        console.error(`Expert ${expertSlug} not found`);
        return null;
      }

      // Enhanced content generation prompts
      const content = this.generateContent(expertSlug, topic, type);

      const reel: GeneratedReel = {
        id: `reel_${expertSlug}_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        title: this.extractTitle(content, topic),
        subtitle: expertConfig.shortDescription,
        content: content,
        instructor: expertConfig.name,
        instructorSlug: expertSlug,
        topic: topic,
        tags: [...expertConfig.tags, type, "ai-generated"],
        color:
          EXPERT_COLORS[expertSlug as keyof typeof EXPERT_COLORS] ||
          "from-gray-600 to-gray-800",
        thumbnailUrl: expertConfig.profileImage,
        duration: this.getDuration(type),
        views: generateViews(),
        difficulty: "beginner",
        type: type,
        isGenerated: true,
      };

      console.log(
        `✅ Generated ${type} reel: "${reel.title}" by ${reel.instructor}`
      );
      return reel;
    } catch (error: any) {
      console.error(`Error generating reel for ${expertSlug}:`, error.message);
      return null;
    }
  }

  // Generate content based on expert personality and type
  private generateContent(
    expertSlug: string,
    topic: string,
    type: string
  ): string {
    const templates = {
      "dr-quantum": {
        hook: `🤯 WAIT... ${topic}!

Here's the mind-bending reality: Every atom in your body has a tiny chance of quantum tunneling through any barrier.

The probability? 1 in 10^10^70 

That's more zeros than atoms in the observable universe! 😱

But here's what's CRAZY - your smartphone uses this "impossible" phenomenon RIGHT NOW in its processors!

Every time you scroll, quantum tunneling is happening billions of times per second in your device.

So while you can't walk through walls... your phone's electrons basically do it constantly! 🤳⚡

Mind = Blown? Wait until you learn what this means for the future of computing... 🚀`,

        explanation: `🔬 Let's break down ${topic}:

The Science Behind It:
Quantum mechanics tells us that particles can exist in multiple states simultaneously - it's called superposition.

Think of it like this: Imagine flipping a coin, but instead of landing heads OR tails, it lands heads AND tails at the same time! 🪙

Real-World Applications:
• Your smartphone's processor chips
• MRI machines in hospitals  
• LED lights in your home
• Solar panels generating electricity

The Weird Part:
The act of observing changes everything. When we measure a quantum particle, we force it to "choose" a state.

It's like the universe is playing hide and seek with reality itself! 🌌

Want to see this in action? Next time you use Face ID, remember - that's quantum physics recognizing your face! 📱`,

        practical: `⚡ Ready to apply quantum thinking to your daily life?

Step 1: Embrace Uncertainty 🎯
Instead of needing perfect information, make decisions with incomplete data (like quantum particles do!)

Step 2: Think in Probabilities 📊
Ask "What are the chances?" instead of "What's the answer?"

Step 3: Observe Your Impact 👁️
Notice how your attention changes situations (quantum observation effect in action!)

Step 4: Superposition Your Goals 🎪
Work on multiple possibilities simultaneously instead of one linear path

Try This Challenge:
For the next week, approach one problem using "quantum thinking" - consider multiple solutions existing at once until you choose one.

You'll be amazed how this changes your problem-solving! 🧠✨`,
      },

      "codemaster-alex": {
        hook: `💰 Netflix saves $1 BILLION yearly with ONE algorithm!

Here's how their recommendation system actually works:

Step 1: Track Everything 📊
- What you watch, when you pause, what you skip
- Time of day, device used, even how you scroll

Step 2: Find Your "Taste Twins" 👥  
- Match you with users who have similar viewing patterns
- The algorithm: "If User A loves X and Y, and User B loves X, then User B might love Y"

Step 3: Content DNA Analysis 🧬
- Every show gets "tagged" - comedy level, romance level, action level
- Your profile builds preferences for each "ingredient"

Here's the scary part: It knows you better than you know yourself! 😅

Want to build your own? Start with:
\`\`\`
if (user_liked_A && user_liked_B) {
  recommend(similar_to_A_and_B)
}
\`\`\`

Try this: Note what you watch this week, then predict what Netflix will recommend! 🔮`,

        explanation: `💻 Let's decode ${topic} step by step:

The Building Blocks:
Programming is like cooking - you need ingredients (data) and a recipe (algorithm) to create something useful.

Core Concepts:
• Variables = Storage containers for information
• Functions = Reusable recipes that do specific tasks  
• Loops = Repeating actions until you get the result
• Conditions = Making decisions based on circumstances

Real-World Example:
When you like a photo on Instagram:
1. Your click triggers a function ⚡
2. The function updates a database 💾
3. It sends notifications to friends 📱
4. The algorithm learns your preferences 🧠

The Beautiful Part:
Every app you use started as simple building blocks, combined creatively.

It's like LEGO for the digital world! 🧱

Remember: Every expert was once a beginner who kept building, one block at a time. 🚀`,

        practical: `🛠️ Ready to start coding? Here's your 30-minute roadmap:

Step 1: Choose Your First Language (5 min) 
Start with Python - it reads almost like English!

Step 2: Set Up Your Environment (10 min)
• Download VS Code (free)
• Install Python
• Create your first .py file

Step 3: Write Your First Program (10 min)
\`\`\`python
name = input("What's your name? ")
print(f"Hello, {name}! Welcome to coding!")
\`\`\`

Step 4: Make It Interactive (5 min)
Add age calculation or favorite color

Next Steps:
• Build a simple calculator
• Create a password generator  
• Make a basic game

Pro Tip: Code every day for just 15 minutes. Consistency beats intensity! 

Your first app is just 30 days away! 📱✨`,
      },

      "prof-timeline": {
        hook: `🏛️ Plot twist: Ancient Rome basically invented your social media feed!

Here's the eerie parallel:

THEN: Roman Forum = Town Square 🗣️
NOW: Twitter/Instagram = Digital Forum

THEN: Graffiti on walls = Original "posts" 📝
NOW: Status updates and stories

THEN: Gladiator fights = Entertainment to distract from politics 🤺
NOW: Viral videos and memes doing the same thing

THEN: Politicians hired people to spread rumors 🗨️
NOW: We call them "influencers" and "bots"

The WILD part? Rome fell partly because:
- Information overload confused citizens
- People chose entertainment over civic duty  
- Echo chambers formed around different leaders
- Fake news spread faster than facts

Sound familiar? 😰

Rome's citizens had all the information they needed to save their democracy... but they were too busy being entertained.

The question is: Are we learning from history... or repeating it? 🤔`,

        explanation: `📜 Let's journey through ${topic}:

Setting the Scene:
Imagine you're living through one of history's most pivotal moments...

The Key Players:
• Leaders who shaped nations
• Ordinary people who made extraordinary choices
• Hidden figures whose stories were almost lost

The Turning Point:
Every great historical moment has a "what if" - a single decision that changed everything.

What Actually Happened:
[Here's where we dive deep into the fascinating details, connections to other events, and surprising consequences]

The Human Drama:
Behind every historical "fact" were real people facing impossible choices, just like us.

Why This Matters Today:
The patterns from ${topic} are playing out right now in [current examples].

History doesn't repeat... but it definitely rhymes! 🎵

Question to Ponder: How would YOU have acted in their shoes? 🤔`,

        practical: `🎯 Ready to think like a historian? Here's your toolkit:

Step 1: Question Everything 🔍
Ask "Who benefits?" and "What's the source?" for any information

Step 2: Look for Patterns 🔄
History loves to repeat themes (rise/fall, innovation/resistance, cooperation/conflict)

Step 3: Connect Past to Present 🌉
For every current event, ask: "When has something similar happened before?"

Step 4: Multiple Perspectives 👥
Every story has at least 3 sides - find them all

This Week's Challenge:
Pick one current news story. Research:
• What happened the last time something similar occurred?
• Who are the key players and what are their motivations?
• What would historians 100 years from now find most important about this moment?

You'll start seeing the world like a time traveler! ⏰✨

Remember: Understanding history isn't about memorizing dates - it's about recognizing human patterns that never change. 🧠`,
      },

      "dr-mind": {
        hook: `🧠 Your brain is SABOTAGING you right now!

Here's the psychology: Your brain has 2 systems:

System 1: "I want it NOW!" 🍭
- Instant gratification seeking
- Controls impulses
- VERY loud and persuasive

System 2: "Let's think long-term" 🎯
- Logical planning
- Future-focused  
- Quieter voice

When you procrastinate, System 1 HIJACKS System 2!

THE TRICK? Make System 2 louder:

✅ "2-Minute Rule": If it takes <2 mins, do it NOW
✅ "Temptation Bundling": Pair boring tasks with fun ones
✅ "Implementation Intentions": "When X happens, I will do Y"

Example: "When I open my laptop, I will write for 10 minutes BEFORE checking social media"

Your brain can't argue with a pre-made decision! 💪

Try this NOW: Pick ONE task you've been avoiding. Set a timer for 2 minutes. Just start.

You'll be amazed how often "just starting" leads to finishing! 🚀`,

        explanation: `🧠 Let's explore the fascinating world of ${topic}:

What's Really Happening:
Your brain is constantly making predictions about the world, and sometimes it gets things hilariously wrong.

The Science Behind It:
• Cognitive biases shape our reality
• Emotions influence "logical" decisions  
• Social pressure affects our choices more than we realize
• Memory is more creative than we think

Real-Life Examples:
Ever wonder why you:
• Remember negative comments but forget compliments?
• Feel more motivated after talking to certain people?
• Make better decisions when you're slightly hungry?
• Trust people who are similar to you?

The Beautiful Truth:
Understanding your mental patterns isn't about fixing yourself - you're not broken! It's about working WITH your brain instead of against it.

Your mind is incredibly powerful... once you understand the user manual! 📖✨

The Takeaway:
Small changes in awareness can lead to big changes in happiness. 🌟`,

        practical: `💡 Ready to hack your own psychology? Here's your action plan:

Step 1: Notice Your Patterns 🔍
For 3 days, track when you feel most/least motivated. Look for patterns.

Step 2: Design Your Environment 🏗️
• Put healthy snacks at eye level
• Hide your phone during work hours
• Place a book by your bed instead of charging cable

Step 3: Use Implementation Intentions 📝
Instead of "I'll exercise more," try:
"When I wake up, I will do 10 pushups before checking my phone"

Step 4: Practice Self-Compassion 💚
Talk to yourself like you would to your best friend

This Week's Challenge:
Pick ONE habit you want to build. Create an "if-then" plan:
"If [specific trigger], then I will [specific action] for [specific amount of time]"

Track it for 7 days and watch the magic happen! ✨

Remember: You're not changing who you are - you're becoming who you already are, just more intentionally. 🎯`,
      },

      "eco-emma": {
        hook: `🌍 This technology could literally save our planet... and it fits in your pocket!

Meet "Direct Air Capture" - machines that suck CO2 straight from the air! 

The breakthrough? New materials that capture CO2 using 95% LESS energy than before! ⚡

But here's the game-changer: Your smartphone battery technology is making this possible! 🔋

The same lithium-ion innovations powering your phone are now powering:
- Massive air capture facilities  
- Grid-scale solar storage
- Electric vehicle networks

One facility in Iceland captures 4,000 tons of CO2 yearly - that's like removing 870 cars from roads! 🚗💨

The CRAZY part? These facilities could be profitable by 2030, creating jobs while healing the planet! 💚

And you can help RIGHT NOW:
- Support companies using clean energy
- Choose electric when possible
- Invest in green tech if you can

We're not just fighting climate change anymore... we're REVERSING it! 🔄

Want to see how your daily choices multiply into global impact? 🌱`,

        explanation: `🌱 Let's break down ${topic} and why there's hope:

The Challenge We Face:
Climate change feels overwhelming because it's a "tragedy of the commons" - individual actions feel insignificant.

The Science Simplified:
• Greenhouse gases trap heat like a blanket around Earth 🌍
• Small temperature changes create big weather changes
• But the same exponential effects work in reverse!

The Hopeful Truth:
Technology is advancing faster than climate damage:
• Solar energy is now the cheapest in history ☀️
• Electric vehicles are reaching price parity 🚗
• Carbon capture is becoming economically viable 🏭

Your Role in the Solution:
Every choice creates ripple effects:
• Choosing renewable energy signals market demand
• Buying electric creates manufacturing scale
• Supporting green companies drives innovation

The Tipping Point:
We're close to positive feedback loops where clean tech becomes unstoppable.

Remember: The Stone Age didn't end because we ran out of stones! 🪨➡️⚡`,

        practical: `🌍 Ready to become a climate solution? Here's your action plan:

Step 1: Audit Your Impact (Week 1) 📊
Use an app to track your carbon footprint for one week. Knowledge is power!

Step 2: Pick Your Power Moves (Week 2) ⚡
Choose 2-3 high-impact changes:
• Switch to renewable energy
• Reduce meat consumption 2 days/week
• Choose efficient transportation

Step 3: Amplify Your Impact (Week 3) 📢
• Talk to friends about your changes
• Support businesses with green practices
• Vote for climate-conscious leaders

Step 4: Track & Celebrate (Week 4) 🎉
Measure your carbon reduction and celebrate progress!

Pro Tips:
💡 Start with changes that SAVE money (LED bulbs, efficient appliances)
💡 Make it social - friends amplify impact
💡 Focus on progress, not perfection

Your Monthly Challenge:
Calculate how much CO2 you've prevented this month. 
Spoiler alert: It's probably more than you think! 🌟

Every ton of CO2 you prevent keeps polar ice frozen for future generations. 🧊🐧`,
      },
    };

    const expertTemplates = templates[expertSlug as keyof typeof templates];
    if (!expertTemplates) {
      return `Learn about ${topic} in this engaging educational experience!`;
    }

    return (
      expertTemplates[type as keyof typeof expertTemplates] ||
      expertTemplates.hook
    );
  }

  // Generate multiple reels for a topic from different expert perspectives
  async generateAlternativePerspectives(
    topic: string
  ): Promise<GeneratedReel[]> {
    const reels: GeneratedReel[] = [];
    const relevantExperts = this.findRelevantExperts(topic);

    for (const expertSlug of relevantExperts.slice(0, 3)) {
      // Limit to 3 perspectives
      const reel = await this.generateReel(expertSlug, topic, "explanation");
      if (reel) {
        reels.push(reel);
      }
      // Small delay to simulate real API calls
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return reels;
  }

  // Generate trending reels using random topics
  async generateTrendingReels(count: number = 10): Promise<GeneratedReel[]> {
    const reels: GeneratedReel[] = [];

    for (let i = 0; i < count; i++) {
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

      // Small delay between generations
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    return reels;
  }

  // Helper methods
  private extractTitle(content: string, fallbackTopic: string): string {
    const lines = content.split("\n").filter((line) => line.trim());
    const firstLine = lines[0];

    if (firstLine && firstLine.length < 80 && !firstLine.includes(".")) {
      return firstLine.replace(/[^\w\s!'?🤯💰🏛️🧠🌍-]/g, "").trim();
    }

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
      topicLower.includes("tech") ||
      topicLower.includes("algorithm")
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
      topicLower.includes("behavior") ||
      topicLower.includes("brain")
    ) {
      relevantExperts.push("dr-mind");
    }
    if (
      topicLower.includes("climate") ||
      topicLower.includes("environment") ||
      topicLower.includes("green") ||
      topicLower.includes("sustainability")
    ) {
      relevantExperts.push("eco-emma");
    }

    // If no specific matches, include diverse perspectives
    if (relevantExperts.length === 0) {
      return ["dr-quantum", "codemaster-alex", "prof-timeline"];
    }

    return relevantExperts;
  }
}

// Export singleton instance
export const contentGenerator = new ContentGenerator();
