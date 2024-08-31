import { useEffect, useState } from "react";
import { OnChainAIVariable } from "./OnChainAIVariable";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const AIDatas = ({
  contractName,
  deployedContractData,
  refreshVariables,
}: {
  contractName: ContractName;
  deployedContractData: Contract<ContractName>;
  refreshVariables: number;
}) => {
  const [loading, setLoading] = useState(false);
  const [refreshResponse, setRefreshResponse] = useState(0);

  ///////////////////////
  const onLogs = (logs: any) => {
    console.info("onLogs ~ EventLogs:", logs);
    setLoading(false);
    setRefreshResponse(refreshResponse + 1);
  };

  useScaffoldWatchContractEvent({ contractName, eventName: "Response", onLogs });

  ///////////////////////
  useEffect(() => {
    if (refreshVariables > 0) {
      setLoading(true);
    }
  }, [refreshVariables]);

  return (
    <>
      <article className="bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-2 mt-8 space-y-1 py-4 w-min-272 max-w-xl w-full">
        <OnChainAIVariable
          deployedContractData={deployedContractData}
          abiFunction={"lastUserPrompt"}
          label={"Last Prompt"}
          refresh={refreshVariables}
          loading={false}
        />

        <OnChainAIVariable
          deployedContractData={deployedContractData}
          abiFunction={"lastResponse"}
          label={"Last Response"}
          refresh={refreshResponse}
          loading={loading}
        />
      </article>
    </>
  );
};
