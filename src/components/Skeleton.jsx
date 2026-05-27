import clsx from "clsx";

const Skeleton = ({ className }) => {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80",
        className
      )}
    />
  );
};

export default Skeleton;
