import clsx from "clsx";

const Card = ({ children, className, as: Component = "div", ...props }) => {
  return (
    <Component
      className={clsx(
        "surface rounded-lg p-5 transition duration-200",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
