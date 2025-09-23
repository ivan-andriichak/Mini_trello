import { FC, ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

 const Button: FC<ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }> = ({
                                                                                                children,
                                                                                                className,
                                                                                                ...props
                                                                                              }) => (
  <button
    {...props}
    className={clsx(
      "relative overflow-hidden text-black p-2 rounded-md bg-gray-300 group transition focus:ring-2 focus:ring-blue-400",
      className
    )}
  >
    <span className="relative z-10">{children}</span>
    <span
     className="flex-1 border border-gray-300 rounded-md p-2 absolute inset-0 bg-blue-300 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"
      aria-hidden="true"
    />
  </button>
);

export{ Button };
