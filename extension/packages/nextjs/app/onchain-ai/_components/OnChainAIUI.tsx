"use client";

import { useEffect, useState } from "react";
import { AIDatas } from "./AIDatas";
import { PromptInput } from "./PromptInput";
import { TransactionReceipt, formatEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { TxReceipt } from "~~/app/debug/_components/contract";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { ContractName } from "~~/utils/scaffold-eth/contract";

export const OnChainAIUI = ({}) => {
  const contractName = "OnChainAI";
  const txValue = "2000000000000000";

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(
    contractName as ContractName,
  );
  const { targetNetwork } = useTargetNetwork();
  const networkColor = useNetworkColor();
  const { address, chain } = useAccount();

  const writeDisabled = !chain || chain?.id !== targetNetwork.id;

  ///////////////////////
  const writeTxn = useTransactor();
  const { data: result, isPending, writeContractAsync } = useWriteContract();

  ///////////////////////
  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  const { data: txResult } = useWaitForTransactionReceipt({
    hash: result,
  });

  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  ////////////////////////
  const [inputPrompt, setInputPrompt] = useState("");
  const value = inputPrompt;
  const onChange = (value: any) => {
    setInputPrompt(value);
  };

  const [loading, setLoading] = useState(false);

  const resetPrompt = () => {
    setInputPrompt("");
  };

  ///////////////////////////
  const [refreshVariables, setRefreshVariables] = useState(0);
  const [waitingResponse, setWaitingResponse] = useState(false);

  ///////////////////////////
  const sendRequest = async () => {
    if (!inputPrompt || !address) return;

    setLoading(true);

    if (writeContractAsync && deployedContractData) {
      try {
        const makeWriteWithParams = () =>
          writeContractAsync({
            address: deployedContractData.address,
            functionName: "sendRequest",
            abi: deployedContractData.abi,
            args: [inputPrompt],
            value: BigInt(txValue),
          });
        await writeTxn(makeWriteWithParams);

        resetPrompt();
        setWaitingResponse(true);
        setRefreshVariables(refreshVariables + 1);
      } catch (e: any) {
        console.error("⚡️ ~ file: PromptInput.tsx:sendRequest ~ error", e);
      }
    }

    setLoading(false);
  };

  ///////////////////////
  const onLogs = (logs: any) => {
    console.info("onLogs ~ EventLogs:", logs);
    setWaitingResponse(false);
    setRefreshVariables(refreshVariables + 1);
  };

  useScaffoldWatchContractEvent({ contractName, eventName: "Response", onLogs });

  ///////////////////////

  if (deployedContractLoading) {
    return (
      <div className="mt-14">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!deployedContractData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${contractName}" on chain "${targetNetwork.name}"!`}
      </p>
    );
  }

  return (
    <>
      <div className="w-full px-8 flex items-center justify-center">
        <AIDatas
          deployedContractData={deployedContractData}
          refreshVariables={refreshVariables}
          waitingResponse={waitingResponse}
        />
      </div>
      <div className="flex-grow bg-base-300 w-full mt-6 px-8 py-12">
        <div className="w-full flex justify-center items-center">
          <article className="bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 py-4 w-min-272 max-w-xl w-full">
            <header className="mb-5 text-center">
              <p className="text-primary font-medium my-0 break-words">Enter your Prompt</p>
              <p className="text-xs font-light my-0 mb-2 break-words">
                Keep it simple to achieve ChainLink consensus (transaction cost: {formatEther(BigInt(txValue))} ETH)
              </p>
            </header>
            <PromptInput
              inputPrompt={inputPrompt}
              value={value}
              onChange={onChange}
              disabled={isPending}
              resetPrompt={resetPrompt}
            />
            <div className="flex justify-between gap-2 mt-3">
              <div className="flex-grow basis-0">
                {displayedTxResult ? <TxReceipt txResult={displayedTxResult} /> : null}
              </div>
              <div
                className={`flex ${
                  (writeDisabled || !address) &&
                  "tooltip tooltip-top tooltip-secondary before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
                }`}
                data-tip={`${(writeDisabled || !address) && "Wallet not connected or in the wrong network"}`}
              >
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={!inputPrompt || !address || isPending || loading}
                  onClick={sendRequest}
                >
                  {isPending && <span className="loading loading-spinner loading-xs"></span>}
                  Send 💸
                </button>
              </div>
            </div>
          </article>
        </div>

        <div className="min-[900px]:fixed top-24 left-8 bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 space-y-1 py-4 max-w-xl mx-auto">
          <div className="flex">
            <div className="flex flex-col gap-1">
              <span className="font-bold">{contractName}</span>
              <Address address={deployedContractData.address} />
              <div className="flex gap-1 items-center">
                <span className="font-bold text-sm">Balance:</span>
                <Balance address={deployedContractData.address} className="px-0 h-1.5 min-h-[0.375rem]" />
              </div>
            </div>
          </div>
          {targetNetwork && (
            <p className="my-0 text-sm">
              <span className="font-bold">Network</span>:{" "}
              <span style={{ color: networkColor }}>{targetNetwork.name}</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
};
