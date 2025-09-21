import type { SVGProps } from "react";

interface FilterIconProps extends SVGProps<SVGSVGElement> {}

export const FilterIcon = (props: FilterIconProps) => {
  return (
    <svg width="17" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M14.6667 2.5H1.33337L6.66671 8.80667V13.1667L9.33337 14.5V8.80667L14.6667 2.5Z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="black"/>
    </svg>
  );
}
