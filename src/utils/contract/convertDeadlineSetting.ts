export function convertDeadlineSetting(deadline: number) {
  return Math.floor(Date.now() / 1000) + 60 * deadline;
}
