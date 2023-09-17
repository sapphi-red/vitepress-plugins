export const packageManagers = ['npm', 'yarn', 'pnpm', 'bun'] as const
export type PackageManager = (typeof packageManagers)[number]
