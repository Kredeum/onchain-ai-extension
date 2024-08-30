import { OnChainAI } from "../../typechain-types";
import { onChainScope } from "./scope";
import AbiOnChainAI from "../abis/OnChainAI.json";
import { readConfig } from "../lib/utils";
import { types } from "hardhat/config";

onChainScope
  .task("request", "Read last OnChainAI response [and send OnChainAI request]")
  .addOptionalParam("prompt", "OpenAI prompt request for Chainlink", undefined, types.string)
  .setAction(async (taskArgs, hre) => {
    const chainId = await hre.getChainId();
    const config = readConfig(chainId);
    console.log("chainId", chainId);

    const [signer] = await hre.ethers.getSigners();
    const onChainAI = (await hre.ethers.getContractAt(AbiOnChainAI, config.onChainAI, signer)) as unknown as OnChainAI;

    console.log(`lastUserPrompt '${await onChainAI.lastUserPrompt()}'`);
    console.log(`lastResponse   '${await onChainAI.lastResponse()}'`);
    console.log(`lastError      '${await onChainAI.lastError()}'`);

    if (taskArgs.prompt) {
      const tx = await onChainAI.sendRequest(taskArgs.prompt, { value: 2_000_000_000_000_000 });
      console.log("OnChainAI Request", `'${taskArgs.prompt}'`, `${config.explorer}/tx/${tx.hash}`);
      const res = await tx.wait();
      console.log("OnChainAI Result", res?.status || "no status");
    }
  });
