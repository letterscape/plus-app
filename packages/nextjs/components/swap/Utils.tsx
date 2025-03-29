export const mul18 = (amount: string): bigint => {
  const value = BigInt(Math.round(parseFloat(amount) * 1e18));
  return value.valueOf();
}