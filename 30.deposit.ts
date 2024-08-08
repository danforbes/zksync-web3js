import { TransactionReceipt, utils, Web3 } from "web3";
import { ZkSyncPlugin, ZKSyncWallet } from "web3-plugin-zksync";
import { ETH_ADDRESS } from "web3-plugin-zksync/lib/constants";
import { PriorityOpResponse } from "web3-plugin-zksync/lib/types";

async function main() {
  const web3: Web3 = new Web3("http://localhost:8545/");
  web3.registerPlugin(new ZkSyncPlugin("http://localhost:3050/"));
  const zksync: ZkSyncPlugin = web3.zkSync;

  const PRIVATE_KEY: string =
    "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
  const wallet: ZKSyncWallet = new zksync.ZkWallet(PRIVATE_KEY);
  const senderL1BeginningBalance: bigint = await wallet.getBalanceL1();
  const senderL2BeginningBalance: bigint = await wallet.getBalance();

  const receiver: string = "0xa61464658AfeAf65CccaaFD3a512b69A83B77618";
  const receiverL2BeginningBalance: bigint =
    await zksync.L2.getBalance(receiver);

  const tx: PriorityOpResponse = await wallet.deposit({
    token: ETH_ADDRESS,
    to: receiver,
    amount: utils.toNumber(utils.toWei("0.00020", "ether")),
    refundRecipient: wallet.getAddress(),
  });

  const receipt: TransactionReceipt = await tx.wait();
  console.log("Transaction Hash:", receipt.transactionHash);

  console.log(
    "Sender Change In L1 Balance:",
    senderL1BeginningBalance - (await wallet.getBalanceL1()),
  );
  console.log(
    "Sender Change In L2 Balance:",
    senderL2BeginningBalance - (await wallet.getBalance()),
  );
  console.log(
    "Receiver Change In L2 Balance:",
    receiverL2BeginningBalance - (await zksync.L2.getBalance(receiver)),
  );

  // Transaction Hash: 0xca75d5c4023f2a0f7602ddf432bd259240a0b1672158237754227ce755a24bbf
  // Sender Change In L1 Balance: 2179520912679450n
  // Sender Change In L2 Balance: 0n
  // Receiver Change In L2 Balance: 0n
  // ✅ Script executed successfully
}

main()
  .then(() => console.log("✅ Script executed successfully"))
  .catch((error) => console.error(`❌ Error executing script: ${error}`));
