import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

import { absoluteUrl, siteConfig } from "../seo/siteConfig";
import { findSeoRoute, robotsDirectives } from "../seo/routes";

const asArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const SEO = ({ title, description, canonical, keywords, robots, image, type = "website", schemas }) => {
  const location = useLocation();
  const routeSeo = findSeoRoute(location.pathname);
  const pageTitle = title || routeSeo.title;
  const pageDescription = description || routeSeo.description;
  const canonicalUrl = canonical || absoluteUrl(routeSeo.path || location.pathname);
  const imageUrl = absoluteUrl(image || routeSeo.image || siteConfig.ogImage);
  const keywordContent = asArray(keywords || routeSeo.keywords).join(", ");
  const robotsContent = robots || routeSeo.robots || robotsDirectives.index;
  const jsonLd = asArray(schemas || routeSeo.schemas);

  return (
    <Helmet prioritizeSeoTags>
      <html lang={siteConfig.language} />
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      {keywordContent && <meta name="keywords" content={keywordContent} />}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content={robotsContent} />
      <meta name="author" content={siteConfig.author} />
      <meta name="application-name" content={siteConfig.name} />
      <meta name="theme-color" content={siteConfig.themeColor} />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta name="format-detection" content="telephone=no, address=no, email=no" />
      <meta name="google-site-verification" content={siteConfig.verification.google} />
      <meta name="msvalidate.01" content={siteConfig.verification.bing} />
      <meta name="yandex-verification" content={siteConfig.verification.yandex} />

      <link rel="canonical" href={canonicalUrl} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${siteConfig.name} content optimization dashboard`} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={siteConfig.locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={`${siteConfig.name} content optimization dashboard`} />
      <meta name="twitter:site" content={siteConfig.twitterSite} />
      <meta name="twitter:creator" content={siteConfig.twitterCreator} />

      {jsonLd.map((schema, index) => (
        <script key={`${schema["@type"] || "schema"}-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
