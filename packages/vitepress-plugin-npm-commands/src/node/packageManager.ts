export const packageManagers = ['npm', 'yarn', 'pnpm'] as const
export type PackageManager = typeof packageManagers[number]
