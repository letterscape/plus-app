"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash } from "lucide-react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useAccount, useReadContract, UseReadContractParameters, useReadContracts } from "wagmi";
import externalContracts from "~~/contracts/externalContracts";
import { SwapPoolABI } from "~~/components/swap/Abi";
import { getTokenByAddress } from "~~/components/swap/TokenSelector";
import Decimal from "decimal.js";

export type Pool = {
  logoXs: (string | undefined)[],
  symbolXs: (string | undefined)[],
  addressXs: (string | undefined)[],
  numXs: string[],
  logoYs: (string | undefined)[],
  symbolYs: (string | undefined)[],
  addressYs: (string | undefined)[],
  numYs: string[],
  tvl: string,
  apr: string,
  _1Dvol: string,
  _30Dvol: string,
}

const poolData: Pool[] = [
  {
    logoXs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png", "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png", "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"], 
    symbolXs: ["USDT", "ETH", "DAI"], 
    addressXs:[""], 
    numXs: [], 
    logoYs: ["https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110", "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg?1682922725"], 
    symbolYs: ["AAVE", "PEPE"], 
    addressYs:[""], 
    numYs:[], 
    tvl: "132.37M",
    apr: "10.35%", 
    _1Dvol: "1.3M",
    _30Dvol: "80.7M",
  },
  {
    logoXs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png", "https://assets.coingecko.com/coins/images/14962/thumb/6GxcPRo3_400x400.jpg?1619157413"], 
    symbolXs: ["WBTC", "ELON"], 
    addressXs:[""], 
    numXs: [], 
    logoYs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png", "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"], 
    symbolYs: ["MKR", "USDT"], 
    addressYs:[""], 
    numYs:[], 
    tvl: "35.81M",
    apr: "7.3%", 
    _1Dvol: "831.7K",
    _30Dvol: "89.5M",
  },
  {
    logoXs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png", "https://assets.coingecko.com/coins/images/14962/thumb/6GxcPRo3_400x400.jpg?1619157413"], 
    symbolXs: ["WBTC", "ELON"], 
    addressXs:[""], 
    numXs: [], 
    logoYs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png", "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"], 
    symbolYs: ["MKR", "USDT"], 
    addressYs:[""], 
    numYs:[], 
    tvl: "35.81M",
    apr: "7.3%", 
    _1Dvol: "831.7K",
    _30Dvol: "89.5M",
  },
  {
    logoXs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png", "https://assets.coingecko.com/coins/images/14962/thumb/6GxcPRo3_400x400.jpg?1619157413"], 
    symbolXs: ["WBTC", "ELON"], 
    addressXs:[""], 
    numXs: [], 
    logoYs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png", "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"], 
    symbolYs: ["MKR", "USDT"], 
    addressYs:[""], 
    numYs:[], 
    tvl: "35.81M",
    apr: "7.3%", 
    _1Dvol: "831.7K",
    _30Dvol: "89.5M",
  },
  {
    logoXs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png", "https://assets.coingecko.com/coins/images/14962/thumb/6GxcPRo3_400x400.jpg?1619157413"], 
    symbolXs: ["WBTC", "ELON"], 
    addressXs:[""], 
    numXs: [], 
    logoYs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png", "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"], 
    symbolYs: ["MKR", "USDT"], 
    addressYs:[""], 
    numYs:[], 
    tvl: "35.81M",
    apr: "7.3%", 
    _1Dvol: "831.7K",
    _30Dvol: "89.5M",
  },
  {
    logoXs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png", "https://assets.coingecko.com/coins/images/14962/thumb/6GxcPRo3_400x400.jpg?1619157413"], 
    symbolXs: ["WBTC", "ELON"], 
    addressXs:[""], 
    numXs: [], 
    logoYs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png", "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"], 
    symbolYs: ["MKR", "USDT"], 
    addressYs:[""], 
    numYs:[], 
    tvl: "35.81M",
    apr: "7.3%", 
    _1Dvol: "831.7K",
    _30Dvol: "89.5M",
  },
  {
    logoXs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png", "https://assets.coingecko.com/coins/images/14962/thumb/6GxcPRo3_400x400.jpg?1619157413"], 
    symbolXs: ["WBTC", "ELON"], 
    addressXs:[""], 
    numXs: [], 
    logoYs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png", "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"], 
    symbolYs: ["MKR", "USDT"], 
    addressYs:[""], 
    numYs:[], 
    tvl: "35.81M",
    apr: "7.3%", 
    _1Dvol: "831.7K",
    _30Dvol: "89.5M",
  },
  {
    logoXs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png", "https://assets.coingecko.com/coins/images/14962/thumb/6GxcPRo3_400x400.jpg?1619157413"], 
    symbolXs: ["WBTC", "ELON"], 
    addressXs:[""], 
    numXs: [], 
    logoYs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png", "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"], 
    symbolYs: ["MKR", "USDT"], 
    addressYs:[""], 
    numYs:[], 
    tvl: "35.81M",
    apr: "7.3%", 
    _1Dvol: "831.7K",
    _30Dvol: "89.5M",
  },
  {
    logoXs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png", "https://assets.coingecko.com/coins/images/14962/thumb/6GxcPRo3_400x400.jpg?1619157413"], 
    symbolXs: ["WBTC", "ELON"], 
    addressXs:[""], 
    numXs: [], 
    logoYs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png", "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"], 
    symbolYs: ["MKR", "USDT"], 
    addressYs:[""], 
    numYs:[], 
    tvl: "35.81M",
    apr: "7.3%", 
    _1Dvol: "831.7K",
    _30Dvol: "89.5M",
  },
  {
    logoXs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png", "https://assets.coingecko.com/coins/images/14962/thumb/6GxcPRo3_400x400.jpg?1619157413"], 
    symbolXs: ["WBTC", "ELON"], 
    addressXs:[""], 
    numXs: [], 
    logoYs: ["https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png", "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"], 
    symbolYs: ["MKR", "USDT"], 
    addressYs:[""], 
    numYs:[], 
    tvl: "35.81M",
    apr: "7.3%", 
    _1Dvol: "831.7K",
    _30Dvol: "89.5M",
  },
]

function processTokenInfo(groupX: string[], groupY: string[]): Pool | null {
  let tokenInfoXs = groupX.map(address => (getTokenByAddress(address)));
  let logoXs = tokenInfoXs.map(item => item?.logo);
  let symbolXs = tokenInfoXs.map(item => item?.symbol);
  let tokenInfoYs = groupY.map(address => (getTokenByAddress(address)));
  let logoYs = tokenInfoYs.map(item => item?.logo);
  let symbolYs = tokenInfoYs.map(item => item?.symbol);

  let pool = {
    logoXs: logoXs,
    symbolXs: symbolXs, 
    addressXs: groupX, 
    numXs: [], 
    logoYs: logoYs, 
    symbolYs: symbolYs, 
    addressYs:groupY, 
    numYs:[], 
    tvl: "35.81",
    apr: "7.3", 
    _1Dvol: "23.7",
    _30Dvol: "5.5",
  }
  return pool;
}

const LiquidityList = () => {
  const account = useAccount();
  const [pools, setPools] = useState<any[]>();
  const [groupX, setGroupX] = useState<any[]>();
  const [groupY, setGroupY] = useState<any[]>();
  const [groupXLengths, setGroupXLengths] = useState<any[]>();
  const [groupYLengths, setGroupYLengths] = useState<any[]>();
  const [poolInfos, setPoolInfos] = useState<Pool[]>();
  const [count, setCount] = useState<number>(0);
  
  const { data: poolsLength } = useScaffoldReadContract({
    contractName: "PoolFactory",
    functionName: "allPoolsLength",
  })
  useEffect(() => {
    console.log("Pools length updated:", poolsLength);
  }, [poolsLength])

  const allPoolsContracts: UseReadContractParameters[] = Array.from({ length: Number(poolsLength) }, (_, i) =>
    {
      return {
        abi: externalContracts[1].PoolFactory.abi,
        address: externalContracts[1].PoolFactory.address,
        functionName: 'allPools',
        args: [BigInt(i)],
        account: account.address
      } as const
    }
  );
  const allPools = useReadContracts({contracts: allPoolsContracts})
  // console.log("allPools: ", pools);
  useEffect(() => {
    if (allPools.data) {
      setPools(allPools.data);
    }
  }, [allPools])

  const groupXContracts: UseReadContractParameters[] = Array.from({ length: Number(poolsLength) }, (_, i) =>
    { 
      if (!pools || !pools[i]) return {}
      return {
        abi: SwapPoolABI,
        address: pools[i].result as string,
        functionName: 'getGroupX'
      } as const
    }
  );
  const groupXResult = useReadContracts({contracts: groupXContracts})
  // console.log("groupXResult: ", groupX);
  useEffect(() => {
    if (groupXResult.data) {
      setGroupX(groupXResult.data);
    }
  }, [groupXResult])

  const groupYContracts: UseReadContractParameters[] = Array.from({ length: Number(poolsLength) }, (_, i) =>
    { 
      if (!pools || !pools[i]) return {}
      return {
        abi: SwapPoolABI,
        address: pools[i].result as string,
        functionName: 'getGroupY'
      } as const
    }
  );
  const groupYResult = useReadContracts({contracts: groupYContracts})
  // console.log("groupYResult: ", groupY);
  useEffect(() => {
    if (groupYResult.data) {
      setGroupY(groupYResult.data);
    }
  }, [groupYResult])
  
  const groupXLengthContracts: UseReadContractParameters[] = Array.from({ length: Number(poolsLength) }, (_, i) =>
    { 
      if (!pools || !pools[i]) return {}
      return {
        abi: SwapPoolABI,
        address: pools[i].result as string,
        functionName: 'groupXLength'
      } as const
    }
  );
  const groupXLengthResult = useReadContracts({contracts: groupXLengthContracts})
  // console.log("groupXLengthResult: ", groupXLengths);
  useEffect(() => {
    if (groupXLengthResult.data) {
      setGroupXLengths(groupXLengthResult.data);
    }
  }, [groupXLengthResult])

  const groupYLengthContracts: UseReadContractParameters[] = Array.from({ length: Number(poolsLength) }, (_, i) =>
    { 
      if (!pools || !pools[i]) return {}
      return {
        abi: SwapPoolABI,
        address: pools[i].result as string,
        functionName: 'groupYLength'
      } as const
    }
  );
  const groupYLengthResult = useReadContracts({contracts: groupYLengthContracts})
  // console.log("groupYLengthResult: ", groupYLengths);
  useEffect(() => {
    if (groupYLengthResult.data) {
      setGroupYLengths(groupYLengthResult.data);
    }
  }, [groupYLengthResult])

  const getPoolInfos = useMemo(() => {
    if (!pools || !groupX || !groupY) return;
    let poolArr: Pool[] = [];
    for (let i = 0; i < pools.length; i++) {
      let pool = processTokenInfo(groupX[i].result, groupY[i].result);
      console.log("pool info: ", pool);
      if (!pool) continue;
      poolArr.push(pool);
    }
    setCount(count+1);
    console.log("count: ", count);
    return poolArr;
  }, [groupX, groupY])

  useEffect(() => {
    console.log("useEffect count: ", count);
    let pools = getPoolInfos;
    setPoolInfos(pools);
    localStorage.setItem("pools", JSON.stringify(pools));
    console.log("poolInfos: ", pools);
  }, [count])

  return (
    <>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table table-pin-rows table-pin-cols">
          {/* head */}
          <thead className="bg-gray-500">
            <tr>
              <th>Pool</th>
              <th>TVL</th>
              <th>APR</th>
              <th>1Dvol</th>
              <th>30Dvol</th>
            </tr>
          </thead>
          <tbody>
            {poolInfos && poolInfos.map((item, index) => (
              <tr key={index}>
                <td>
                  <div className="grid grid-cols-4 gap-4 w-4/5">
                    <div className="flex items-center">
                      {item.logoXs.map((logo, idx) => (
                        <img 
                          className="w-8 h-8 rounded-full border-2 border-white -ml-4 first:ml-0"
                          key={idx}
                          alt={`Avatar ${idx}`}
                          src={logo}/>
                      ))}
                    </div>
                    <div className="flex col-span-3">
                      {item.symbolXs.join(' / ')}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 w-4/5">
                    <div className="flex items-center">
                      {item.logoYs.map((logo, idx) => (
                        <img 
                          className="w-8 h-8 rounded-full border-2 border-white -ml-4 first:ml-0"
                          key={idx}
                          alt={`Avatar ${idx}`}
                          src={logo}/>
                      ))}
                    </div>
                    <div className="flex col-span-3">
                      {item.symbolYs.join(' / ')}
                    </div>
                  </div>
                </td>
                <td>${Decimal(item.tvl).mul(index + 1).toString()}M</td>
                <td>{Decimal(item.apr).add(Decimal(index).mul(0.7)).toString()}%</td>
                <td>${Decimal(item._1Dvol).mul(index + 1).toString()}K</td>
                <td>${Decimal(item._30Dvol).mul(index + 1).toString()}M</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default LiquidityList;