import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Rendered instead of the default screen when provided. */
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Catches render-time exceptions so one broken component does not blank the app.
 *
 * Must be a class: `componentDidCatch` has no hook equivalent. Note the boundary
 * catches only errors thrown during render, in lifecycle methods and in constructors
 * — not those from event handlers or async code, which is why request failures are
 * handled by TanStack Query and the axios interceptor instead.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // In production this is where a reporting service (Sentry et al.) would be
    // called; until one is configured, the console is the only sink available.
    console.error('Unhandled render error:', error, errorInfo.componentStack)
  }

  private readonly handleReload = (): void => {
    // A full reload rather than clearing the error state: the component tree that
    // threw is likely to throw again from the same stale props or cache.
    window.location.reload()
  }

  override render(): ReactNode {
    const { error } = this.state
    const { children, fallback } = this.props

    if (error === null) {
      return children
    }

    if (fallback !== undefined) {
      return fallback
    }

    return (
      <div className="bg-background flex min-h-dvh items-center justify-center px-4">
        <div className="flex max-w-md flex-col items-center text-center">
          <span className="bg-destructive/10 text-destructive mb-6 flex size-16 items-center justify-center rounded-2xl">
            <AlertTriangleIcon className="size-8" aria-hidden="true" />
          </span>

          <h1 className="text-xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground mt-3 text-sm">
            An unexpected error stopped this page from loading. Reloading usually fixes
            it. If it keeps happening, please let your administrator know.
          </p>

          {/* The message is shown in development only: in production it can leak
              internal details and means nothing to a church volunteer. */}
          {env.isDevelopment && (
            <pre className="bg-muted text-destructive mt-5 max-h-40 w-full overflow-auto rounded-lg p-3 text-left text-xs">
              {error.message}
            </pre>
          )}

          <Button onClick={this.handleReload} className="mt-8">
            <RefreshCwIcon aria-hidden="true" />
            Reload the page
          </Button>
        </div>
      </div>
    )
  }
}
