export const planOrder = ["free", "creator", "pro", "agency"];

export const planFeatures = {
  free: [
    "Basic AI report",
    "YouTube, Instagram, Facebook, LinkedIn, and Twitter/X support",
    "Basic captions and openings",
    "Limited credits",
    "Standard report"
  ],
  creator: [
    "Everything in Free",
    "YouTube, Instagram, Facebook, LinkedIn, and Twitter/X support",
    "Rewrite tool",
    "Content Library",
    "Better captions",
    "Better openings",
    "More saved content",
    "No watermark"
  ],
  pro: [
    "Everything in Creator",
    "Post ideas",
    "Growth tips",
    "Better posting tips",
    "Growth tips",
    "Weekly content goals"
  ],
  agency: [
    "Everything in Pro",
    "Admin/team-ready controls",
    "Higher limits",
    "Priority AI processing",
    "Better reports",
    "Future team tools and API access",
    "Bulk reuse with brand voice support",
    "Higher upload limits",
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
    description: "5 reports/month",
    audience: "Testing the workflow"
  },
  {
    id: "creator",
    name: "Creator",
    monthlyPrice: "Rs 349/month",
    yearlyPrice: "Rs 3,490/year",
    monthlyCredits: 50,
    yearlyCredits: 600,
    description: "50 reports/month",
    audience: "Solo creators",
    badge: "Best for creators"
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "Rs 999/month",
    yearlyPrice: "Rs 9,990/year",
    monthlyCredits: 200,
    yearlyCredits: 2400,
    description: "200 reports/month",
    audience: "Growing creator teams",
    recommended: true,
    badge: "Popular"
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: "Rs 1499/month",
    yearlyPrice: "Rs 14,990/year",
    monthlyCredits: 1000,
    yearlyCredits: 12000,
    description: "1000 reports/month",
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

export const multiImageLimitForPlan = (userOrPlan) => {
  const plan = normalizePlan(typeof userOrPlan === "string" ? userOrPlan : userOrPlan?.plan);

  switch (plan) {
    case "agency":
    case "pro":
      return 10;
    case "creator":
      return 5;
    default:
      return 3;
  }
};

export const priceForPlan = (plan, billingCycle) =>
  billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

export const creditsForPlan = (plan, billingCycle) =>
  billingCycle === "yearly" ? plan.yearlyCredits : plan.monthlyCredits;

export const featuresForPlan = (plan) => planFeatures[normalizePlan(plan)] || planFeatures.free;
