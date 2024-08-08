import { Web3 } from "web3";
import { ZkSyncPlugin, ZKSyncWallet } from "web3-plugin-zksync";

async function main() {
  const web3: Web3 = new Web3("http://localhost:3050/");
  web3.registerPlugin(new ZkSyncPlugin("http://localhost:3051/"));
  const zksync: ZkSyncPlugin = web3.zkSync;

  const PRIVATE_KEY: string = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
  const wallet: ZKSyncWallet = new zksync.ZkWallet(PRIVATE_KEY);

  console.log("Base Cost (Gas Limit 100,000):", await wallet.getBaseCost({ gasLimit: 100_000 }));

  // Error executing script: AbiError: Parameter decoding error: Returned values aren't valid,
  // did it run Out of Gas? You might also see this error if you are not using the correct ABI
  // for the contract you are retrieving data from, requesting data from a block number that
  // does not exist, or querying a node which is not fully synced.
}

main()
  .then(() => console.log("Script executed successfully"))
  .catch((error) => console.error(`Error executing script: ${error}`));
