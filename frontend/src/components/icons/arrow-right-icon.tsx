import type { SVGProps } from "react";

interface ArrowRightIconProps extends SVGProps<SVGSVGElement> {}

export const ArrowRightIcon = (props: ArrowRightIconProps) => {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.5625 19.25L19.3125 12.5L12.5625 5.75M18.375 12.5H4.6875" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
