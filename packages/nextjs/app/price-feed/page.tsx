"use client";

import AggregatorV3Consumer from "./_components/AggregatorV3Consumer";
import FeedRegistry from "./_components/FeedRegistry";
import type { NextPage } from "next";
import GettingStarted from "~~/components/chainlink/GettingStarted";

const PriceFeedPage: NextPage = () => {
  return (
    <div className="flex justify-center pt-10">
      <div className="w-full max-w-screen-lg p-10">
        <h1 className="text-3xl font-bold text-center mb-8">📈 Price Feed</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="col-span-1 h-full">
            <div className="bg-base-100 p-6 rounded-3xl shadow-lg h-full">
              <AggregatorV3Consumer />
            </div>
          </div>
          <div className="col-span-1 h-full">
            <div className="bg-base-100 p-6 rounded-3xl shadow-lg h-full">
              <FeedRegistry />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-base-100 p-6 rounded-3xl shadow-lg">
              <GettingStarted
                introduction={
                  <>
                    Chainlink Data Feeds provide reliable, tamper-proof inputs for smart contracts, delivering off-chain
                    data such as asset prices directly to on-chain applications. The{" "}
                    <span className="font-bold">AggregatorV3Interface</span> is used to interact with these price feeds,
                    allowing your smart contracts to fetch the latest price data from a decentralized network of
                    oracles.
                  </>
                }
                steps={
                  <>
                    <li>
                      Start by importing the <span className="font-bold">AggregatorV3Interface</span> into your smart
                      contract. This interface allows you to easily integrate Chainlink price feeds.
                    </li>
                    <li>
                      Declare a state variable of type <span className="font-bold">AggregatorV3Interface</span> to
                      represent the price feed in your smart contract.
                    </li>
                    <li>
                      Identify the correct price feed address for your desired asset pair and network from the{" "}
                      <a className="link" href="https://docs.chain.link/data-feeds/price-feeds/addresses">
                        official Chainlink CCIP documentation.
                      </a>{" "}
                      . Use this address to initialize the price feed in your contract.
                    </li>
                    <li>
                      Use the <span className="font-bold">latestRoundData</span> function of the{" "}
                      <span className="font-bold">AggregatorV3Interface</span> to retrieve the most recent price, round
                      ID, timestamp, and other relevant data.
                    </li>
                  </>
                }
                details={
                  <>
                    <li>
                      Price feeds are updated based on two conditions: either when the price changes significantly
                      beyond a defined threshold or after a specific time interval, ensuring that your application
                      always has access to the most accurate and timely data.
                    </li>
                    <li>
                      The data returned from the price feed is denominated with a fixed number of decimals, which can
                      vary by feed. Ensure your contract handles these decimals correctly when performing calculations.
                    </li>
                    <li>
                      For applications requiring multiple price feeds, consider using the{" "}
                      <span className="font-bold">FeedRegistry</span>, which provides a unified interface to access
                      multiple price feeds across different asset pairs and networks.
                    </li>
                    <li>
                      For more information and advanced usage, refer to the{" "}
                      <a className="link" href="https://docs.chain.link/data-feeds/getting-started">
                        Chainlink Data Feeds Getting Started guide
                      </a>{" "}
                      .
                    </li>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceFeedPage;
