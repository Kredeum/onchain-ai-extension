import { useEffect, useState } from "react";
import { ContractFunctionName } from "viem";
import { useReadContract } from "wagmi";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const OnChainAIVariable = ({
  deployedContractData,
  abiFunction,
  label,
  refresh,
  loading,
}: {
  deployedContractData: Contract<ContractName>;
  abiFunction: string;
  label: string;
  refresh: number;
  loading: boolean;
}) => {
  const { targetNetwork } = useTargetNetwork();

  const [readResult, setReadResult] = useState("");
  const [isError, setIsError] = useState(false);

  const {
    data: result,
    isFetching,
    refetch,
    error: errorFetching,
  } = useReadContract({
    address: deployedContractData?.address,
    functionName: abiFunction as ContractFunctionName<typeof deployedContractData.abi, "pure" | "view">,
    abi: deployedContractData?.abi,
    chainId: targetNetwork.id,
    query: {
      retry: false,
    },
  });

  const {
    data: lastErrorResult,
    isFetching: isFetchingLastError,
    refetch: refetchLastError,
    error: errorFetchLastErr,
  } = useReadContract({
    address: deployedContractData?.address,
    functionName: "lastError",
    abi: deployedContractData?.abi,
    chainId: targetNetwork.id,
    query: {
      retry: false,
    },
  });

  useEffect(() => {
    setIsError(false);

    if (errorFetching) {
      setReadResult("Read contract ERROR");
      setIsError(true);
    } else {
      setReadResult(result?.toString() || "No entry");
      if (result?.toString().startsWith("ERROR")) setIsError(true);

      if (!result && abiFunction == "lastResponse") {
        if (errorFetchLastErr || lastErrorResult) setIsError(true);
        if (errorFetchLastErr) setReadResult("ERROR fetching lastError");
        if (lastErrorResult) setReadResult(lastErrorResult);
      }
    }
  }, [abiFunction, result, lastErrorResult, errorFetching, errorFetchLastErr]);

  const refreshAll = async () => {
    await refetch();
    await refetchLastError();
  };

  useEffect(() => {
    refetch();
    refetchLastError();
  }, [refresh, refetch, refetchLastError]);

  return (
    <>
      <div className="mb-2">
        <p className="text-primary font-medium my-0 break-words">
          {label}
          {!loading && isError && !isFetching && !isFetchingLastError && (
            <>
              <span className="text-error text-xs"> ( Error )</span>{" "}
              {(errorFetching || errorFetchLastErr) && (
                <button className="btn btn-error btn-xs px-1 py-0 text-xs" onClick={() => refreshAll()}>
                  <ArrowPathIcon className="h-3 w-3 cursor-pointer" aria-hidden="true" />
                </button>
              )}
            </>
          )}
        </p>
        {isFetching || isFetchingLastError || loading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <>
            <code className={`${isError && "text-red-500"} my-0 break-words`}>{readResult}</code>
          </>
        )}
      </div>
    </>
  );
};
