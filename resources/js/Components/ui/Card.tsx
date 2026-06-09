import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
    noPadding?: boolean;
}

function Card({ className, noPadding, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card text-sm text-card-foreground ring-1 ring-foreground/10",
        className
      )}
      {...props}
    />
  )
}

interface CardHeaderProps extends React.ComponentProps<"div"> {
    action?: React.ReactNode;
}

function CardHeader({ className, action, children, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header flex items-center justify-between border-b border-border/50 pb-4 px-4 pt-4",
        className
      )}
      {...props}
    >
      <div className="grid gap-0.5">
          {children}
      </div>
      {action && (
          <div data-slot="card-action" className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
              {action}
          </div>
      )}
    </div>
  )
}

interface CardBodyProps extends React.ComponentProps<"div"> {
    noPadding?: boolean;
}

function CardBody({ className, noPadding = false, ...props }: CardBodyProps) {
    return (
        <div
            data-slot="card-body"
            className={cn(
                noPadding ? "p-0" : "p-5",
                className
            )}
            {...props}
        />
    );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
}
