type PricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline";
  buttonHref: string;
  popular?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Landing.pricing.standard.name",
    price: "Landing.pricing.standard.price",
    period: "Landing.pricing.standard.period",
    description: "Landing.pricing.standard.description",
    features: [
      "Landing.pricing.standard.features.1",
      "Landing.pricing.standard.features.2",
      "Landing.pricing.standard.features.3",
      "Landing.pricing.standard.features.4",
      "Landing.pricing.standard.features.5",
    ],
    buttonText: "Landing.pricing.standard.button",
    buttonVariant: "outline",
    buttonHref: "/dashboard",
  },
  {
    name: "Landing.pricing.enterprise.name",
    price: "Landing.pricing.enterprise.price",
    period: "Landing.pricing.enterprise.period",
    description: "Landing.pricing.enterprise.description",
    features: [
      "Landing.pricing.enterprise.features.1",
      "Landing.pricing.enterprise.features.2",
      "Landing.pricing.enterprise.features.3",
      "Landing.pricing.enterprise.features.4",
      "Landing.pricing.enterprise.features.5",
      "Landing.pricing.enterprise.features.6",
      "Landing.pricing.enterprise.features.7",
      "Landing.pricing.enterprise.features.8",
      "Landing.pricing.enterprise.features.9",
    ],
    buttonText: "Landing.pricing.enterprise.button",
    buttonVariant: "default",
    buttonHref: "/dashboard",
    popular: true,
  },
];
