import { useEffect } from "react";
import { ContractFunctionName } from "viem";
import { useReadContract } from "wagmi";
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

  const {
    data: result,
    isFetching,
    refetch,
    error,
  } = useReadContract({
    address: deployedContractData?.address,
    functionName: abiFunction as ContractFunctionName<typeof deployedContractData.abi, "pure" | "view">,
    abi: deployedContractData?.abi,
    chainId: targetNetwork.id,
    query: {
      retry: false,
    },
  });

  useEffect(() => {
    refetch();
  }, [refresh, refetch]);

  if (!error) {
    return (
      <>
        <div className="mb-2">
          <p className="font-medium my-0 break-words">{label}</p>
          {isFetching || loading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <>
              <code className="my-0 break-words">{result || "No entry"}</code>
            </>
          )}
        </div>
      </>
    );
  }
};
