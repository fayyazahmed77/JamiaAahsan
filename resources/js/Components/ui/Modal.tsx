import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog"
import { cn } from "@/lib/utils"

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    footer?: React.ReactNode;
}

const sizeMap = {
    sm: 'sm:max-w-[400px]',
    md: 'sm:max-w-[560px]',
    lg: 'sm:max-w-[720px]',
    xl: 'sm:max-w-[900px]',
};

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
            <DialogContent className={cn("max-h-[calc(100vh-80px)] flex flex-col p-0 overflow-hidden", sizeMap[size])}>
                {title && (
                    <DialogHeader className="p-4 border-b border-border/50 shrink-0">
                        <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
                    </DialogHeader>
                )}
                
                <div className="flex-1 overflow-y-auto p-5 text-sm">
                    {children}
                </div>

                {footer && (
                    <DialogFooter className="p-4 border-t border-border/50 bg-muted/30 shrink-0 flex items-center justify-end gap-2 sm:flex-row">
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
