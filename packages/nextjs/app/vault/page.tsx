'use client'

import { useState } from "react";

const Vault = () => {
  const [balance, setBalance] = useState(100); // 初始余额 100
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Waiting for deposit...");
  const [hotTokens, setHotTokens] = useState<string[]>([]);


  const handleDeposit = async () => {
    setIsDepositModalOpen(true);
  };

  const confirmDeposit = () => {
    setHotTokens([]);
    setIsDepositModalOpen(false);
    setIsProcessModalOpen(true);
    setProgress(0);
    setStatusText("Depositing funds...");
    smoothIncrease(20);

    setTimeout(async () => {
      setBalance(balance + Number(depositAmount));
      setStatusText("Fetching trending tokens...");
      smoothIncrease(50);

      const tokens = await fetchTrendingTokens();
      setHotTokens(tokens);
      setStatusText("Analyzing tokens...");
      smoothIncrease(75);

      setTimeout(() => {
        setStatusText("Adding liquidity...");
        smoothIncrease(90);

        setTimeout(() => {
          setStatusText("Liquidity added successfully!");
          smoothIncrease(100);
        }, 1500);
      }, 2000);
    }, 2000);
    setDepositAmount("0");
  };

  const fetchTrendingTokens = async (): Promise<string[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(["$ETH", "$BTC", "$SOL", "$DOGE"]), 2000)
    );
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
    if (balance >= 10) {
      setBalance(balance - 10); // 假设每次取出 10
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
