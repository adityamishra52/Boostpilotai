const scrollToTopNow = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  if (document.scrollingElement) {
    document.scrollingElement.scrollTop = 0;
  }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const scrollContainers = document.querySelectorAll("[data-route-scroll-container]");
  scrollContainers.forEach((container) => {
    container.scrollTo({ top: 0, left: 0, behavior: "instant" });
    container.scrollTop = 0;
  });
};

export const resetPageScroll = () => {
  scrollToTopNow();

  if (typeof window === "undefined") {
    return;
  }

  window.requestAnimationFrame(() => {
    scrollToTopNow();
    window.requestAnimationFrame(scrollToTopNow);
  });

  window.setTimeout(scrollToTopNow, 0);
  window.setTimeout(scrollToTopNow, 50);
  window.setTimeout(scrollToTopNow, 120);
  window.setTimeout(scrollToTopNow, 300);
};
