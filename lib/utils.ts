/**
 * Converts `t` to a Unix timestamp from a Date object unless it's already
 * a number.
 */
function toUnixTime(date: Date | number): number {
  return date instanceof Date ? date.getTime() / 1000 : date;
}

/**
 * Converts `t` to a Date object from a Unix timestamp unless it's not a
 * number.
 */
function fromUnixTime(t: number | Date): Date {
  return typeof t === "number" ? new Date(t * 1000) : t;
}

/**
 * Converts `str` to a Date object from a Date string (or null).
 * Returns null if str is falsy.
 */
function fromDateString(str: string | Date | undefined): Date | null {
  return str ? (str instanceof Date ? str : new Date(str)) : null;
}

export {
  toUnixTime,
  fromUnixTime,
  fromDateString
};
