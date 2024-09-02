import { OnChainAIVariable } from "./OnChainAIVariable";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const AIDatas = ({
  deployedContractData,
  refreshVariables,
  waitingResponse,
}: {
  deployedContractData: Contract<ContractName>;
  refreshVariables: number;
  waitingResponse: boolean;
}) => {
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
          refresh={refreshVariables}
          loading={waitingResponse}
        />
      </article>
    </>
  );
};
