import type { SVGProps } from "react";

interface MenuIconProps extends SVGProps<SVGSVGElement> {}

export const MenuIcon = (props: MenuIconProps) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect rx="2" width="20" height="4" fill="#00BFFF"/>
      <rect y="8" rx="2" width="20" height="4" fill="#00BFFF"/>
      <rect y="16" rx="2" width="20" height="4" fill="#00BFFF"/>
    </svg>
  );
}
