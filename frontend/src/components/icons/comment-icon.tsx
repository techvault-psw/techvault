import type { SVGProps } from "react";

interface CommentIconProps extends SVGProps<SVGSVGElement> {}

export const CommentIcon = (props: CommentIconProps) => {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M13.9999 24.5C16.29 24.4995 18.5171 23.7503 20.3419 22.3666C22.1667 20.9828 23.489 19.0405 24.1075 16.8355C24.7259 14.6305 24.6065 12.2837 23.7674 10.1529C22.9283 8.02207 21.4156 6.22397 19.4598 5.03264C17.504 3.8413 15.2123 3.32205 12.934 3.55402C10.6557 3.78598 8.5157 4.75644 6.84012 6.31751C5.16454 7.87857 4.04526 9.94464 3.65286 12.2009C3.26046 14.4571 3.61645 16.7797 4.66658 18.8148L3.49991 24.5L9.18508 23.3333C10.6271 24.0788 12.2651 24.5 13.9999 24.5Z" stroke="white" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.75 14H8.76167V14.0117H8.75V14ZM14 14H14.0117V14.0117H14V14ZM19.25 14H19.2617V14.0117H19.25V14Z" stroke="white" strokeWidth="3.5" strokeLinejoin="round"/>
    </svg>
  );
}
