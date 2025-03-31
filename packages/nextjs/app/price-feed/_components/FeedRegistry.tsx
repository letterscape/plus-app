"use client";

import { useEffect, useState } from "react";
import { StatDisplay } from "./StatDisplay";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import externalContracts from "~~/contracts/externalContracts";
import { tokenAddresses } from "~~/utils/chainlink/networks";

const FeedRegistry: React.FC = () => {
  const contractName = "FeedRegistry";
  const chainId = 1; // Ethereum Mainnet
  const chainName = "Ethereum";
  const feedRegistryContract = externalContracts[chainId]?.FeedRegistry;

  const [baseAsset, setBaseAsset] = useState<string>("LINK");
  const [quoteAsset, setQuoteAsset] = useState<string>("USD");

  const availableTokens = tokenAddresses[chainName]?.assets;

  const baseAssetAddress = availableTokens[baseAsset] || "";
  const quoteAssetAddress = availableTokens[quoteAsset] || "";

  const { data: description, isError: isDescriptionError } = useReadContract({
    address: feedRegistryContract?.address,
    abi: feedRegistryContract?.abi,
    functionName: "description",
    args: [baseAssetAddress, quoteAssetAddress],
    chainId,
  });

  const { data: roundData, isError: isRoundDataError } = useReadContract({
    address: feedRegistryContract?.address,
    abi: feedRegistryContract?.abi,
    functionName: "latestRoundData",
    args: [baseAssetAddress, quoteAssetAddress],
    chainId,
  });

  const { data: decimals, isError: isDecimalsError } = useReadContract({
    address: feedRegistryContract?.address,
    abi: feedRegistryContract?.abi,
    functionName: "decimals",
    args: [baseAssetAddress, quoteAssetAddress],
    chainId,
  });

  useEffect(() => {
    console.log("description:", description);
    console.log("roundData:", roundData);
    console.log("decimals:", decimals);
  }, [description, roundData, decimals]);

  const formattedRoundData = roundData && decimals ? parseFloat(formatUnits(roundData[1], decimals)).toFixed(2) : "N/A";
  // const formattedRoundData = "N/A";

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex flex-col bg-base-100 px-6 py-4 text-center items-center rounded-3xl">
        <h2 className="text-2xl font-bold">{contractName}</h2>
        <Address address={feedRegistryContract?.address} />

        <div className="w-full mb-4">
          <label className="font-bold text-sm">Base Asset:</label>
          <select
            onChange={e => setBaseAsset(e.target.value)}
            className="input input-bordered w-full mt-2"
            value={baseAsset}
          >
            {Object.keys(availableTokens || {}).map(asset => (
              <option key={asset} value={asset}>
                {asset}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full mb-4">
          <label className="font-bold text-sm">Quote Asset:</label>
          <select
            onChange={e => setQuoteAsset(e.target.value)}
            className="input input-bordered w-full mt-2"
            value={quoteAsset}
          >
            {Object.keys(availableTokens || {}).map(asset => (
              <option key={asset} value={asset}>
                {asset}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          {isDescriptionError || isRoundDataError || isDecimalsError ? (
            <p className="text-red-500">Error fetching data. Please check the asset pairs and try again.</p>
          ) : (
            <>
              <StatDisplay title={`${baseAsset}/${quoteAsset} Price`} value={formattedRoundData || "Loading..."} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedRegistry;
