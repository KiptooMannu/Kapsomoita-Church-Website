/**
 * Compatibility shim.
 *
 * The original `cn` here joined class strings, which cannot resolve conflicting
 * Tailwind utilities. The real implementation now lives in `src/lib/utils.ts`;
 * this file re-exports it so the existing .jsx components keep working unchanged
 * during the TypeScript migration.
 *
 * New code should import from `@/lib/utils` directly. Delete this file once no
 * .jsx component imports it.
 */
export { cn } from '../../lib/utils'
