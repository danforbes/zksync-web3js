import { TransactionReceipt, utils, Web3 } from "web3";
import { ZkSyncPlugin, ZKSyncWallet } from "web3-plugin-zksync";
import { ETH_ADDRESS } from "web3-plugin-zksync/lib/constants";
import { PriorityOpResponse } from "web3-plugin-zksync/lib/types";

async function main() {
  const web3: Web3 = new Web3("http://localhost:3050/");
  web3.registerPlugin(new ZkSyncPlugin("http://localhost:3051/"));

  const zksync: ZkSyncPlugin = web3.zkSync;
  const PRIVATE_KEY: string = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
  const wallet: ZKSyncWallet = new zksync.ZkWallet(PRIVATE_KEY);

  console.log("Sender L1 Beginning Balance:", await wallet.getBalanceL1());
  console.log("Sender L2 Beginning Balance:", await wallet.getBalance());

  const receiver: string = "0xa61464658AfeAf65CccaaFD3a512b69A83B77618";
  console.log("Receiver L2 Beginning Balance:",  await zksync.L2.getBalance(receiver));

  const tx: PriorityOpResponse = await wallet.deposit({
    token: ETH_ADDRESS,
    to: receiver,
    amount: utils.toNumber(utils.toWei("0.00020", "ether")),
    refundRecipient: wallet.getAddress()
  });

//   Error executing script: AbiError: Parameter decoding error: Returned values aren't valid,
//   did it run Out of Gas? You might also see this error if you are not using the correct ABI
//   for the contract you are retrieving data from, requesting data from a block number that
//   does not exist, or querying a node which is not fully synced.

  const receipt: TransactionReceipt = await tx.wait();

  console.log("Receipt:", receipt);
  console.log("Sender L1 Ending Balance:", await wallet.getBalanceL1());
  console.log("Sender L2 Ending Balance:", await wallet.getBalance());
  console.log("Receiver L2 Ending Balance:",  await zksync.L2.getBalance(receiver));
}

main()
  .then(() => console.log("Script executed successfully"))
  .catch((error) => console.error(`Error executing script: ${error}`));
