"use client";

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { mul18 } from "~~/components/swap/Utils";
import { getTokenBySymbol, TokenInfo } from "~~/components/swap/TokenSelector";
import { Pool } from "~~/app/pool/_components/LiquidityList";
import ChatBubble from '~~/components/swap/ChatBubble';
import { findPool } from '~~/utils/swap';

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
      const deadline = BigInt(Date.now() * 3600 * 1000);
      
      console.log("Looking for pool with tokens:", tokensIn, tokensOut);
      const pool = findPool(tokensIn, tokensOut, pools);
      
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
    } catch (error) {
      console.error("Error executing swap:", error);
    }
  };
  
  if (!mounted) return null;
  
  return <ChatBubble onSwapWithParams={handleGlobalSwap} />;
} 
