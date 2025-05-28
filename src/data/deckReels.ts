export interface ReelData {
  id: string;
  title: string;
  subtitle: string;
  videoUrl?: string; // Optional for video-based reels
  thumbnailUrl: string;
  tags: string[];
  instructor: string;
  instructorSlug?: string; // Maps to Sensay expert slug
  duration: string;
  views: string;
  color: string;

  // New fields for educational content
  content?: string; // Generated text content from Sensay
  expertUuid?: string; // Sensay replica UUID for chat
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "hook" | "explanation" | "practical";
  isGenerated?: boolean; // True if content is AI-generated

  // Series information
  seriesId?: string;
  episodeNumber?: number;
  totalEpisodes?: number;
}

// Sample reels mixing static and generated content
export const deckReels: ReelData[] = [
  // AI-Generated Content Reels (text-based)
  {
    id: "quantum-tunneling-hook",
    title: "🤯 You Could Walk Through Walls",
    subtitle: "The quantum physics phenomenon in your phone",
    thumbnailUrl: "/images/quantum-physics-thumb.jpg",
    tags: ["physics", "quantum", "mind-blowing"],
    instructor: "Dr. Quantum",
    instructorSlug: "dr-quantum",
    duration: "30 sec",
    views: "847K",
    color: "from-purple-600 to-blue-600",
    topic: "Quantum tunneling in everyday technology",
    difficulty: "beginner",
    type: "hook",
    content: `🤯 WAIT... You could theoretically walk through walls!

Here's the mind-bending reality: Every atom in your body has a tiny chance of quantum tunneling through any barrier. 

The probability? 1 in 10^10^70 

That's more zeros than atoms in the observable universe! 😱

But here's what's CRAZY - your smartphone uses this "impossible" phenomenon RIGHT NOW in its processors! 

Every time you scroll, quantum tunneling is happening billions of times per second in your device. 

So while you can't walk through walls... your phone's electrons basically do it constantly! 🤳⚡

Mind = Blown? Wait until you learn what this means for the future of computing... 🚀`,
    isGenerated: true,
  },

  {
    id: "netflix-algorithm-practical",
    title: "💰 Netflix's $1B Algorithm Hack",
    subtitle: "How recommendation systems really work",
    thumbnailUrl: "/images/ai-revolution-thumb.jpg",
    tags: ["programming", "algorithms", "business"],
    instructor: "CodeMaster Alex",
    instructorSlug: "codemaster-alex",
    duration: "45 sec",
    views: "1.2M",
    color: "from-green-600 to-teal-600",
    topic: "Building recommendation algorithms",
    difficulty: "intermediate",
    type: "practical",
    content: `🎯 Netflix saves $1 BILLION yearly with ONE algorithm!

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
    isGenerated: true,
  },

  {
    id: "rome-social-media",
    title: "🏛️ Rome Predicted Your Feed",
    subtitle: "How ancient politics mirrors modern social media",
    thumbnailUrl: "/images/ancient-rome-thumb.jpg",
    tags: ["history", "politics", "social media"],
    instructor: "Prof. Timeline",
    instructorSlug: "prof-timeline",
    duration: "50 sec",
    views: "923K",
    color: "from-amber-600 to-orange-600",
    topic: "Ancient Rome and modern digital democracy",
    difficulty: "beginner",
    type: "explanation",
    content: `🏛️ Plot twist: Ancient Rome basically invented your social media feed!

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
    isGenerated: true,
  },

  {
    id: "brain-tricks-psychology",
    title: "🧠 Your Brain is Lying to You RN",
    subtitle: "The psychology behind procrastination",
    thumbnailUrl: "/images/inner-peace-thumb.jpg",
    tags: ["psychology", "productivity", "self-help"],
    instructor: "Dr. Mind",
    instructorSlug: "dr-mind",
    duration: "40 sec",
    views: "2.1M",
    color: "from-pink-600 to-rose-600",
    topic: "Understanding procrastination psychology",
    difficulty: "beginner",
    type: "practical",
    content: `🧠 Your brain is SABOTAGING you right now!

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
    isGenerated: true,
  },

  {
    id: "climate-tech-solution",
    title: "🌍 This Tech Could Save Earth",
    subtitle: "Revolutionary climate solutions you haven't heard of",
    thumbnailUrl: "/images/lasers-thumb.jpg",
    tags: ["climate", "technology", "future"],
    instructor: "Eco Emma",
    instructorSlug: "eco-emma",
    duration: "55 sec",
    views: "1.8M",
    color: "from-emerald-600 to-green-600",
    topic: "Breakthrough climate technologies",
    difficulty: "beginner",
    type: "hook",
    content: `🌍 This technology could literally save our planet... and it fits in your pocket!

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
    isGenerated: true,
  },

  // Traditional Video-Based Reels (no generated content)
  {
    id: "traditional-black-holes",
    title: "Black Holes Explained",
    subtitle: "Mind-bending concepts in 60 seconds",
    videoUrl: "/videos/black-holes-1.mp4",
    thumbnailUrl: "/images/black-holes-thumb.jpg",
    tags: ["physics", "space", "science"],
    instructor: "Dr. Quantum",
    instructorSlug: "dr-quantum",
    duration: "60 sec",
    views: "3.4M",
    color: "from-purple-600 to-blue-600",
    topic: "Black hole physics fundamentals",
    difficulty: "intermediate",
    type: "explanation",
    isGenerated: false,
  },

  {
    id: "traditional-inner-peace",
    title: "Inner Peace Meditation",
    subtitle: "Quick meditation technique to try now",
    videoUrl: "/videos/inner-peace.mp4",
    thumbnailUrl: "/images/inner-peace-thumb.jpg",
    tags: ["meditation", "mindfulness", "wellbeing"],
    instructor: "Dr. Mind",
    instructorSlug: "dr-mind",
    duration: "45 sec",
    views: "2.3M",
    color: "from-pink-600 to-rose-600",
    topic: "Mindfulness and meditation basics",
    difficulty: "beginner",
    type: "practical",
    isGenerated: false,
  },

  {
    id: "traditional-ai-revolution",
    title: "AI Revolution Explained",
    subtitle: "How artificial intelligence is changing everything",
    videoUrl: "/videos/ai-revolution.mp4",
    thumbnailUrl: "/images/ai-revolution-thumb.jpg",
    tags: ["technology", "ai", "future"],
    instructor: "CodeMaster Alex",
    instructorSlug: "codemaster-alex",
    duration: "50 sec",
    views: "1.8M",
    color: "from-green-600 to-teal-600",
    topic: "Artificial intelligence fundamentals",
    difficulty: "intermediate",
    type: "explanation",
    isGenerated: false,
  },
];

// Helper functions for working with reels
export const getReelsByExpert = (expertSlug: string): ReelData[] => {
  return deckReels.filter((reel) => reel.instructorSlug === expertSlug);
};

export const getReelsByDifficulty = (
  difficulty: "beginner" | "intermediate" | "advanced"
): ReelData[] => {
  return deckReels.filter((reel) => reel.difficulty === difficulty);
};

export const getReelsByType = (
  type: "hook" | "explanation" | "practical"
): ReelData[] => {
  return deckReels.filter((reel) => reel.type === type);
};

export const getGeneratedReels = (): ReelData[] => {
  return deckReels.filter((reel) => reel.isGenerated === true);
};

export const getVideoReels = (): ReelData[] => {
  return deckReels.filter(
    (reel) => reel.isGenerated === false && reel.videoUrl
  );
};

// Function to add new generated reel to the deck
export const addGeneratedReel = (reel: ReelData): void => {
  deckReels.unshift(reel); // Add to beginning
};

// Function to get alternative perspectives on a topic
export const getAlternativePerspectives = (topic: string): ReelData[] => {
  return deckReels.filter(
    (reel) =>
      reel.topic.toLowerCase().includes(topic.toLowerCase()) ||
      reel.title.toLowerCase().includes(topic.toLowerCase())
  );
};

// Function to get random reel
export const getRandomReel = (): ReelData => {
  return deckReels[Math.floor(Math.random() * deckReels.length)];
};

// Function to get reels by tags
export const getReelsByTag = (tag: string): ReelData[] => {
  return deckReels.filter((reel) =>
    reel.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
  );
};
