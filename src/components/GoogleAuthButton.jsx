import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const GoogleIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.52z" />
    <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.44l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A9.99 9.99 0 0 0 12 22z" />
    <path fill="#FBBC05" d="M6.41 13.89A6.02 6.02 0 0 1 6.1 12c0-.66.11-1.3.31-1.89V7.52H3.06A9.99 9.99 0 0 0 2 12c0 1.61.39 3.14 1.06 4.48l3.35-2.59z" />
    <path fill="#EA4335" d="M12 5.98c1.47 0 2.8.51 3.84 1.5l2.88-2.88C16.96 2.96 14.7 2 12 2a9.99 9.99 0 0 0-8.94 5.52l3.35 2.59C7.2 7.75 9.4 5.98 12 5.98z" />
  </svg>
);

const GoogleAuthButton = ({ onSuccess, disabled = false }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientId) {
      return undefined;
    }

    let cancelled = false;
    let attempts = 0;
    const init = () => {
      if (cancelled) return;
      attempts += 1;

      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            setLoading(false);
            if (response?.credential) {
              onSuccess(response.credential);
              return;
            }
            toast.error("Google sign-in failed. Please try again or use email login.");
          }
        });
        setReady(true);
        return;
      }

      if (attempts < 30) {
        window.setTimeout(init, 150);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [clientId, onSuccess]);

  if (!clientId) {
    return null;
  }

  const signIn = () => {
    if (!ready || !window.google?.accounts?.id) {
      toast.error("Google sign-in is still loading. Please try again.");
      return;
    }

    setLoading(true);
    window.google.accounts.id.prompt((notification) => {
      if (
        notification.isNotDisplayed?.() ||
        notification.isSkippedMoment?.() ||
        notification.isDismissedMoment?.()
      ) {
        setLoading(false);
      }
    });
  };

  return (
    <button
      className="group inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-extrabold text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300/35 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
      disabled={disabled || loading}
      onClick={signIn}
      type="button"
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : <GoogleIcon />}
      Continue with Google
    </button>
  );
};

export default GoogleAuthButton;
