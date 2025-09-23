import type { SVGProps } from "react";

interface PlusIconProps extends SVGProps<SVGSVGElement> {}

export const PlusIcon = (props: PlusIconProps) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.00004 3.3335V12.6668M3.33337 8.00016H12.6667" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}
