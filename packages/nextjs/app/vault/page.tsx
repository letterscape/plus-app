'use client'

import { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { ERC20ABI } from "~~/components/swap/Abi";
import { getTokenBySymbol } from "~~/components/swap/TokenSelector";
import externalContracts from "~~/contracts/externalContracts";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWatchContractEvent, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { heuristRequest } from "~~/utils/http";
import axios from 'axios';
import { get_trending_coins } from "~~/utils/mcpMock";
import { Pool } from "../pool/_components/LiquidityList";
import { addSignleLiquidityParams, findPool, findPoolByToken } from "~~/utils/swap";
import { mul18 } from "~~/components/swap/Utils";

const Vault = () => {
  const [balance, setBalance] = useState('0');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Waiting for deposit...");
  const [hotTokens, setHotTokens] = useState<string[]>([]);
  const [pools, setPools] = useState<Pool[]>(() => {
    const isBrowser = typeof window !== "undefined";
    if (!isBrowser) {
      return [];
    }
    const pools = localStorage.getItem("pools");
    return pools && pools !== "undefined" ? JSON.parse(pools) : [];
  });

  const { writeContractAsync } = useWriteContract();
  const { writeContractAsync: writeVaultContractAsync } = useScaffoldWriteContract({ contractName: "Vault" });
  const account = useAccount();

  const { data: balanceData } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "balanceOf",
    args: [account.address],
  });
  useEffect(() => {
    if (balanceData) {
      setBalance(balanceData.toString());
    }
  }, [balanceData])
  
  const handleDeposit = async () => {
    setIsDepositModalOpen(true);
  };

  const confirmDeposit = async () => {
    setHotTokens([]);
    setIsDepositModalOpen(false);
   
    const txApprove = await writeContractAsync({
      abi: ERC20ABI,
      address: getTokenBySymbol("USDT")?.address || "",
      functionName: 'approve',
      args: [externalContracts[1].Vault.address, BigInt(Number.MAX_SAFE_INTEGER * 10**18)]
    })
    // const txDeposit = await writeVaultContractAsync({
    //   functionName: "deposit",
    //   args: [BigInt(depositAmount)],
    // });
    const txDeposit = await writeContractAsync({
      abi: externalContracts[1].Vault.abi,
      address: externalContracts[1].Vault.address,
      functionName: 'deposit',
      args: [BigInt(depositAmount)],
    })
    setIsProcessModalOpen(true);
    setProgress(0);
    setStatusText("Depositing funds...");

    setTimeout(async () => {
      // setBalance(String(Number(balance) + Number(depositAmount)));
      setStatusText("Fetching trending tokens...");
      smoothIncrease(25);

      const symbols = fetchTrendingTokens();
      setHotTokens(symbols);
      setStatusText("Analyzing tokens...");
      smoothIncrease(50);

      setTimeout(async () => {
        setStatusText("Adding liquidity...");
        smoothIncrease(70);
        debugger
        const pool = findPoolByToken(symbols[0], pools);
        if (!pool) {
          setIsProcessModalOpen(false);
          return;
        }
        const params = addSignleLiquidityParams(depositAmount, pool);
        const tx = await writeVaultContractAsync({
          functionName: "addLiquidity",
          args: [params.groupA, params.groupB, params.amountsADesired, params.amountsBDesired, params.amountsAMin, params.amountsBMin, account.address, BigInt(Date.now() * 3600 * 1000)],
        });
        console.log("addLiquidity tx: ", tx);
        smoothIncrease(90);
        setTimeout(() => {
          smoothIncrease(100);
          setStatusText("Liquidity added successfully!");
        }, 1500);
      }, 2000);
    }, 2000);
    smoothIncrease(20);
    
    
    setDepositAmount("0");
  };

  // useScaffoldWatchContractEvent({
  //   contractName: "Vault",
  //   eventName: "Deposit",onLogs: logs => {
  //     debugger
  //     logs.map(log => {
  //       debugger
  //       const { user, amount } = log.args;
  //       console.log("📡 Deposit event", user, amount);
  //       setIsProcessModalOpen(true);
  //       setProgress(0);
  //       setTimeout(async () => {
  //         debugger
  //         setBalance(balance + Number(depositAmount));
  //         setStatusText("Fetching trending tokens...");
  //         smoothIncrease(50);
    
  //         const tokens = await fetchTrendingTokens();
  //         setHotTokens(tokens);
  //         setStatusText("Analyzing tokens...");
  //         smoothIncrease(75);
    
  //         setTimeout(() => {
  //           setStatusText("Adding liquidity...");
  //           smoothIncrease(90);
    
  //           setTimeout(() => {
  //             setStatusText("Liquidity added successfully!");
  //             smoothIncrease(100);
  //           }, 1500);
  //         }, 2000);
  //       }, 2000);
  //     });
  //   },
  // });

  // const {
  //   data: events,
  //   isLoading: isLoadingEvents,
  //   error: errorReadingEvents,
  // } = useScaffoldEventHistory({
  //   contractName: "Vault",
  //   eventName: "Deposit",
  //   fromBlock: 22150000n,
  //   watch: true,
  //   // filters: { greetingSetter: "0x9eB2C4866aAe575bC88d00DE5061d5063a1bb3aF" },
  //   blockData: true,
  //   transactionData: true,
  //   receiptData: true,
  // });
  // console.log("deposit events: ", events);

  async function getTrendingCoins() {
    try {
      const response = await axios.post(
        'https://sequencer-v2.heurist.xyz/mesh_request', 
        {
          agent_id: "CoinGeckoTokenInfoAgent",
          input: {
            tool: "get_trending_coins",
            raw_data_only: true,
          },
          api_key: "0x17f3938e50586af3d31a4de3264a7203e0008ffa-04b6d7f27798767"
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Trending Coins:', response.data);
      debugger
      return response.data;
    } catch (error) {
      console.error('Error fetching trending coins:', error);
    }
  }
  const fetchTrendingTokens = (): string[] => {
    // const resp = await fetchHeurist("get_trending_coins", "ElfaTwitterIntelligenceAgent");
    const resp = get_trending_coins;
    const symbols: string[] = resp.data.trending_coins.map(coin => coin.symbol);
    return symbols;
  };

  // 让进度条平滑增加
  const smoothIncrease = (target: number) => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= target) {
          clearInterval(interval);
          return target;
        }
        return prev + 5; // 每次增加 5%
      });
    }, 300);
  };

  const handleWithdraw = () => {
    if (Number(balance) >= 10) {
      setBalance(String(Number(balance) - 10)); // 假设每次取出 10
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-white pt-16">
      <div className="bg-gray-500 border-2 border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.6)] rounded-2xl p-6 w-96 text-center">
        <h2 className="text-2xl font-semibold mb-4">Vault</h2>
        <p className="text-lg mb-4">💰 Balance: $ <span className="font-bold">{balance}</span></p>
        
        <div className="flex space-x-4 justify-between">
          <button
            onClick={handleDeposit}
            className="px-6 py-2 bg-[#d4af37] text-gray-900 font-semibold rounded-lg transition duration-300 shadow-md hover:bg-[#b89730] hover:shadow-lg"
          >
            Deposit
          </button>
          <button
            onClick={handleWithdraw}
            className="px-6 py-2 bg-[#444] text-white font-semibold rounded-lg transition duration-300 shadow-md hover:bg-[#555] hover:shadow-lg"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* 存入金额输入弹窗 */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-gray-800 bg-opacity-90 text-white p-6 rounded-lg w-80">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
              onClick={() => setIsDepositModalOpen(false)}
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4">Enter Deposit Amount</h3>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full p-2 rounded-lg text-gray-900 bg-gray-300 focus:outline-none"
              placeholder="Enter amount"
            />
            <button
              onClick={confirmDeposit}
              className="mt-4 w-full px-6 py-2 bg-btn-vault-gold text-gray-900 font-semibold rounded-lg transition duration-300 shadow-md hover:bg-[#b89730] hover:shadow-lg"
            >
              Confirm
            </button>
          </div>
        </div>
      )}


      {/* 进度弹窗 */}
      {isProcessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-gray-800 bg-opacity-90 text-white p-6 rounded-lg w-1/2">
            {/* 右上角关闭按钮 */}
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
              onClick={() => setIsProcessModalOpen(false)}
            >
              ✖
            </button>

            <h3 className="text-xl font-bold mb-4">Processing...</h3>
            <p className="mb-4">{statusText}</p>

            {/* 进度条 */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              {progress == 100 ?
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-linear"
                  style={{ width: `${progress}%` }}
                ></div>
              :
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300 ease-linear"
                  style={{ width: `${progress}%` }}
                ></div>
              }
            </div>
            {/* <p className="text-right text-sm">{progress}%</p> */}

            {/* 热点 Token */}
            {hotTokens.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Trending Tokens:</h4>
                <ul className="list-disc list-inside text-yellow-400">
                  {hotTokens.map((token, index) => (
                    <li key={index}>{token}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    
  );
};

export default Vault;
