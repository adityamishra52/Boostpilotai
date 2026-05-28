import clsx from "clsx";

const Card = ({ children, className, as: Component = "div", ...props }) => {
  return (
    <Component
      className={clsx(
        "surface min-w-0 rounded-lg p-4 transition duration-200 sm:p-5",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
