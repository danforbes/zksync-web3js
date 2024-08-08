import { Web3 } from "web3";
import { ZkSyncPlugin, ZKSyncWallet } from "web3-plugin-zksync";

async function main() {
  const web3: Web3 = new Web3("http://localhost:8545/");
  web3.registerPlugin(new ZkSyncPlugin("http://localhost:3050/"));
  const zksync: ZkSyncPlugin = web3.zkSync;

  const PRIVATE_KEY: string =
    "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
  const wallet: ZKSyncWallet = new zksync.ZkWallet(PRIVATE_KEY);

  console.log("L1 Balance:", await wallet.getBalanceL1());
  console.log("L2 Balance:", await wallet.getBalance());
}

main()
  .then(() => console.log("✅ Script executed successfully"))
  .catch((error) => console.error(`❌ Error executing script: ${error}`));
