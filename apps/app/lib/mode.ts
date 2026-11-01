/** Live providers run only when this is explicitly turned off and keys exist. */
export function dryRunEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.SCHEMACRAFT_DRY_RUN !== '0';
}
