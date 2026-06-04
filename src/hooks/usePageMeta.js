import { useEffect } from "react";

const setMeta = (name, content, attribute = "name") => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

export const usePageMeta = ({ title, description, url }) => {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
    }
    if (title) setMeta("og:title", title, "property");
    if (url) {
      setMeta("og:url", url, "property");
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", url);
    }
  }, [description, title, url]);
};
