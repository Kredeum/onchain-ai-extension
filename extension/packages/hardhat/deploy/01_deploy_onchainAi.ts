import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { readJavascript, readConfig, writeConfig } from "../chainlink/lib/utils";

const deployOnChainAI: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const chainId = await hre.getChainId();
  const { router, subscriptionId, donId, explorer } = readConfig(chainId);

  const donIdHex = hre.ethers.encodeBytes32String(donId);
  const gasLimit = 300000;
  const javascript = readJavascript("OnChainAI.js");

  const deployResult = await deploy("OnChainAI", {
    from: deployer,
    args: [router, javascript, subscriptionId, gasLimit, donIdHex],
    log: true,
    autoMine: true,
  });

  // if (deployResult.newlyDeployed)
  {
    writeConfig(chainId, "onChainAI", deployResult.address);

    const routerAbi = ["function addConsumer(uint64,address) external"];
    const [signer] = await hre.ethers.getSigners();
    const routerContract = await hre.ethers.getContractAt(routerAbi, router, signer);

    const tx = await routerContract.addConsumer(subscriptionId, deployResult.address);
    console.log("Add Chainlink consumer Request", deployResult.address, `${explorer}/tx/${tx.hash}`);
    const res = await tx.wait();
    console.log("Add Chainlink consumer Result", res?.status || "no status");
  }
};

export default deployOnChainAI;

deployOnChainAI.tags = ["OnChainAI"];
