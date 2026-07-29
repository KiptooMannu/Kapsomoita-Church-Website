import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Button variants.
 *
 * `gold` and `nav-link` are carried over from the pre-TypeScript button because
 * the existing public pages use them. Their original implementation referenced
 * classes that never existed (`shadow-warm`, `bg-gradient-gold`,
 * `text-church-deep-brown`), so they silently rendered unstyled; they are
 * reimplemented here against the real design tokens.
 */
const buttonVariants = cva(
  cn(
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg',
    'text-sm font-medium outline-none transition-all duration-200',
    'focus-visible:ring-ring/60 focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
    "aria-invalid:ring-destructive/30 aria-invalid:border-destructive",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover',
        destructive:
          'bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-soft hover:bg-secondary hover:text-secondary-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-secondary hover:text-secondary-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        success: 'bg-success text-success-foreground shadow-soft hover:bg-success/90',

        /** Warm accent call-to-action, e.g. "Give Online". */
        gold: cn(
          'bg-gradient-to-r from-gold-400 to-gold-500 text-accent-foreground',
          'font-semibold shadow-soft hover:from-gold-500 hover:to-gold-600 hover:shadow-card',
        ),

        /**
         * Public-site navigation link with an underline that grows from the
         * centre on hover. The pseudo-element is centred with a translate rather
         * than the original's `left-1/8` (not a real Tailwind class).
         */
        'nav-link': cn(
          'text-foreground hover:text-primary relative rounded-md px-3 py-2',
          'after:bg-primary after:absolute after:bottom-0.5 after:left-1/2',
          'after:h-0.5 after:w-0 after:-translate-x-1/2 after:transition-all after:duration-300',
          'hover:after:w-3/4',
        ),
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-9 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-11 rounded-lg px-6 text-base has-[>svg]:px-5',
        xl: 'h-13 rounded-xl px-8 text-base has-[>svg]:px-7',
        icon: 'size-10',
        'icon-sm': 'size-9',
        'icon-lg': 'size-11',
      },
      /** Full width on mobile, intrinsic from the given breakpoint upward. */
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      block: false,
    },
  },
)

export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render the child element instead of a `<button>`, forwarding all styles.
   * Use for links that look like buttons: `<Button asChild><Link …/></Button>`,
   * which keeps real anchor semantics for keyboard and middle-click.
   */
  asChild?: boolean
}

export function Button({
  className,
  variant,
  size,
  block,
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      data-slot="button"
      // Default to type="button": an unspecified <button> inside a form submits
      // it, which is a persistent source of accidental submissions.
      {...(asChild ? {} : { type: type ?? 'button' })}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  )
}

export { buttonVariants }
