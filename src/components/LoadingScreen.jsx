import Logo from "./Logo";

const LoadingScreen = () => {
  return (
    <div className="premium-grid grid min-h-dvh place-items-center bg-cloud text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <div className="flex flex-col items-center gap-4">
        <Logo />
        <div className="h-1.5 w-44 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-brand-400 via-signal to-coral" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
