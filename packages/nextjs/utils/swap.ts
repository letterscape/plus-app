import { Pool } from "~~/app/pool/_components/LiquidityList";
import { mul18 } from "~~/components/swap/Utils";
import { getTokenBySymbol, TokenInfo } from "~~/components/swap/TokenSelector";

// 定义TokenOrder类型
export type TokenOrder = {
  id: number,
  token: TokenInfo | null,
  amount: string,
}

/**
 * 查找匹配的交易池
 */
export function findPool(tokensIn: string[], tokensOut: string[], pools: Pool[]): Pool | null {
  if (!tokensIn || !tokensOut) return null
  let pool = null;
  debugger
  for (let i = 0; i < pools.length; i++) {
    let findGroupX = false;
    let findGroupY = false;
    const addressXs = pools[i].addressXs;
    const addressYs = pools[i].addressYs;
    let count = 0;
    for (let j = 0; j < tokensIn.length; j++) {
      for (let k = 0; k < addressXs.length; k++) {
        if (tokensIn[j] === addressXs[k]) {
          count++;
          continue;
        }
      }
      if (count === tokensIn.length) {
        findGroupX = true;
        break;
      }
    }
    count = 0;
    for (let j = 0; j < tokensOut.length; j++) {
      for (let k = 0; k < addressYs.length; k++) {
        if (tokensOut[j] === addressYs[k]) {
          count++;
          continue;
        }
      }
      if (count === tokensOut.length) {
        findGroupY = true;
        break;
      }
    }
    if (findGroupX && findGroupY) {
      pool = pools[i];
      console.log("find pool: ", pool);
      return pool;
    }
  }
  debugger
  for (let i = 0; i < pools.length; i++) {
    let findGroupX = false;
    let findGroupY = false;
    const addressXs = pools[i].addressXs;
    const addressYs = pools[i].addressYs;
    let count = 0;
    for (let j = 0; j < tokensOut.length; j++) {
      for (let k = 0; k < addressXs.length; k++) {
        if (tokensOut[j] === addressXs[k]) {
          count++;
          continue;
        }
      }
      if (count === tokensOut.length) {
        findGroupX = true;
        break;
      }
    }
    count = 0;
    for (let j = 0; j < tokensIn.length; j++) {
      for (let k = 0; k < addressYs.length; k++) {
        if (tokensIn[j] === addressYs[k]) {
          count++;
          continue;
        }
      }
      if (count === tokensIn.length) {
        findGroupY = true;
        break;
      }
    }
    if (findGroupX && findGroupY) {
      pool = pools[i];
      console.log("find pool: ", pool);
      return pool;
    }
  }
  return pool;
}

export function findPoolByToken(token: string, pools: Pool[]): Pool | null {
  if (!token) return null
  for (let i = 0; i < pools.length; i++) {
    const symbolXs = pools[i].symbolXs;
    const symbolYs = pools[i].symbolYs;
    for (let j = 0; j < symbolXs.length; j++) {
      if (token === symbolXs[j]) {
        return pools[i];
      }
    }
    for (let j = 0; j < symbolYs.length; j++) {
      if (token === symbolYs[j]) {
        return pools[i];
      }
    }
  }
  return null;
}

export function addSignleLiquidityParams(amt: string, pool: Pool): {
  groupA: readonly string[] | undefined; 
  groupB: readonly string[] | undefined; 
  amountsADesired: any[];
  amountsBDesired: any[];
  amountsAMin: any[];
  amountsBMin: any[];
} {
  debugger
  const groupA: readonly string[] | undefined = pool?.addressXs.filter((addr): addr is string => addr !== undefined);
  const groupB: readonly string[] | undefined = pool?.addressYs.filter((addr): addr is string => addr !== undefined);
  // const groupA = pool?.addressXs || [];
  // const groupB = pool?.addressYs || [];
  const amountsADesired = new Array(groupA.length).fill(0);
  const amountsBDesired = new Array(groupA.length).fill(0);
  const indexA = findTokenIndex("USDT", pool?.symbolXs);
  if (indexA >= 0) {
    amountsADesired[indexA] = amt;
  } else {
    const indexB = findTokenIndex("USDT", pool?.symbolYs);
    if (indexB < 0) alert('cannot find token');
    amountsBDesired[indexB] = amt;
  }
  const amountsAMin = new Array(groupA.length).fill(0);
  const amountsBMin = new Array(groupB.length).fill(0);
  return indexA >= 0 ? 
    {groupA: groupA, groupB: groupB, amountsADesired: amountsADesired, amountsBDesired: amountsBDesired, amountsAMin: amountsAMin, amountsBMin: amountsBMin}
    :
    {groupA: groupB, groupB: groupA, amountsADesired: amountsBDesired, amountsBDesired: amountsADesired, amountsAMin: amountsBMin, amountsBMin: amountsAMin}
}

function findTokenIndex(token: string, symbols: (string | undefined)[]): number {
  for (let i = 0; i < symbols.length; i++) {
    if (token === symbols[i]) return i;
  }
  return -1;
}