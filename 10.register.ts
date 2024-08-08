import { Web3 } from "web3";
import { ZkSyncPlugin } from "web3-plugin-zksync";

async function main() {
  const web3: Web3 = new Web3("http://localhost:8545/");
  console.log("L1 block number:", await web3.eth.getBlockNumber());
  web3.registerPlugin(new ZkSyncPlugin("http://localhost:3050/"));

  const zksync: ZkSyncPlugin = web3.zkSync;
  console.log("L2 contract addresses:", await zksync.ContractsAddresses);
}

main()
  .then(() => console.log("✅ Script executed successfully"))
  .catch((error) => console.error(`❌ Error executing script: ${error}`));
