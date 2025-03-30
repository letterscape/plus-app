"use client";

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { mul18 } from "~~/components/swap/Utils";
import { getTokenBySymbol, TokenInfo } from "~~/components/swap/TokenSelector";
import { Pool } from "~~/app/pool/_components/LiquidityList";
import ChatBubble from '~~/components/swap/ChatBubble';

type TokenOrder = {
  id: number,
  token: TokenInfo | null,
  amount: string,
}

export default function GlobalChatBubble() {
  const [mounted, setMounted] = useState(false);
  const [pools, setPools] = useState<Pool[]>([]);
  const account = useAccount();
  const { writeContractAsync: writeSwapContractAsync } = useScaffoldWriteContract({ contractName: "Swaplus" });
  
  // 加载池数据
  useEffect(() => {
    setMounted(true);
    
    // 加载池数据
    const storedPools = localStorage.getItem("pools");
    if (storedPools && storedPools !== "undefined") {
      setPools(JSON.parse(storedPools));
    }
  }, []);

  function findPool(tokensIn: string[], tokensOut: string[]): Pool | null {
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

  const handleGlobalSwap = async (params: any) => {
    console.log("Global chat received swap request:", params);
    
    try {
      // 验证参数
      if (!params || !params.fromTokens || !params.toTokens) {
        console.error("Invalid swap parameters:", params);
        return;
      }
      
      // 处理fromTokens
      const newFromTokens: TokenOrder[] = [];
      for (const item of params.fromTokens) {
        const tokenSymbol = item.token;
        const tokenInfo = getTokenBySymbol(tokenSymbol);
        
        if (!tokenInfo) {
          console.error(`Token not found: ${tokenSymbol}`);
          continue;
        }
        
        let amount = "0.1"; // 默认值
        if (item.amount && !isNaN(parseFloat(item.amount))) {
          amount = parseFloat(item.amount).toString();
        }
        
        newFromTokens.push({
          id: Date.now() + newFromTokens.length,
          token: tokenInfo,
          amount: amount
        });
      }
      
      // 处理toTokens
      const newToTokens: TokenOrder[] = [];
      for (const item of params.toTokens) {
        const tokenSymbol = item.token;
        const tokenInfo = getTokenBySymbol(tokenSymbol);
        
        if (!tokenInfo) {
          console.error(`Token not found: ${tokenSymbol}`);
          continue;
        }
        
        let amount = "0.1"; // 默认值
        if (item.amount && !isNaN(parseFloat(item.amount))) {
          amount = parseFloat(item.amount).toString();
        }
        
        newToTokens.push({
          id: Date.now() + 100 + newToTokens.length,
          token: tokenInfo,
          amount: amount
        });
      }
      
      if (newFromTokens.length === 0 || newToTokens.length === 0) {
        console.error("No valid tokens found");
        return;
      }
      
      // 执行swap操作
      const tokensIn = newFromTokens.map(token => token.token?.address || '0');
      const tokensOut = newToTokens.map(token => token.token?.address || '0');
      const amountsIn = newFromTokens.map(token => mul18(token.amount));
      const amountOutsMin = new Array(newFromTokens.length).fill(1);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 一小时过期
      
      console.log("Looking for pool with tokens:", tokensIn, tokensOut);
      const pool = findPool(tokensIn, tokensOut);
      
      if (!pool) {
        console.error("No matching pool found");
        return;
      }
      
      const groupIn = pool.addressXs.map(address => address || '0');
      const groupOut = pool.addressYs.map(address => address || '0');
      
      console.log("Executing swap with parameters:", {
        groupIn,
        groupOut,
        tokensIn,
        tokensOut,
        amountsIn: amountsIn.map(a => a.toString()),
        deadline: deadline.toString()
      });
      
      const tx = await writeSwapContractAsync({
        functionName: "swapExactTokensForTokens",
        args: [groupIn, groupOut, tokensIn, tokensOut, amountsIn, amountOutsMin, account.address, deadline],
      });
      
      console.log("Swap transaction:", tx);
      
      // 将执行结果发布为自定义事件，使其他组件可以响应
      const event = new CustomEvent('global-swap-executed', { 
        detail: { 
          success: true, 
          tx, 
          fromTokens: newFromTokens, 
          toTokens: newToTokens 
        } 
      });
      window.dispatchEvent(event);
      
    } catch (error) {
      console.error("Error executing swap:", error);
      
      // 发布失败事件
      const event = new CustomEvent('global-swap-executed', { 
        detail: { success: false, error } 
      });
      window.dispatchEvent(event);
    }
  };
  
  if (!mounted) return null;
  
  return <ChatBubble onSwapWithParams={handleGlobalSwap} />;
} 
