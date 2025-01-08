import { cva } from "class-variance-authority"

export const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-white shadow hover:bg-primary/80",
        claude:
          "border-transparent bg-orange-500 text-white shadow hover:bg-orange-500/80",
        chatgpt:
          "border-transparent bg-emerald-500 text-white shadow hover:bg-emerald-500/80",
        perplexity:
          "border-transparent bg-blue-500 text-white shadow hover:bg-blue-500/80",
        gemini:
          "border-transparent bg-purple-500 text-white shadow hover:bg-purple-500/80",
        vercel:
          "border-transparent bg-pink-500 text-white shadow hover:bg-pink-500/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
) 