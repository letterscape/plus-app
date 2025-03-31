"use client";

import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import TokenSelector, { getTokenBySymbol, TokenInfo } from "~~/components/swap/TokenSelector";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ERC20ABI } from "~~/components/swap/Abi";
import { SwapContract } from "~~/components/swap/Config";
import { parseEther } from "viem";
import externalContracts from "~~/contracts/externalContracts";
import { mul18 } from "~~/components/swap/Utils";
import Decimal from "decimal.js";
import { useRouter } from "next/navigation";

type LiquidityToken = {
  id: number,
  token: TokenInfo | null,
  amount: string,
}

export default function CreateLiquidity() {
  const [tokensX, setTokensX] = useState<LiquidityToken[]>([{ id: 1, token: null, amount: "" }]);
  const [tokensY, setTokensY] = useState<LiquidityToken[]>([{ id: 1, token: null, amount: "" }]);
  const { writeContract: writeSwapContract, writeContractAsync: writeSwapContractAsync } = useScaffoldWriteContract({ contractName: "Swaplus" });
  const router = useRouter();
  const account = useAccount();
  const { writeContractAsync } = useWriteContract();

  // 处理 Token 增加
  const addToken = (setTokens: Function) => {
    setTokens((tokens: any[]) => [...tokens, { id: Date.now(), token: "", amount: "" }]);
  };

  // 处理 Token 删除
  const removeToken = (setTokens: Function, index: number) => {
    setTokens((tokens: any[]) => (tokens.length > 1 ? tokens.filter((_, i) => i !== index) : tokens));
  };

  const handleInputChange = (setTokens: Function, index: number, field: "token" | "amount", value: string, extra: any) => {
      setTokens((tokens: LiquidityToken[]) => {
        if (field === 'amount') {
          const amt = Decimal(value || 0);
          const weight = Decimal(extra.token?.weight || '0');
          tokensX.map(item => item.amount = (amt.mul(weight).div(Decimal(getTokenBySymbol(item.token?.symbol || '')?.weight || 0))).toString());
          tokensY.map(item => item.amount = (amt.mul(weight).div(Decimal(getTokenBySymbol(item.token?.symbol || '')?.weight || 0))).toString());
        }
        return tokens.map((item, i) => (i === index ? { ...item, [field]: value } : item))
      });
    };

  // const { data: name } = useScaffoldReadContract({
  //   contractName: "PEPE",
  //   functionName: "name",
  // });
  // console.log("name: ", name);
  // const { data: allowance } = useScaffoldReadContract({
  //   contractName: "PEPE",
  //   functionName: "allowance",
  //   args: [account.address, SwapContract],
  // })
  // console.log("allowance: ", allowance);

  // const dydxname = useReadContract({
  //   abi: ERC20ABI,
  //   address: "0x74Ce26A2e4c1368C48A0157CE762944d282896Db",
  //   functionName: 'name',
  // })
  // console.log("dydxname: ", dydxname.data);
  // const dydxallowance = useReadContract({
  //   abi: ERC20ABI,
  //   address: "0x74Ce26A2e4c1368C48A0157CE762944d282896Db",
  //   functionName: 'allowance',
  //   args: [account.address, SwapContract],
  //   account: account.address,
  // })
  // console.log("dydxallowance: ", dydxallowance.data);

  const handleCreateLiquidity = async () => {
    try {
      const groupA: readonly string[] | undefined = tokensX.map(item => item.token?.address).filter((addr): addr is string => addr !== undefined);
      const groupB: readonly string[] | undefined = tokensY.map(item => item.token?.address).filter((addr): addr is string => addr !== undefined);
      const amountsADesired = tokensX.map(item => mul18(item.amount));
      const amountsBDesired = tokensY.map(item => mul18(item.amount));
      const amountsAMin = new Array(groupA.length).fill(1);
      const amountsBMin = new Array(groupB.length).fill(1);
      const deadline = BigInt(Date.now() * 3600 * 1000);
      for (let i = 0; i < groupA.length; i++) {
        const tx = await writeContractAsync({
          abi: ERC20ABI,
          address: groupA[i],
          functionName: 'approve',
          args: [externalContracts[1].Swaplus.address, BigInt(Number.MAX_SAFE_INTEGER * 10**18)]
        })
        console.log("approve tx: ", tx);
        
      }
      for (let i = 0; i < groupB.length; i++) {
        const tx = await writeContractAsync({
          abi: ERC20ABI,
          address: groupB[i],
          functionName: 'approve',
          args: [externalContracts[1].Swaplus.address, BigInt(Number.MAX_SAFE_INTEGER * 10**18)]
        })
      }
      // const tx = await writeSwapContractAsync({
      //   functionName: "addLiquidity",
      //   args: [groupA, groupB, amountsADesired, amountsBDesired, amountsAMin, amountsBMin, account.address, deadline],
      // });
      const tx = await writeContractAsync({
        abi: externalContracts[1].Swaplus.abi,
        address: externalContracts[1].Swaplus.address,
        functionName: "addLiquidity",
        args: [groupA, groupB, amountsADesired, amountsBDesired, amountsAMin, amountsBMin, account.address, deadline],
      });
      console.log("addLiquidity tx: ", tx);
      router.push("/pool");
      router.refresh();
    } catch (e) {
      console.error("Error setting greeting:", e);
    }
  }

  return (
    <div className="w-3/4 mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200 mt-8">
      <h2 className="text-xl font-bold mb-4 text-center">Add Liquidity</h2>

      <div className="flex items-center space-x-4">
        {/* From Tokens */}
        <div className="w-1/2">
          {tokensX.map((item, index) => (
            <div key={item.id} className="relative mb-2 bg-gray-100 p-3 rounded-lg flex items-center justify-between">
              <input
                type="number"
                placeholder="0.0"
                value={item.amount}
                onChange={(e) => handleInputChange(setTokensX, index, "amount", e.target.value, item)}
                className="w-1/2 bg-transparent text-lg font-semibold outline-none"
              />
              <TokenSelector selectedToken={item.token} setSelectedToken={(token: any) => handleInputChange(setTokensX, index, "token", token, null)} />
              {tokensX.length > 1 && (
                <button
                  onClick={() => removeToken(setTokensX, index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addToken(setTokensX)}
            className="w-full flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            <Plus className="mr-1" size={16} />
            Add X token
          </button>
        </div>

        {/* Y 侧输入框 */}
        <div className="w-1/2">
          {/* <h3 className="text-lg font-semibold text-center">Token Y</h3> */}
          {tokensY.map((item, index) => (
            <div key={item.id} className="relative mb-2 bg-gray-100 p-3 rounded-lg flex items-center justify-between">
              <input
                type="number"
                placeholder="0.0"
                value={item.amount}
                onChange={(e) => handleInputChange(setTokensY, index, "amount", e.target.value, item)}
                className="w-1/2 bg-transparent text-lg font-semibold outline-none"
              />
              <TokenSelector selectedToken={item.token} setSelectedToken={(token: any) => handleInputChange(setTokensY, index, "token", token, null)} />
              {tokensX.length > 1 && (
                <button
                  onClick={() => removeToken(setTokensY, index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addToken(setTokensY)}
            className="w-full flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            <Plus className="mr-1" size={16} />
            Add Y token
          </button>
        </div>
      </div>

      <button 
        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
        onClick={handleCreateLiquidity}
      >
        Add
      </button>
    </div>
  );
}
