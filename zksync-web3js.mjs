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
  web3.registerPlugin(new ZkSyncPlugin());

  const l1Provider = new Web3ZkSyncL1(
    "https://eth-sepolia.g.alchemy.com/v2/VCOFgnRGJF_vdAY2ZjgSksL6-6pYvRkz",
  );
  const l2Provider = new Web3ZkSyncL2(types.Network.Sepolia);
  const wallet = new ZKSyncWallet(
    "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110",
    l2Provider,
    l1Provider,
  );

  console.log(wallet.account.privateKey);
}

main()
  .then(() => console.log("Script executed successfully"))
  .catch((error) => console.error(`Error executing script: ${error}`));
