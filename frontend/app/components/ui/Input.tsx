import {FC, InputHTMLAttributes} from "react";
import clsx from "clsx";

export const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({
                                                                   className = "",
                                                                   ...props
                                                                 }) => (
  <input
    {...props}
    className={clsx(
      "border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition",
      className
    )}
  />
);