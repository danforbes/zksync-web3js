import { TransactionReceipt, utils, Web3 } from "web3";
import { ZkSyncPlugin, ZKSyncWallet } from "web3-plugin-zksync";
import { PriorityOpResponse } from "web3-plugin-zksync/lib/types";

async function main() {
  const web3: Web3 = new Web3("http://localhost:8545/");
  web3.registerPlugin(new ZkSyncPlugin("http://localhost:3050/"));
  const zksync: ZkSyncPlugin = web3.zkSync;

  const PRIVATE_KEY: string =
    "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
  const wallet: ZKSyncWallet = new zksync.ZkWallet(PRIVATE_KEY);
  const l1BeginningBalance: bigint = await wallet.getBalanceL1();
  const l2BeginningBalance: bigint = await wallet.getBalance();

  const tx: PriorityOpResponse = await wallet.requestExecute({
    contractAddress: await zksync.L2.getBridgehubContractAddress(),
    calldata: "0x",
    l2Value: utils.toWei("0.00020", "ether"),
    l2GasLimit: 900_000,
  });

  const receipt: TransactionReceipt = await tx.waitFinalize();
  console.log("Transaction Hash:", receipt.transactionHash);

  console.log(
    "Change In L1 Balance:",
    l1BeginningBalance - (await wallet.getBalanceL1()),
  );
  console.log(
    "Change In L2 Balance:",
    l2BeginningBalance - (await wallet.getBalance()),
  );
}

main()
  .then(() => console.log("✅ Script executed successfully"))
  .catch((error) => console.error(`❌ Error executing script: ${error}`));
