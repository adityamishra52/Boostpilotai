import { absoluteUrl, siteConfig } from "./siteConfig.js";

const logo = () => absoluteUrl(siteConfig.logo);

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.legalName,
  alternateName: ["Boost Pilot AI", "BoostPilot", "BoostPilotAI"],
  url: siteConfig.url,
  logo: {
    "@type": "ImageObject",
    url: logo(),
    width: 512,
    height: 512
  },
  sameAs: siteConfig.socialProfiles
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/history?search={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
});

export const softwareApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: siteConfig.url,
  image: absoluteUrl(siteConfig.ogImage),
  description: "AI content optimization software for creators, marketers, and agencies.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock"
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url
  }
});

export const productSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: "BoostPilot AI Plans",
  brand: {
    "@type": "Brand",
    name: siteConfig.name
  },
  image: absoluteUrl(siteConfig.ogImage),
  description: "AI content analysis, caption generation, hooks, hashtags, trend finder, growth coaching, and exportable creator reports.",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "INR",
    lowPrice: "0",
    highPrice: "1499",
    offerCount: 4,
    availability: "https://schema.org/InStock",
    url: absoluteUrl("/pricing")
  }
});

export const faqSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer
    }
  }))
});

export const contactPageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact BoostPilot AI",
  url: absoluteUrl("/contact"),
  mainEntity: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: logo(),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@boostpilotai.com",
      availableLanguage: ["English"]
    }
  }
});

export const webApplicationSchema = (name, description, path) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name,
  url: absoluteUrl(path),
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description,
  browserRequirements: "Requires JavaScript and a modern web browser.",
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url
  }
});

export const blogPostingSchema = ({ title, description, path, datePublished }) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: title,
  description,
  url: absoluteUrl(path),
  datePublished,
  dateModified: datePublished,
  image: absoluteUrl(siteConfig.ogImage),
  author: {
    "@type": "Organization",
    name: siteConfig.name
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    logo: {
      "@type": "ImageObject",
      url: logo()
    }
  }
});
