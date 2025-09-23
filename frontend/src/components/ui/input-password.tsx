import * as React from "react"

import { cn } from "@/lib/utils"

import { EyeOpenIcon } from "../icons/eye-open-icon"
import { EyeClosedIcon } from "../icons/eye-closed-icon"

export default function InputPassword({ className, ...props }: React.ComponentProps<"input">) {
  const [passwordShown, setPasswordShown] = React.useState(false);

  const passwordVisibility = () => {
    return passwordShown ? "text" : "password";
  }

  return (
    <div className={cn(`gap-2 flex items-center justify-between w-full px-3 py-2
      bg-gray/5 backdrop-blur-sm rounded-lg border border-gray/50 text-base shadow-xs transition-[color,box-shadow] 
      focus-visible:border-white focus-visible:ring-white focus-visible:ring-[1px]
      aria-invalid:ring-red/40 aria-invalid:border-red`, className)} 
      aria-invalid = {props["aria-invalid"]}
    >
      <input
        type={passwordVisibility()}
        data-slot="input"
        className="flex-1 outline-none placeholder:text-gray/50 disabled:cursor-not-allowed leading-none"
        placeholder={passwordShown ? "ABC123" : "••••••"}
        {...props}
      />
      <button type="button" className="size-6 cursor-pointer" onClick={() => setPasswordShown(!passwordShown)}>
        {passwordShown ? <EyeOpenIcon className="fill-white size-full"/> : <EyeClosedIcon className="fill-white size-full"/>}
      </button>
    </div>
  )
}
