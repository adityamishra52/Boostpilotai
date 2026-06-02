export const planOrder = ["free", "creator", "pro", "agency"];

export const planFeatures = {
  free: [
    "Basic AI analysis",
    "YouTube, Instagram, Facebook, LinkedIn, and Twitter/X support",
    "Basic captions and hooks",
    "Limited credits",
    "Standard report"
  ],
  creator: [
    "Everything in Free",
    "YouTube, Instagram, Facebook, LinkedIn, and Twitter/X support",
    "AI Rewrite Studio",
    "Content Library",
    "Better captions",
    "Better hooks",
    "More saved content",
    "No watermark"
  ],
  pro: [
    "Everything in Creator",
    "Trend Finder",
    "Growth Coach",
    "Advanced platform strategy",
    "Growth recommendations",
    "Weekly content goals"
  ],
  agency: [
    "Everything in Pro",
    "Admin/team-ready controls",
    "Higher limits",
    "Priority AI processing",
    "Premium reports",
    "Future team workspace/API access",
    "Bulk repurposing with brand voice support",
    "Higher upload limits",
    "Multi-user management support"
  ]
};

export const plans = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: "₹0",
    yearlyPrice: "₹0",
    monthlyCredits: 5,
    yearlyCredits: 5,
    description: "5 analyses/month",
    audience: "Testing the workflow"
  },
  {
    id: "creator",
    name: "Creator",
    monthlyPrice: "₹349/month",
    yearlyPrice: "₹3,490/year",
    monthlyCredits: 50,
    yearlyCredits: 600,
    description: "50 analyses/month",
    audience: "Solo creators",
    badge: "Best for creators"
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "₹999/month",
    yearlyPrice: "₹9,990/year",
    monthlyCredits: 200,
    yearlyCredits: 2400,
    description: "200 analyses/month",
    audience: "Growing creator teams",
    recommended: true,
    badge: "Popular"
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: "₹1499/month",
    yearlyPrice: "₹14,990/year",
    monthlyCredits: 1000,
    yearlyCredits: 12000,
    description: "1000 analyses/month",
    audience: "Client workflows",
    badge: "Best for agencies"
  }
];

export const planNames = plans.map((plan) => plan.id);

export const normalizePlan = (plan = "free") => {
  const value = String(plan || "free").trim().toLowerCase();
  return planOrder.includes(value) ? value : "free";
};

export const planLabel = (plan = "free") =>
  plans.find((item) => item.id === normalizePlan(plan))?.name || "Free";

export const hasPlan = (userOrPlan, requiredPlan = "free") => {
  const current = normalizePlan(typeof userOrPlan === "string" ? userOrPlan : userOrPlan?.plan);
  const required = normalizePlan(requiredPlan);
  return planOrder.indexOf(current) >= planOrder.indexOf(required);
};

export const priceForPlan = (plan, billingCycle) =>
  billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

export const creditsForPlan = (plan, billingCycle) =>
  billingCycle === "yearly" ? plan.yearlyCredits : plan.monthlyCredits;

export const featuresForPlan = (plan) => planFeatures[normalizePlan(plan)] || planFeatures.free;
