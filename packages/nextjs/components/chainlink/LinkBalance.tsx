"use client";

import { Address, formatEther } from "viem";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import { chainlinkAddresses } from "~~/utils/chainlink/networks";

type BalanceProps = {
  address?: Address;
  className?: string;
};

/**
 * Display LINK balance of an ETH address.
 */
export const LinkBalance = ({ address }: BalanceProps) => {
  const { targetNetwork } = useTargetNetwork();

  const linkTokenAddress =
    targetNetwork?.name && chainlinkAddresses[targetNetwork.name] ? chainlinkAddresses[targetNetwork.name].link : null;

  const {
    data: balance,
    isError,
    isLoading,
  } = useWatchBalance({
    address,
    token: linkTokenAddress!,
  });

  if (!address || isLoading || balance === null) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer`}>
        <div className="text-warning">Error</div>
      </div>
    );
  }

  const formattedBalance = balance ? Number(formatEther(balance.value)) : 0;

  return (
    <div>
      <div className="flex gap-1 items-center ">
        <span className="font-bold text-xs">Balance:</span>

        <div className="w-full text-s flex items-center justify-center">
          <>
            <span>{formattedBalance.toFixed(4)}</span>
            <span className="text-xs font-bold ml-1">LINK</span>
          </>
        </div>
      </div>
      <a
        href="https://faucets.chain.link"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-xs text-blue-500 underline block"
      >
        Chainlink Faucet
      </a>
    </div>
  );
};
