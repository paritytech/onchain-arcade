// Common utilities — className merger, address formatting, balance formatting

/**
 * Simple className merger (combines classes, filters falsy values)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Truncate an address for display: 0x1234...abcd or 5Grwv...tQY
 */
export function truncateAddress(address: string, startLen = 6, endLen = 4): string {
  if (!address) return '';
  if (address.length <= startLen + endLen + 3) return address;
  return `${address.slice(0, startLen)}...${address.slice(-endLen)}`;
}

/**
 * Format a token balance for display
 * @param amount - Raw balance as bigint
 * @param decimals - Token decimals (10 for PAS native, 18 for EVM)
 * @param symbol - Token symbol to append
 */
export function formatBalance(amount: bigint, decimals = 10, symbol = 'PAS'): string {
  const divisor = 10n ** BigInt(decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  let trimmed = fractionalStr.replace(/0+$/, '');
  if (trimmed.length < 2) trimmed = fractionalStr.slice(0, 2);
  if (trimmed === '00' || trimmed.length === 0) return `${integerPart} ${symbol}`;
  return `${integerPart}.${trimmed} ${symbol}`;
}

/**
 * Async delay utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
