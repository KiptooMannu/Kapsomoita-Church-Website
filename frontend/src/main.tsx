import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { ThemeProvider } from '@/features/theme/ThemeProvider'
import { env } from '@/lib/env'
import { queryClient } from '@/lib/query-client'
import './index.css'

const container = document.getElementById('root')
if (!container) {
  // Fail loudly: a missing mount point means index.html and this entry disagree,
  // and a silent no-op would look like a blank white page with no explanation.
  throw new Error('Could not find #root in the document to mount the application.')
}

createRoot(container).render(
  <StrictMode>
    {/*
      Provider order matters:
        ErrorBoundary   outermost, so it can catch failures in any provider below
        HelmetProvider  document head; independent of the rest
        QueryClient     must wrap AuthProvider, which calls useQueryClient()
        ThemeProvider   independent, but wraps the tree that reads the theme
        AuthProvider    needs QueryClient; must wrap the router's guarded routes
        BrowserRouter   innermost of the providers, outermost of the app
    */}
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <TooltipProvider>
                <BrowserRouter basename={env.routerBasename}>
                  <App />
                </BrowserRouter>

                {/* richColors maps toast variants onto the themed palette so an
                    error toast is visibly an error, not just text. */}
                <Toaster
                  position="top-right"
                  richColors
                  closeButton
                  toastOptions={{ duration: 5000 }}
                />
              </TooltipProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)
