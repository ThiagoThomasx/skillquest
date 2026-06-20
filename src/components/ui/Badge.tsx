import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-2.5 py-0.5",
  {
    variants: {
      variant: {
        default: "bg-surface-overlay text-text-muted border border-border",
        violet: "bg-violet/10 text-violet border border-violet-border",
        gold: "bg-gold/10 text-gold border border-gold-border",
        emerald: "bg-emerald/10 text-emerald border border-emerald/20",
        rose: "bg-rose/10 text-rose border border-rose-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
