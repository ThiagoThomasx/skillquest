import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl border transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface border-border",
        raised: "bg-surface-raised border-border",
        violet: "bg-violet/5 border-violet-border",
        gold: "bg-gold/5 border-gold-border",
        ghost: "bg-transparent border-border hover:bg-surface",
      },
      hoverable: {
        true: "hover:border-border-strong cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hoverable: false,
    },
  }
);

type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export function Card({ className, variant, hoverable, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, hoverable }), className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pt-5 pb-3", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-5 py-3 border-t border-border flex items-center gap-3", className)}
      {...props}
    />
  );
}
