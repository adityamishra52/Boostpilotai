import {
  blogPostingSchema,
  contactPageSchema,
  faqSchema,
  organizationSchema,
  productSchema,
  softwareApplicationSchema,
  webApplicationSchema,
  websiteSchema
} from "./schema.js";

const indexRobots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const noIndexRobots = "noindex, nofollow, noarchive";

const commonKeywords = [
  "BoostPilot AI",
  "AI content optimizer",
  "AI caption generator",
  "AI hashtag generator",
  "social media AI tool",
  "creator marketing software"
];

const featureSchema = (title, description, path) => [webApplicationSchema(title, description, path)];

export const seoRoutes = [
  {
    path: "/",
    title: "BoostPilot AI - AI Content Optimization for Creators",
    description: "Optimize images and videos with AI captions, hooks, hashtags, platform-fit scores, growth suggestions, rewrites, and export-ready creator reports.",
    keywords: [...commonKeywords, "AI video analyzer", "AI image analyzer", "creator reports"],
    priority: "1.0",
    changefreq: "weekly",
    schemas: [organizationSchema(), websiteSchema(), softwareApplicationSchema()]
  },
  {
    path: "/about",
    title: "About BoostPilot AI - Creator Growth and Content Intelligence",
    description: "Learn how BoostPilot AI helps creators, marketers, and agencies turn media uploads into better social content and reports.",
    keywords: [...commonKeywords, "about BoostPilot AI", "creator growth platform"],
    priority: "0.8",
    changefreq: "monthly",
    schemas: [organizationSchema()]
  },
  {
    path: "/how-it-works",
    title: "How BoostPilot AI Works - Upload, Analyze, Improve, Export",
    description: "See how BoostPilot AI turns images and videos into captions, hooks, hashtags, media checks, AI rewrites, saved content, and PDF reports.",
    keywords: [...commonKeywords, "how AI content analysis works", "AI report workflow"],
    priority: "0.9",
    changefreq: "weekly",
    schemas: [
      faqSchema([
        ["Is my uploaded media private?", "Yes. Uploaded media is stored for your account and is not posted anywhere."],
        ["What platforms are supported?", "BoostPilot AI supports YouTube, Instagram, Facebook, LinkedIn, and Twitter/X."],
        ["Can I save content?", "Yes. You can save captions, hooks, hashtags, rewrites, trend reports, and coach plans."]
      ])
    ]
  },
  {
    path: "/features",
    title: "BoostPilot AI Features - Captions, Hooks, Hashtags, Trends, Reports",
    description: "Explore AI analysis reports, Rewrite Studio, Content Library, Trend Finder, Growth Coach, Media Enhancer, thumbnails, and exports.",
    keywords: [...commonKeywords, "AI Rewrite Studio", "Trend Finder AI", "Growth Coach AI"],
    priority: "0.9",
    changefreq: "weekly",
    schemas: [softwareApplicationSchema()]
  },
  {
    path: "/blog/ai-content-optimization",
    title: "AI Content Optimization Guide - Captions, Hooks, Hashtags, and Reports",
    description: "Learn how creators can use AI to improve social media captions, hooks, hashtags, platform fit, media quality, and reusable reports.",
    keywords: [...commonKeywords, "AI content optimization guide", "social media SEO", "creator SEO"],
    priority: "0.7",
    changefreq: "monthly",
    schemas: [
      blogPostingSchema({
        title: "AI Content Optimization Guide - Captions, Hooks, Hashtags, and Reports",
        description: "Learn how creators can use AI to improve social media captions, hooks, hashtags, platform fit, media quality, and reusable reports.",
        path: "/blog/ai-content-optimization",
        datePublished: "2026-06-05"
      })
    ]
  },
  {
    path: "/pricing",
    title: "BoostPilot AI Pricing - Creator, Pro, and Agency Plans",
    description: "Compare BoostPilot AI plans for content analysis, AI Rewrite, Content Library, Trend Finder, Growth Coach, thumbnails, and agency workflows.",
    keywords: [...commonKeywords, "BoostPilot AI pricing", "creator AI plans", "agency AI content plan"],
    priority: "0.9",
    changefreq: "weekly",
    schemas: [productSchema()]
  },
  {
    path: "/contact",
    title: "Contact BoostPilot AI - Support, Billing, Partnerships",
    description: "Contact BoostPilot AI for product support, billing help, partnerships, feature requests, bug reports, and creator workflow questions.",
    keywords: [...commonKeywords, "BoostPilot support", "creator AI support"],
    priority: "0.8",
    changefreq: "monthly",
    schemas: [contactPageSchema()]
  },
  {
    path: "/privacy",
    title: "BoostPilot AI Privacy Policy - Private Uploads and Account Data",
    description: "Read how BoostPilot AI protects uploads, account access, saved content, analysis reports, and privacy for creator workflows.",
    keywords: [...commonKeywords, "privacy policy", "private media uploads"],
    priority: "0.5",
    changefreq: "yearly"
  },
  {
    path: "/terms",
    title: "BoostPilot AI Terms of Service - Responsible AI Creator Tools",
    description: "Review BoostPilot AI terms for accounts, uploads, analysis reports, saved content, subscriptions, and acceptable use.",
    keywords: [...commonKeywords, "terms of service", "AI creator tool terms"],
    priority: "0.5",
    changefreq: "yearly"
  },
  {
    path: "/login",
    title: "Login to BoostPilot AI - Access Creator Reports and Saved Content",
    description: "Sign in to BoostPilot AI to access saved reports, private uploads, AI rewrites, Content Library, trend insights, and account settings.",
    keywords: [...commonKeywords, "BoostPilot AI login"],
    priority: "0.4",
    changefreq: "monthly",
    robots: noIndexRobots
  },
  {
    path: "/register",
    title: "Create a BoostPilot AI Account - Start AI Content Analysis",
    description: "Create a free BoostPilot AI account to analyze images and videos, generate captions, save content, and export reports.",
    keywords: [...commonKeywords, "create BoostPilot account", "AI content analysis signup"],
    priority: "0.7",
    changefreq: "monthly"
  },
  {
    path: "/analyze",
    title: "AI Content Analysis Tool - Upload Images and Videos",
    description: "Upload media to BoostPilot AI and generate platform-specific captions, hooks, hashtags, quality checks, and performance suggestions.",
    keywords: [...commonKeywords, "AI media analyzer", "content optimizer"],
    priority: "0.8",
    changefreq: "weekly",
    schemas: featureSchema("AI Content Analysis Tool", "Upload images or videos and receive AI-powered content recommendations.", "/analyze")
  },
  {
    path: "/image-analysis",
    title: "AI Image Analysis Tool - Improve Social Media Images",
    description: "Analyze images for Instagram, LinkedIn, Facebook, YouTube, and X with AI captions, hashtags, hooks, quality checks, and fixes.",
    keywords: [...commonKeywords, "AI image analysis", "image content optimizer"],
    priority: "0.8",
    changefreq: "weekly",
    schemas: featureSchema("AI Image Analysis Tool", "AI image analysis for social media creators and marketers.", "/image-analysis")
  },
  {
    path: "/video-analysis",
    title: "AI Video Analysis Tool - Optimize Reels, Shorts, and Posts",
    description: "Analyze videos for platform fit, captions, opening hooks, hashtags, quality checks, and creator-ready content reports.",
    keywords: [...commonKeywords, "AI video analysis", "shorts optimizer", "reels optimizer"],
    priority: "0.8",
    changefreq: "weekly",
    schemas: featureSchema("AI Video Analysis Tool", "AI video analysis for Shorts, Reels, social posts, and creator reports.", "/video-analysis")
  },
  {
    path: "/caption-generator",
    title: "AI Caption Generator - Social Media Captions for Creators",
    description: "Generate platform-specific captions for YouTube, Instagram, Facebook, LinkedIn, and X from uploaded images or videos.",
    keywords: [...commonKeywords, "AI caption generator", "Instagram caption generator", "LinkedIn captions"],
    priority: "0.8",
    changefreq: "weekly",
    schemas: featureSchema("AI Caption Generator", "Generate social media captions from uploaded media.", "/caption-generator")
  },
  {
    path: "/hook-generator",
    title: "AI Hook Generator - Opening Lines for Social Posts",
    description: "Create scroll-stopping hooks and opening lines for creator posts, videos, carousels, threads, and professional content.",
    keywords: [...commonKeywords, "AI hook generator", "opening line generator"],
    priority: "0.8",
    changefreq: "weekly",
    schemas: featureSchema("AI Hook Generator", "Generate better opening lines for social content.", "/hook-generator")
  },
  {
    path: "/hashtag-generator",
    title: "AI Hashtag Generator - Platform-Specific Social Tags",
    description: "Generate relevant hashtags for Instagram, LinkedIn, YouTube, Facebook, and X based on uploaded media and content goals.",
    keywords: [...commonKeywords, "AI hashtag generator", "Instagram hashtags", "LinkedIn hashtags"],
    priority: "0.8",
    changefreq: "weekly",
    schemas: featureSchema("AI Hashtag Generator", "Generate hashtags for creator and brand posts.", "/hashtag-generator")
  },
  {
    path: "/thumbnail-generator",
    title: "AI Thumbnail Generator - YouTube and Social Cover Ideas",
    description: "Create thumbnail concepts, cover ideas, and visual recommendations for videos, Shorts, Reels, and social posts.",
    keywords: [...commonKeywords, "AI thumbnail generator", "YouTube thumbnail AI"],
    priority: "0.8",
    changefreq: "weekly",
    schemas: featureSchema("AI Thumbnail Generator", "Generate thumbnail and cover concepts for social media.", "/thumbnail-generator")
  },
  {
    path: "/content-optimizer",
    title: "AI Content Optimizer - Improve Captions, Media, and Reports",
    description: "Optimize social media content with AI rewrites, content scores, media checks, improvement suggestions, and exportable reports.",
    keywords: [...commonKeywords, "AI content optimizer", "social content optimization"],
    priority: "0.8",
    changefreq: "weekly",
    schemas: featureSchema("AI Content Optimizer", "Optimize creator content with AI analysis and recommendations.", "/content-optimizer")
  },
  {
    path: "/dashboard",
    title: "BoostPilot AI Dashboard - Reports, Credits, and Creator Workflow",
    description: "Open your BoostPilot AI dashboard to view credits, recent reports, saved content, creator tools, and account workflows.",
    keywords: [...commonKeywords, "creator dashboard", "AI report dashboard"],
    priority: "0.3",
    changefreq: "weekly",
    robots: noIndexRobots
  },
  {
    path: "/history",
    title: "Saved AI Reports - BoostPilot AI History",
    description: "Review private BoostPilot AI analysis reports, captions, hooks, hashtags, media checks, and PDF exports.",
    keywords: [...commonKeywords, "saved AI reports", "content report history"],
    robots: noIndexRobots
  },
  {
    path: "/trends",
    title: "Trend Finder - AI Post Ideas, Hooks, and Hashtags",
    description: "Find trend ideas, hooks, hashtags, and content angles for your topic, platform, and country using BoostPilot AI.",
    keywords: [...commonKeywords, "AI trend finder", "social media trends"],
    robots: noIndexRobots
  },
  {
    path: "/library",
    title: "Content Library - Saved Captions, Hooks, Hashtags, and Rewrites",
    description: "Store and reuse private captions, hooks, hashtags, titles, trend reports, and rewritten content in BoostPilot AI.",
    keywords: [...commonKeywords, "content library", "saved captions"],
    robots: noIndexRobots
  },
  {
    path: "/coach",
    title: "Growth Coach - AI Creator Strategy and Weekly Tips",
    description: "Get private growth coaching recommendations based on saved BoostPilot AI reports and creator content patterns.",
    keywords: [...commonKeywords, "AI growth coach", "creator strategy AI"],
    robots: noIndexRobots
  },
  {
    path: "/settings",
    title: "BoostPilot AI Settings - Account, Preferences, and Security",
    description: "Manage private BoostPilot AI account settings, preferences, password, and workspace configuration.",
    keywords: [...commonKeywords, "account settings"],
    robots: noIndexRobots
  },
  {
    path: "/help",
    title: "BoostPilot AI Help Center - Guides, FAQs, Credits, and Reports",
    description: "Search BoostPilot AI help guides for credits, reports, Google login, uploads, AI rewrite, Content Library, and support.",
    keywords: [...commonKeywords, "BoostPilot help", "AI content tool FAQ"],
    priority: "0.7",
    changefreq: "monthly",
    schemas: [
      faqSchema([
        ["How do I create a report?", "Upload an image or video, choose a platform and content type, then generate an AI analysis."],
        ["Can I use Google login?", "Yes. BoostPilot AI supports Google login and email login."],
        ["Where are saved items stored?", "Saved captions, hooks, hashtags, titles, and rewrites appear in Content Library."]
      ])
    ]
  },
  {
    path: "/support",
    title: "BoostPilot AI Support - Account, Billing, Bug, and Product Help",
    description: "Submit account, billing, product, feature, or bug questions to BoostPilot AI support.",
    keywords: [...commonKeywords, "BoostPilot support", "AI tool support"],
    priority: "0.6",
    changefreq: "monthly"
  },
  {
    path: "/feedback",
    title: "BoostPilot AI Feedback - Request Features and Report Bugs",
    description: "Send feature requests, bug reports, and product suggestions to improve BoostPilot AI for creators and marketers.",
    keywords: [...commonKeywords, "feature request", "bug report"],
    robots: noIndexRobots
  }
];

export const defaultSeo = seoRoutes[0];
export const indexableSeoRoutes = seoRoutes.filter((route) => route.robots !== noIndexRobots);
export const robotsDirectives = { index: indexRobots, noindex: noIndexRobots };

export const findSeoRoute = (pathname) => {
  if (/^\/results\/[^/]+/.test(pathname)) {
    return {
      path: pathname,
      title: "AI Content Report - Captions, Hooks, Hashtags, and Media Insights",
      description: "Review a private BoostPilot AI report with captions, hooks, hashtags, media checks, improvement suggestions, and export options.",
      keywords: [...commonKeywords, "AI content report", "social media report"],
      robots: noIndexRobots,
      schemas: featureSchema("AI Content Report", "Private AI-generated creator content report.", pathname)
    };
  }

  if (pathname.startsWith("/admin")) {
    return {
      path: pathname,
      title: "BoostPilot AI Admin",
      description: "Private BoostPilot AI administration area.",
      keywords: ["BoostPilot AI admin"],
      robots: noIndexRobots
    };
  }

  return seoRoutes.find((route) => route.path === pathname) || defaultSeo;
};
