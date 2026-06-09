import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends Omit<React.ComponentProps<"input">, "type"> {
    label?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, label, checked, onCheckedChange, id, ...props }, ref) => {
        const inputId = id ?? React.useId();
        
        return (
            <div className="flex items-center gap-3">
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <input
                        type="checkbox"
                        ref={ref}
                        id={inputId}
                        checked={checked}
                        onChange={(e) => onCheckedChange?.(e.target.checked)}
                        className="peer sr-only"
                        {...props}
                    />
                    <div 
                        onClick={() => onCheckedChange?.(!checked)}
                        className={cn(
                            "absolute inset-0 rounded-full border transition-all duration-200",
                            checked 
                                ? "bg-sapphire-500 border-sapphire-500 dark:bg-sapphire-400 dark:border-sapphire-400" 
                                : "bg-stone-200 border-stone-300 dark:bg-stone-800 dark:border-stone-700"
                        )} 
                    />
                    <div
                        onClick={() => onCheckedChange?.(!checked)}
                        className={cn(
                            "absolute left-[2px] h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
                            checked ? "translate-x-5" : "translate-x-0"
                        )}
                    />
                </div>
                {label && (
                    <label 
                        htmlFor={inputId} 
                        className="text-sm font-semibold text-stone-700 dark:text-stone-300 cursor-pointer select-none"
                    >
                        {label}
                    </label>
                )}
            </div>
        )
    }
)
Switch.displayName = "Switch"
