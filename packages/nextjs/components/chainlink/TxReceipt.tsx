export const TxReceipt = ({ txHash }: { txHash: string | null }) => {
  return (
    <div>
      {txHash ? (
        <div className=" items-center text-sm rounded-lg bg-secondary py-3 px-4 ">
          <div>Transaction success:</div>
          <a
            href={`https://ccip.chain.link/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View on Chainlink CCIP Explorer
          </a>
        </div>
      ) : null}
    </div>
  );
};
