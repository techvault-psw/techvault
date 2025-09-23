import type { SVGProps } from "react";

interface ArrowLeftIconProps extends SVGProps<SVGSVGElement> {}

export const ArrowLeftIcon = (props: ArrowLeftIconProps) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5.21663 8.6665L8.94996 12.3998L7.99996 13.3332L2.66663 7.99984L7.99996 2.6665L8.94996 3.59984L5.21663 7.33317H13.3333V8.6665H5.21663Z" fill="white"/>
    </svg>
  );
}
