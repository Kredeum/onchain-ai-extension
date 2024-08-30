import { onChainScope } from "./scope";
import { readConfig, writeConfig } from "../lib/utils";
import { OnChainAI } from "../../typechain-types";
import AbiOnChainAI from "../abis/OnChainAI.json";
import { types } from "hardhat/config";

onChainScope
  .task("config", "Display [and update] OnChainAI config")
  .addOptionalParam("donid", "Chainlink DON Id", undefined, types.int)
  .addOptionalParam("subid", "Chainlink Subscription Id", undefined, types.int)
  .addOptionalParam("router", "Chainlink routeur address", undefined, types.string)
  .addOptionalParam("explorer", "Chain explorer url", undefined, types.string)
  .addOptionalParam("chainname", "Chain name", undefined, types.string)
  .addOptionalParam("rpc", "Base Rpc url", undefined, types.string)
  .setAction(async (taskArgs, hre) => {
    const chainId = await hre.getChainId();
    const config = readConfig(chainId);
    console.log("chainId", chainId);
    console.log(config);

    const [signer] = await hre.ethers.getSigners();
    const onChainAI = (await hre.ethers.getContractAt(AbiOnChainAI, config.onChainAI, signer)) as unknown as OnChainAI;

    let update = false;

    // onchain config
    if (taskArgs.donid) {
      if (taskArgs.donid != (await onChainAI.donId())) {
        const tx = await onChainAI.setDonID(taskArgs.donid);
        console.log("OnChainAI setDonID Request", taskArgs.donid, `${config.explorer}/tx/${tx.hash}`);
        const res = await tx.wait();
        console.log("OnChainAI setDonID Result", res?.status || "no status");
      }
      writeConfig(chainId, "donId", taskArgs.donid);
      update = true;
    }
    if (taskArgs.subid) {
      if (taskArgs.subid != (await onChainAI.subscriptionId())) {
        const tx = await onChainAI.setSubscriptionId(taskArgs.donid);
        console.log("OnChainAI setSubscriptionId Request", taskArgs.subid, `${config.explorer}/tx/${tx.hash}`);
        const res = await tx.wait();
        console.log("OnChainAI setSubscriptionId Result", res?.status || "no status");
      }
      writeConfig(chainId, "subscriptionId", taskArgs.subid);
      update = true;
    }
    if (taskArgs.router) {
      if (config.onChainAI) console.error("Cannot update router after deployment, must redeploy");
      writeConfig(chainId, "router", taskArgs.router);
      update = true;
    }

    // offchain config
    if (taskArgs.explorer) {
      writeConfig(chainId, "explorer", taskArgs.explorer);
      update = true;
    }
    if (taskArgs.chainname) {
      writeConfig(chainId, "chainName", taskArgs.chainname);
      update = true;
    }
    if (taskArgs.rpc) {
      writeConfig(chainId, "rpc", taskArgs.rpc);
      update = true;
    }

    if (update) console.log(readConfig(chainId));
  });
