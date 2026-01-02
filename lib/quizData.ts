export type PriorityItem = {
  id: string;
  text: string;
  meaning: string;
};

export type EmotionalQuestion = {
  id: number;
  title: string;
  scenario: string;
  options: {
    label: string;
    text: string;
  }[];
  reveal: string;
};

export type ConflictQuestion = {
  id: number;
  title: string;
  options: {
    label: string;
    text: string;
  }[];
};

export type ResponsibilityTask = {
  id: number;
  title: string;
  description: string;
};

export type PartnerPreferenceQuestion = {
  id: number;
  category: string;
  options: [
    { label: string; imageSrc: string },
    { label: string; imageSrc: string }
  ];
};

export const LIFE_PRIORITIES_DATA: PriorityItem[] = [
  { id: 'baby', text: 'A baby is crying', meaning: 'Family & Loved Ones' },
  { id: 'clothes', text: 'Clothes are hanging outside and it starts to rain', meaning: 'Relationships & Intimacy' },
  { id: 'water', text: 'Water is running from the tap', meaning: 'Wealth & Maintenance' },
  { id: 'doorbell', text: 'The doorbell is ringing', meaning: 'Social Relations' },
  { id: 'phone', text: 'The phone is ringing', meaning: 'Career & Job' },
];

export const EMOTIONAL_COMPATIBILITY_QUESTIONS: EmotionalQuestion[] = [
  {
    id: 1,
    title: "Quiet After a Social Interaction",
    scenario: "After meeting others, the person becomes unusually quiet.",
    options: [
      { label: 'A', text: "Gently ask and listen if they want to share" },
      { label: 'B', text: "Give them space and check in later" },
      { label: 'C', text: "Stay close and keep things normal" }
    ],
    reveal: "Emotional sensitivity style"
  },
  {
    id: 2,
    title: "Emotional Discomfort Is Felt",
    scenario: "You sense emotional discomfort, but nothing is said.",
    options: [
      { label: 'A', text: "Acknowledge it softly" },
      { label: 'B', text: "Wait for the right moment" },
      { label: 'C', text: "Support practically without discussing" }
    ],
    reveal: "Emotional awareness approach"
  },
  {
    id: 3,
    title: "Disagreement in a Group",
    scenario: "A difference of opinion comes up in front of others.",
    options: [
      { label: 'A', text: "Pause and discuss privately later" },
      { label: 'B', text: "Address it calmly in the moment" },
      { label: 'C', text: "Maintain harmony and move on" }
    ],
    reveal: "Emotional regulation & harmony balance"
  },
  {
    id: 4,
    title: "Someone Is Upset About an Unfixable Issue",
    scenario: "The person is upset about something you can’t change.",
    options: [
      { label: 'A', text: "Listen and validate feelings" },
      { label: 'B', text: "Offer reassurance and perspective" },
      { label: 'C', text: "Be present without pushing conversation" }
    ],
    reveal: "Comfort-giving style"
  },
  {
    id: 5,
    title: "Emotional Need vs Responsibility",
    scenario: "Someone needs emotional support, but responsibilities are waiting.",
    options: [
      { label: 'A', text: "Be emotionally present first" },
      { label: 'B', text: "Balance both thoughtfully" },
      { label: 'C', text: "Finish tasks and reconnect fully" }
    ],
    reveal: "Emotional availability pattern"
  },
  {
    id: 6,
    title: "Different Emotional Expressions",
    scenario: "You both express emotions differently.",
    options: [
      { label: 'A', text: "Learn and adapt to their style" },
      { label: 'B', text: "Respect differences as they are" },
      { label: 'C', text: "Find a middle ground naturally" }
    ],
    reveal: "Emotional flexibility"
  },
  {
    id: 7,
    title: "Feeling Unappreciated Is Shared",
    scenario: "The person shares they feel unappreciated.",
    options: [
      { label: 'A', text: "Ask and understand their feelings" },
      { label: 'B', text: "Express appreciation immediately" },
      { label: 'C', text: "Show care through actions" }
    ],
    reveal: "Emotional reassurance style"
  },
  {
    id: 8,
    title: "Emotional Difference Without Right or Wrong",
    scenario: "You both feel differently about a situation.",
    options: [
      { label: 'A', text: "Understand their emotional view" },
      { label: 'B', text: "Share your perspective calmly" },
      { label: 'C', text: "Reflect and discuss later" }
    ],
    reveal: "Emotional conflict navigation"
  },
  {
    id: 9,
    title: "When Space Is Requested",
    scenario: "The person asks for space during an emotional moment.",
    options: [
      { label: 'A', text: "Respect it and check in later" },
      { label: 'B', text: "Stay available without pressure" },
      { label: 'C', text: "Give space and focus on stability" }
    ],
    reveal: "Boundary respect style"
  },
  {
    id: 10,
    title: "Emotional Support vs Social Expectation",
    scenario: "Someone needs emotional support, but there’s a social obligation.",
    options: [
      { label: 'A', text: "Prioritize emotional presence" },
      { label: 'B', text: "Balance both thoughtfully" },
      { label: 'C', text: "Fulfill obligation and reconnect with care" }
    ],
    reveal: "Emotional prioritization"
  }
];

export const CONFLICT_COMMUNICATION_QUESTIONS: ConflictQuestion[] = [
  {
    id: 1,
    title: "Your partner brings up a serious issue while you’re relaxing. What do you say?",
    options: [
      { label: 'A', text: "“Okay, tell me what’s on your mind.”" },
      { label: 'B', text: "“Can we talk about this after some time?”" },
      { label: 'C', text: "“Let’s see how it feels later.”" }
    ]
  },
  {
    id: 2,
    title: "You disagree with your partner’s opinion in a group setting. What do you say?",
    options: [
      { label: 'A', text: "“I see it a bit differently—can we talk about it later?”" },
      { label: 'B', text: "“That’s one way to look at it.”" },
      { label: 'C', text: "“We don’t need to decide this right now.”" }
    ]
  },
  {
    id: 3,
    title: "A past argument comes up again. How do you respond?",
    options: [
      { label: 'A', text: "“Maybe we can understand it better this time.”" },
      { label: 'B', text: "“We already talked about this before.”" },
      { label: 'C', text: "“Let’s focus on what’s happening now.”" }
    ]
  },
  {
    id: 4,
    title: "Your partner seems upset, but hasn’t said why. What do you say?",
    options: [
      { label: 'A', text: "“You seem off—do you want to talk?”" },
      { label: 'B', text: "“I’m here if you feel like sharing later.”" },
      { label: 'C', text: "“Maybe it’s just a long day.”" }
    ]
  },
  {
    id: 5,
    title: "The conversation starts to feel uncomfortable. What do you say?",
    options: [
      { label: 'A', text: "“Let’s slow down and talk calmly.”" },
      { label: 'B', text: "“Maybe we should take a short break.”" },
      { label: 'C', text: "“We can leave this for now.”" }
    ]
  }
];

export const RESPONSIBILITY_RELIABILITY_TASKS: ResponsibilityTask[] = [
  { id: 1, title: "Missing Menu Item", description: "The “Dal” is missing; check with the catering vendor." },
  { id: 2, title: "Decor Disaster", description: "Centerpieces are wrong; fix the setup immediately." },
  { id: 3, title: "Late Photographer", description: "Photographer is late; coordinate timing with them." },
  { id: 4, title: "Seating Drama", description: "Relative is upset about seating; mediate politely." },
  { id: 5, title: "Sound System Failure", description: "Mic isn't working; troubleshoot or call technician." },
  { id: 6, title: "Misplaced Invitations", description: "Invitations lost; confirm with guests who RSVP’d." },
  { id: 7, title: "Delayed Cake", description: "Cake is late; coordinate with the baker for arrival." },
  { id: 8, title: "Outfit Malfunction", description: "Bridal outfit tear; arrange emergency tailoring." },
  { id: 9, title: "Spilled Drinks", description: "Welcome drinks spilling; ensure staff handle it." },
  { id: 10, title: "Shuttle Confusion", description: "Shuttle timings off; coordinate pickup and drop-off." }
];

export const PARTNER_PREFERENCES_QUESTIONS: PartnerPreferenceQuestion[] = [
  {
    id: 1,
    category: "Drinks",
    options: [
      { label: "Tea", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767362882/tea_nxujxr.jpg" },
      { label: "Coffee", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767363958/coffee_ucyc6x.jpg" }
    ]
  },
  {
    id: 2,
    category: "Looks & Ambition",
    options: [
      { label: "Attractive & Ambitious", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767363957/ambitious-women_cbudui.webp" },
      { label: "Average & Homely", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767363963/tranditional-women_qfojpv.webp" }
    ]
  },
  {
    id: 3,
    category: "Vacation Style",
    options: [
      { label: "Luxury", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767363959/luxury-living_i3u5fs.jpg" },
      { label: "Simple", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767363958/simple-living_awibzp.avif" }
    ]
  },
  {
    id: 4,
    category: "Travel Preference",
    options: [
      { label: "Beach", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364426/beach_xrdwq8.jpg" },
      { label: "Mountains", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364462/mountains_fiwsqo.jpg" }
    ]
  },
  {
    id: 5,
    category: "Money",
    options: [
      { label: "Spender", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364469/spender_txykyu.jpg" },
      { label: "Saver", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364464/saver_ya9lvs.webp" }
    ]
  },
  {
    id: 6,
    category: "Food Habits",
    options: [
      { label: "Eating Out", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364436/eating-out_ddwrpo.jpg" },
      { label: "Home-Cooked", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364437/home-cooked_onocpp.jpg" }
    ]
  },
  {
    id: 7,
    category: "Social Life",
    options: [
      { label: "Party Lover", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364463/party-lover_f8frli.jpg" },
      { label: "Homebody", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364438/homebody_bsbxrt.jpg" }
    ]
  },
  {
    id: 9,
    category: "Career",
    options: [
      { label: "Driven", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364427/career-driven_hjgzdp.jpg" },
      { label: "Balanced", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364425/career-balanced_bubd8o.jpg" }
    ]
  },
  {
    id: 10,
    category: "Materialism",
    options: [
      { label: "Important", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364960/materalism-imp_xv7knq.webp" },
      { label: "Not Important", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364958/materialism-not-imp_nxec1m.jpg" }
    ]
  },
  {
    id: 11,
    category: "Health",
    options: [
      { label: "Strict", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364955/healthy-food_howj9x.jpg" },
      { label: "Flexible", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364957/junk-food_hnol23.jpg" }
    ]
  },
  {
    id: 13,
    category: "Evening Plans",
    options: [
      { label: "Going Out", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364956/going-out-evening_xm9fze.jpg" },
      { label: "Staying In", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364970/staying-in_wmsoym.jpg" }
    ]
  },
  {
    id: 14,
    category: "Movie Type",
    options: [
      { label: "Action", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364955/action-movie_dojyu3.jpg" },
      { label: "Romance", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767364959/romance_movie_q1g5mr.jpg" }
    ]
  },
  {
    id: 15,
    category: "Fitness",
    options: [
      { label: "Gym", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767365226/gym-workout_fnkoc5.webp" },
      { label: "Outdoor", imageSrc: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767365227/outdooor-workout_k6kuja.webp" }
    ]
  },
];

export const QUIZ_DATA = {
  life_priorities: LIFE_PRIORITIES_DATA,
  emotional_compatibility: EMOTIONAL_COMPATIBILITY_QUESTIONS,
  conflict_communication: CONFLICT_COMMUNICATION_QUESTIONS,
  responsibility_reliability: RESPONSIBILITY_RELIABILITY_TASKS,
  partner_preferences: PARTNER_PREFERENCES_QUESTIONS,
};
