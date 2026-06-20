import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md text-xs font-medium px-2 py-0.5",
  {
    variants: {
      variant: {
        default: "bg-surface-overlay text-text-muted border border-border",
        blue: "bg-blue/10 text-blue border border-blue-border",
        amber: "bg-amber/10 text-amber border border-amber-border",
        emerald: "bg-emerald/10 text-emerald border border-emerald-border",
        rose: "bg-rose/10 text-rose border border-rose-border",
        sky: "bg-sky/10 text-sky border border-sky-border",
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
