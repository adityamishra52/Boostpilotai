import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import FloatingHelpWidget from "./components/FloatingHelpWidget";
import { resetPageScroll } from "./utils/scrollReset";

const App = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    resetPageScroll();
  }, [location.pathname, location.search, location.hash]);

  const handleInternalLinkClick = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    const link = event.target.closest?.("a[href]");

    if (!link || link.target || link.hasAttribute("download")) {
      return;
    }

    const nextUrl = new URL(link.href, window.location.href);

    if (nextUrl.origin !== window.location.origin) {
      return;
    }

    resetPageScroll();
  };

  return (
    <div onClickCapture={handleInternalLinkClick}>
      <AppRoutes />
      <FloatingHelpWidget />
    </div>
  );
};

export default App;
