export const siteConfig = {
  name: "BoostPilot AI",
  legalName: "BoostPilot AI",
  url: "https://boostpilotai.vercel.app",
  locale: "en_US",
  language: "en",
  author: "BoostPilot AI",
  themeColor: "#0f172a",
  twitterSite: "@boostpilotai",
  twitterCreator: "@boostpilotai",
  logo: "/logo.png",
  ogImage: "/og-image.jpg",
  socialProfiles: [
    "https://facebook.com/boostpilotai",
    "https://instagram.com/boostpilotai",
    "https://linkedin.com/company/boostpilotai",
    "https://x.com/boostpilotai",
    "https://youtube.com/@boostpilotai"
  ],
  verification: {
    google: "GOOGLE_SEARCH_CONSOLE_VERIFICATION_PLACEHOLDER",
    bing: "BING_WEBMASTER_TOOLS_VERIFICATION_PLACEHOLDER",
    yandex: "YANDEX_WEBMASTER_VERIFICATION_PLACEHOLDER"
  }
};

export const absoluteUrl = (path = "/") => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
};
