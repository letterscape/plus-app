export const mul18 = (amount: string): bigint => {
  if (!amount || amount.trim() === '' || isNaN(parseFloat(amount))) {
    console.log(`Invalid amount for mul18: "${amount}", returning 0`);
    return BigInt(0);
  }
  
  try {
    const value = BigInt(Math.round(parseFloat(amount) * 1e18));
    return value.valueOf();
  } catch (error) {
    console.error(`Error in mul18: ${error}`);
    return BigInt(0);
  }
}