import { OnChainAIUI } from "./_components/OnChainAIUI";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "On Chain send AI request",
  description: "Prompt your request and send it on chain using ChainLink",
});

const OnChainAI: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 min-w-[320px]">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">OnChainAI</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Interact onchain with OpenAI GPT4o-mini</p>
          </div>
        </div>
        <OnChainAIUI />
      </div>
    </>
  );
};

export default OnChainAI;
