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

export type MoodCategory = {
  id: string;
  name: string;
  isPositive: boolean; // For inverted color scale
};


export type DreamLifeCategory = {
  id: number;
  category: string;
  options: {
    label: string;
    imageSrc: string;
  }[];
};

export const LIFE_PRIORITIES_DATA: PriorityItem[] = [
  { id: 'baby', text: 'Your baby is crying', meaning: 'Family & Loved Ones' },
  { id: 'clothes', text: 'Clothes are hanging outside and it started raining', meaning: 'Relationships & Intimacy' },
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
      { label: 'A', text: "Wait for the right moment" },
      { label: 'B', text: "Acknowledge it softly" },
      { label: 'C', text: "Support practically without discussing" }
    ],
    reveal: "Emotional awareness approach"
  },
  {
    id: 3,
    title: "Disagreement in a Group",
    scenario: "A difference of opinion comes up in front of others.",
    options: [
      { label: 'A', text: "Address it calmly in the moment" },
      { label: 'B', text: "Maintain harmony and move on" },
      { label: 'C', text: "Pause and discuss privately later" },
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
      { label: 'A', text: "“Can we talk about this after some time?”" },
      { label: 'B', text: "“Okay, tell me what’s on your mind.”" },
      { label: 'C', text: "“Let’s see how it feels later.”" }
    ]
  },
  {
    id: 2,
    title: "You disagree with your partner’s opinion in a group setting. What do you say?",
    options: [
    
      { label: 'A', text: "“That’s one way to look at it.”" },
      { label: 'B', text: "“We don’t need to decide this right now.”" },
        { label: 'C', text: "“I see it a bit differently—can we talk about it later?”" },
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
      { label: 'A', text: "“Maybe we should take a short break.”" },
       { label: 'B', text: "“Let’s slow down and talk calmly.”" },
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

export const MOOD_SPECTRUM_CATEGORIES: MoodCategory[] = [
  { id: 'anger', name: 'Anger', isPositive: false },
  { id: 'joy', name: 'Joy', isPositive: true },
  { id: 'sadness', name: 'Sadness', isPositive: false },
  { id: 'anxiety', name: 'Anxiety', isPositive: false },
  { id: 'excitement', name: 'Excitement', isPositive: true },
  { id: 'calmness', name: 'Calmness', isPositive: true },
  { id: 'frustration', name: 'Frustration', isPositive: false },
  { id: 'contentment', name: 'Contentment', isPositive: true },
  { id: 'fear', name: 'Fear', isPositive: false },
  { id: 'love', name: 'Love', isPositive: true },
];

export type TravelDestination = {
  id: string;
  name: string;
  country: string;
  flights: {
    economy: { min: number; max: number };
    premiumEconomy: { min: number; max: number };
    business: { min: number; max: number };
  };
  hotels: {
    threeStar: { min: number; max: number; imageSrc: string };
    fourStar: { min: number; max: number; imageSrc: string };
    fiveStar: { min: number; max: number; imageSrc: string };
  };
  activities: {
    name: string;
    cost: number;
    imageSrc: string;
    category?: string;
  }[];
  meals: {
    budget: number;
    midRange: number;
    fineDining: number;
  };
};

export const TRAVEL_DESTINATIONS: TravelDestination[] = [

  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    flights: {
      economy: { min: 25000, max: 40000 },
      premiumEconomy: { min: 60000, max: 80000 },
      business: { min: 120000, max: 150000 },
    },
    hotels: {
      threeStar: { min: 4000, max: 6000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768572396/3starhotel_vqjyoq.jpg' },
      fourStar: { min: 8000, max: 12000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768572394/4starhotel_phafxo.jpg' },
      fiveStar: { min: 15000, max: 30000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768572394/5starhotel_iy5skl.jpg' },
    },
    activities: [
      { name: 'Burj Khalifa At The Top', cost: 5000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768572394/burjkhalifatop_ltxyag.jpg', category: 'Sightseeing' },
      { name: 'Desert Safari', cost: 4000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768572394/desertsafari_j9deyg.webp', category: 'Adventure' },
      { name: 'Dubai Mall & Fountain', cost: 0, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768572395/dubaimall_fqaidv.jpg', category: 'Shopping' },
      { name: 'Outlet Mall', cost: 0, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768572395/outletmall_ten6fh.jpg', category: 'Shopping' },
      { name: 'Outlet Village', cost: 0, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768572394/outlet_village_c4ogfv.jpg', category: 'Shopping' },
      { name: 'Marina Dhow Cruise', cost: 3000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573067/dhowcruise_ye88sx.jpg', category: 'Relaxation' },
      { name: 'Dubai Aquarium', cost: 3000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573067/dubaiaquarium_lfueui.jpg', category: 'Family' },
      { name: 'Ski Dubai', cost: 4500, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573070/skiDubai_spydgr.webp', category: 'Adventure' },
      { name: 'Ferrari World', cost: 6000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573502/ferarriworld_usmex1.jpg', category: 'Adventure' },
      { name: 'Warner Bros World', cost: 6000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573507/warnerbros_o06yfx.webp', category: 'Entertainment' },
      { name: 'Miracle Garden', cost: 1500, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573069/miraclegarden_vq1wv4.avif', category: 'Nature' },
      { name: 'Global Village', cost: 500, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573067/globalvillage_xn2cjp.jpg', category: 'Culture' },
      { name: 'Dubai Frame', cost: 1200, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573067/dubaiframe_u497ok.jpg', category: 'Sightseeing' },
      { name: 'Museum of the Future', cost: 3500, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573069/museumoffuture_pr2gkh.jpg', category: 'Culture' },
      { name: 'Aquaventure Waterpark', cost: 6000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573066/aquaventure_sxfjz8.jpg', category: 'Adventure' },
      { name: 'Jumeirah Beach Day', cost: 0, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573067/jumeriahbeach_h2hizw.jpg', category: 'Relaxation' },
      { name: 'Gold & Spice Souk', cost: 0, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573067/goldsouk_amahlc.jpg', category: 'Culture' },

      { name: 'Aura Skypool', cost: 5000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573066/auraskypool_tq4coj.jpg', category: 'Luxury' },
      { name: 'La Perle Show', cost: 6000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573503/laperleshow_iy17fz.jpg', category: 'Entertainment' },
      { name: 'Legoland Dubai', cost: 5500, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573504/legoland_a7dq4a.jpg', category: 'Family' },
      { name: 'Hot Air Balloon Ride', cost: 12000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573503/hotairbaloon_fklidw.jpg', category: 'Adventure' },
      { name: 'Helicopter Tour', cost: 15000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573502/helicoptertour_uta2b9.jpg', category: 'Luxury' },
      { name: 'Skydiving over Palm', cost: 45000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573505/skydivedubai_qzuswa.jpg', category: 'Adventure' },
      { name: 'Beach Club Access', cost: 4000, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573503/beachclub_jstyn6.webp', category: 'Relaxation' },
      { name: 'Grand Mosque Visit', cost: 0, imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768573505/mosque_sxpreb.jpg', category: 'Culture' },
    ],
    meals: {
      budget: 1500,
      midRange: 3000,
      fineDining: 6000,
    },
  },
];

export const DREAM_LIFE_CATEGORIES: DreamLifeCategory[] = [
  {
    id: 1,
    category: 'Dream Home',
    options: [
      { label: 'Modern Apartment', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574449/modernapartment_tiyc9c.jpg' },
      { label: 'Luxury Villa', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574447/luxuryvilla_tvzuur.jpg' },

      { label: 'Countryside Farmhouse', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574438/countrysidefarmhouse_ahwrqe.jpg' },
      { label: 'Beach House', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574438/beachhouse_rajwro.jpg' },
      { label: 'Mountain Cabin', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574449/mountain_cabin_w2gmyd.jpg' },
    ],
  },
  {
    id: 2,
    category: 'Lifestyle Type',
    options: [
      { label: 'Minimalist', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574445/lt_minimalist_x6idhe.jpg' },
      { label: 'Luxurious', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574444/lt_luxirious_nornju.jpg' },
      { label: 'Adventurous', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574443/lt_adventurous_otaryv.jpg' },
      { label: 'Traditional', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574446/lt_traditional_dpcire.jpg' },
    ],
  },
  {
    id: 3,
    category: 'Career Path',
    options: [
      { label: 'Creative Artist', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574439/cp_creative_artist_drfuto.jpg' },
      { label: 'Corporate Leader', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574439/cp_corportate_leader_lv9khj.webp' },
      { label: 'Entrepreneur', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574440/cp_enterprenueur_uegfe1.jpg' },
      { label: 'Freelancer', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574441/cp_freelancer_vrfjk7.jpg' },
      { label: 'Academic/Researcher', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574443/cp_reseracher_ncanc6.jpg' },
      { label: 'Public Service', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574442/cp_public_service_mshbru.jpg' },
    ],
  },
  {
    id: 4,
    category: 'Social Circle',
    options: [
      { label: 'Small Intimate Group', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574451/sc_small_yzhqgn.jpg' },
      { label: 'Large Network', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574449/sc_large_rzmjvq.jpg' },
      { label: 'Mixed Groups', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574450/sc_mixed_groups_mc15os.webp' },
      { label: 'Solo Adventurer', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574452/sc_solo_adventurer_ppz1p9.jpg' },
    ],
  },
  {
    id: 5,
    category: 'Dream Vacation',
    options: [
      { label: 'Beach Paradise', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576051/dv_beach_paradise_ntkt5m.jpg' },
      { label: 'Mountain Retreat', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576055/dv_mountain_retreat_xzspw5.webp' },
      { label: 'City Explorer', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576052/dv_city_explorer_l91hmm.jpg' },
      { label: 'Cultural Immersion', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576053/dv_cultural_immersion_vwacfo.jpg' },
      { label: 'Adventure Sports', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576050/dv_adventure_sports_jv1av6.jpg' },
      { label: 'Luxury Cruise', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576054/dv_luxury_cruise_vagtut.jpg' },
    ],
  },
  {
    id: 6,
    category: 'Daily Routine',
    options: [
      { label: 'Early Riser/Productive', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576046/dr_early_riser_mzr4g1.avif' },
      { label: 'Night Owl/Creative', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576048/dr_night_owl_shwy7t.jpg' },
      { label: 'Balanced Schedule', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576046/dr_early_riser_mzr4g1.avif' },
      { label: 'Flexible/Spontaneous', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576047/dr_flexible_schedule_xwcglv.jpg' },
    ],
  },
  {
    id: 7,
    category: 'Dream Car',
    options: [
      { label: 'Supercar (Ferrari/Lambo)', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576043/dc_supercar_yl8sio.webp' },
      { label: 'Ultra-Luxury Sedan (Rolls-Royce)', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576044/dc_ultra_luxury_sedan_ebgynz.avif' },
      { label: 'Luxury SUV (G-Wagon)', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576042/dc_luxury_suv_zahxfj.webp' },
      { label: 'Vintage Classic', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576050/dr_vintage_classic_iqydhh.jpg' },
      { label: 'High-Performance Electric', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576041/dc_high_performance_electric_car_mnj7ch.jpg' },
    ],
  },
  {
    id: 8,
    category: 'Working Hours',
    options: [
      { label: '10+ Hours (Hustle Mode)', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576064/wh_hustle_mode_ui9ahp.jpg' },
      { label: 'Flexible Schedule', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576063/wh_flexible_wfuknh.webp' },
      { label: '4-5 Hours (Balanced)', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576062/wh_balanced_gsd9xk.jpg' },
      { label: 'Standard 9-5', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576066/wh_standard_rpj4nc.jpg' },
      { label: 'Financial Freedom (Retired)', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576065/wh_retired_kkjbdv.webp' },
    ],
  },
  {
    id: 9,
    category: 'Weekend Vibe',
    options: [
      { label: 'Social Butterfly', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576067/wv_social_life_ksthei.jpg' },
      { label: 'Nature Escape', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574452/sc_solo_adventurer_ppz1p9.jpg' },
      { label: 'Cozy Homebody', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576584/cozy_homebody_pn5z0f.jpg' },
      { label: 'Creative Projects', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768574439/cp_creative_artist_drfuto.jpg' },
      { label: 'Adrenaline Junkie', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576050/dv_adventure_sports_jv1av6.jpg' },
    ],
  },
  {
    id: 10,
    category: 'Hobbies',
    options: [
      { label: 'Cooking/Baking', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576056/h_cooking_vvol28.jpg' },
      { label: 'Photography', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576061/h_photography_m0mxqw.jpg' },
      { label: 'Fitness/Sports', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576057/h_fitness_thtacp.webp' },
      { label: 'Gaming/Tech', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576059/h_gaming_tech_tb5zwl.jpg' },
      { label: 'Gardening/DIY', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576060/h_gardening_euj4l8.jpg' },
      { label: 'Traveling', imageSrc: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1768576052/dv_city_explorer_l91hmm.jpg' },
    ],
  },
];

export const QUIZ_DATA = {
  life_priorities: LIFE_PRIORITIES_DATA,
  emotional_compatibility: EMOTIONAL_COMPATIBILITY_QUESTIONS,
  conflict_communication: CONFLICT_COMMUNICATION_QUESTIONS,
  responsibility_reliability: RESPONSIBILITY_RELIABILITY_TASKS,
  partner_preferences: PARTNER_PREFERENCES_QUESTIONS,
  mood_spectrum: MOOD_SPECTRUM_CATEGORIES,
  travel_planner: TRAVEL_DESTINATIONS,
  dream_life: DREAM_LIFE_CATEGORIES,
};
