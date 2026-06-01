export const planOrder = ["free", "creator", "pro", "agency"];

export const planFeatures = {
  free: [
    "Basic AI analysis",
    "Limited credits",
    "Basic captions and hooks",
    "1 repurposed platform",
    "Limited history",
    "Standard PDF",
    "Watermarked exports"
  ],
  creator: [
    "Everything in Free",
    "More credits",
    "Better AI quality",
    "Advanced captions",
    "Better hashtags",
    "Better hook generation",
    "Fix Weakness",
    "Generate Variants",
    "3 repurposed platforms",
    "Improved reports",
    "No watermark",
    "Faster generation"
  ],
  pro: [
    "Everything in Creator",
    "Apply Suggestions",
    "Advanced technical analysis",
    "Better scoring system",
    "More export formats",
    "Priority processing",
    "Better AI prompts",
    "Competitor-style suggestions",
    "Advanced CTA generation",
    "Platform growth recommendations",
    "All-platform repurposing with tone selection"
  ],
  agency: [
    "Everything in Pro",
    "Team/admin tools",
    "YouTube thumbnail idea generator",
    "3 thumbnail concepts",
    "Shared workspace support",
    "Higher upload limits",
    "Priority AI queue",
    "Premium branded PDF reports",
    "Bulk repurposing with brand voice support",
    "Future API support",
    "Multi-user management support"
  ]
};

export const plans = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: "Rs 0",
    yearlyPrice: "Rs 0",
    monthlyCredits: 5,
    yearlyCredits: 5,
    description: "5 analyses/month",
    audience: "Testing the workflow"
  },
  {
    id: "creator",
    name: "Creator",
    monthlyPrice: "Rs 299/month",
    yearlyPrice: "Rs 2,990/year",
    monthlyCredits: 50,
    yearlyCredits: 600,
    description: "50 analyses/month",
    audience: "Solo creators"
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "Rs 799/month",
    yearlyPrice: "Rs 7,990/year",
    monthlyCredits: 200,
    yearlyCredits: 2400,
    description: "200 analyses/month",
    audience: "Growing creator teams",
    recommended: true
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: "Rs 1,999/month",
    yearlyPrice: "Rs 19,990/year",
    monthlyCredits: 1000,
    yearlyCredits: 12000,
    description: "1000 analyses/month",
    audience: "Client workflows"
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
