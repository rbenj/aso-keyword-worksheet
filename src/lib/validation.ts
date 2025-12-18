export function isIntValid(value: number, min?: number, max?: number): boolean {
  return !isNaN(value)
    && Number.isInteger(value)
    && (min === undefined || value >= min)
    && (max === undefined || value <= max);
}
