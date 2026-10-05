export function activeRoyalDuty(ratios: readonly number[], previous: number): number {
  let active = previous;
  let greatest = 0;

  for (let index = 0; index < ratios.length; index += 1) {
    const ratio = ratios[index];
    if (ratio > greatest) {
      greatest = ratio;
      active = index;
    }
  }

  return active;
}
