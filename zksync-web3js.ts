import { Web3 } from "web3";
import {
  types,
  Web3ZkSyncL1,
  Web3ZkSyncL2,
  ZkSyncPlugin,
  ZKSyncWallet,
} from "web3-plugin-zksync";

async function main() {
  const web3 = new Web3(
    "https://eth-sepolia.g.alchemy.com/v2/VCOFgnRGJF_vdAY2ZjgSksL6-6pYvRkz",
  );
  web3.registerPlugin(new ZkSyncPlugin("https://sepolia.era.zksync.dev"));

  console.log(web3.zkSync);
}

main()
  .then(() => console.log("Script executed successfully"))
  .catch((error) => console.error(`Error executing script: ${error}`));
