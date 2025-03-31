import { StatDisplay } from "./StatDisplay";
import { formatUnits } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const AggregatorV3Consumer: React.FC = () => {
  const contractName = "PriceConsumerV3";
  const decimals = 8;

  const { data: contract } = useScaffoldContract({ contractName });

  const { data: latestPrice } = useScaffoldReadContract({
    contractName,
    functionName: "getLatestPrice",
  });

  const formattedPrice =
    latestPrice && decimals ? "$" + parseFloat(formatUnits(latestPrice, decimals)).toFixed(2) : "N/A";

  return (
    <div className="max-w-lg mx-auto ">
      <div className="flex flex-col bg-base-100 px-6 py-4 text-center items-center rounded-3xl">
        <h2 className="text-2xl font-bold">{contractName}</h2>

        <Address address={contract?.address} />
        <p className="text-xl">The latest round data returned by ETH/USD price feed contract</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <StatDisplay title="ETH/USD Price" value={formattedPrice} />
        </div>
      </div>
    </div>
  );
};

export default AggregatorV3Consumer;
