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
