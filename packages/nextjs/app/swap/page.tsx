"use client";

import { useState } from "react";
import { ArrowRight, X, Plus } from "lucide-react";
import TokenSelector, { getTokenBySymbol, TokenInfo } from "~~/components/swap/TokenSelector";
import { useAccount, useWriteContract } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { mul18 } from "~~/components/swap/Utils";
import { Pool } from "../pool/_components/LiquidityList";
import { useRouter } from "next/navigation";
import Decimal from "decimal.js";
import { findPool, TokenOrder } from "~~/utils/swap";

export default function Swap() {
  const [pools, setPools] = useState<Pool[]>(() => {
    const isBrowser = typeof window !== "undefined";
    if (!isBrowser) {
      return [];
    }
    const pools = localStorage.getItem("pools");
    return pools && pools !== "undefined" ? JSON.parse(pools) : [];
  });

  const router = useRouter();
  const account = useAccount();
  const { writeContract, writeContractAsync } = useWriteContract();
  const { writeContractAsync: writeSwapContractAsync } = useScaffoldWriteContract({ contractName: "Swaplus" });
  const [fromTokens, setFromTokens] = useState<TokenOrder[]>([{ id: 1, token: null, amount: "" }]);
  const [toTokens, setToTokens] = useState<TokenOrder[]>([{ id: 1, token: null, amount: "" }]);


  // 处理 Token 增加
  const addToken = (setTokens: Function) => {
    setTokens((tokens: any[]) => [...tokens, { id: Date.now(), token: "", amount: "" }]);
  };

  // 处理 Token 删除
  const removeToken = (setTokens: Function, index: number) => {
    setTokens((tokens: any[]) => (tokens.length > 1 ? tokens.filter((_, i) => i !== index) : tokens));
  };

  // 处理输入变化
  const handleInputChange = (setTokens: Function, index: number, field: "token" | "amount", value: string, extra: any) => {
    setTokens((tokens: TokenOrder[]) => {
      if (field === 'amount') {
        const amt = Decimal(value || 0);
        const weight = Decimal(extra.token?.weight || '0');
        fromTokens.map(item => item.amount = (amt.mul(weight).div(Decimal(getTokenBySymbol(item.token?.symbol || '')?.weight || 0))).toString());
        toTokens.map(item => item.amount = (amt.mul(weight).div(Decimal(getTokenBySymbol(item.token?.symbol || '')?.weight || 0))).toString());
      }
      return tokens.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    });
  };

  const handleSwap = async () => {
    
    if (!pools) return;

    const tokensIn = fromTokens.map(token => token.token?.address || '0')
    const tokensOut = toTokens.map(token => token.token?.address || '0')
    const amountsIn = fromTokens.map(token => mul18(token.amount));
    const amountOutsMin = new Array(fromTokens.length).fill(1);
    const deadline = BigInt(Date.now() * 3600 * 1000);
  
    const pool = findPool(tokensIn, tokensOut, pools);
    debugger
    if (!pool) return;
    const groupIn = pool.addressXs.map(address => address || '0');
    const groupOut = pool.addressYs.map(address => address || '0');
    debugger
    const tx = await writeSwapContractAsync({
      functionName: "swapExactTokensForTokens",
      args: [groupIn, groupOut, tokensIn, tokensOut, amountsIn, amountOutsMin, account.address, deadline],
    });
    console.log("swap tx: ", tx);
    router.refresh();
  }

  return (
    <div className="w-3/4 mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200 mt-8">
      <h2 className="text-xl font-bold mb-4 text-center">Swap</h2>

      <div className="flex items-center space-x-4">
        {/* From Tokens */}
        <div className="w-1/2">
          {fromTokens.map((item, index) => (
            <div key={item.id} className="relative mb-2 bg-gray-100 p-3 rounded-lg flex items-center justify-between">
              <input
                type="number"
                placeholder="0.0"
                value={item.amount}
                onChange={(e) => handleInputChange(setFromTokens, index, "amount", e.target.value, item)}
                className="w-1/2 bg-transparent text-lg font-semibold outline-none"
              />
              {/* <button className="flex iterms-center bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition">
                {item.token || "select token"} <ChevronDown className="ml-1" />
              </button> */}
              <TokenSelector selectedToken={item.token} setSelectedToken={(token: any) => handleInputChange(setFromTokens, index, "token", token, null)} />
              {fromTokens.length > 1 && (
                <button onClick={() => removeToken(setFromTokens, index)} className="ml-2 text-red-500">
                  <X />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addToken(setFromTokens)}
            className="w-full flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            <Plus className="mr-1" size={16} />
            Add From Token
          </button>
        </div>
        {/* Swap Icon */}
        <div className="flex justify-center">
          <ArrowRight className="w-8 h-8 text-gray-500" />
        </div>

        {/* To Tokens */}
        <div className="w-1/2">
          {toTokens.map((item, index) => (
            <div key={item.id} className="relative mb-2 bg-gray-100 p-3 rounded-lg flex items-center  justify-between">
              <input
                type="number"
                placeholder="0.0"
                value={item.amount}
                onChange={(e) => handleInputChange(setToTokens, index, "amount", e.target.value, item)}
                className="w-1/2 bg-transparent text-lg font-semibold outline-none"
              />
              {/* <button className="flex items-center bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition">
                {item.token || "select token"} <ChevronDown className="ml-1" />
              </button> */}
              <TokenSelector selectedToken={item.token} setSelectedToken={(token: any) => handleInputChange(setToTokens, index, "token", token, null)} />
              {toTokens.length > 1 && (
                <button onClick={() => removeToken(setToTokens, index)} className="ml-2 text-red-500">
                  <X />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => addToken(setToTokens)}
            className="w-full flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            <Plus className="mr-1" size={16} />
            Add To Token
          </button>
        </div>
      </div>

      {/* Swap Button */}
      <button 
        className="flex mx-auto justify-center w-2/5 bg-btn-swap text-white py-3 rounded-lg mt-4 hover:scale-105 transition"
        onClick={() => handleSwap()}
      >
        Swap
      </button>
    </div>
  );
}

