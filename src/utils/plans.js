export const plans = [
  {
    name: "Free",
    monthlyPrice: "Rs 0",
    yearlyPrice: "Rs 0",
    monthlyCredits: 5,
    yearlyCredits: 5,
    description: "5 analyses/month",
    audience: "Testing the workflow"
  },
  {
    name: "Creator",
    monthlyPrice: "Rs 299/month",
    yearlyPrice: "Rs 2,990/year",
    monthlyCredits: 50,
    yearlyCredits: 600,
    description: "50 analyses/month",
    audience: "Solo creators"
  },
  {
    name: "Pro",
    monthlyPrice: "Rs 799/month",
    yearlyPrice: "Rs 7,990/year",
    monthlyCredits: 200,
    yearlyCredits: 2400,
    description: "200 analyses/month",
    audience: "Growing teams"
  },
  {
    name: "Agency",
    monthlyPrice: "Rs 1,999/month",
    yearlyPrice: "Rs 19,990/year",
    monthlyCredits: 1000,
    yearlyCredits: 12000,
    description: "1000 analyses/month",
    audience: "Client workflows"
  }
];

export const planNames = plans.map((plan) => plan.name);

export const priceForPlan = (plan, billingCycle) =>
  billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

export const creditsForPlan = (plan, billingCycle) =>
  billingCycle === "yearly" ? plan.yearlyCredits : plan.monthlyCredits;
