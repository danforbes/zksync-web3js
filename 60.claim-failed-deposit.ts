import { TransactionReceipt, utils, Web3 } from "web3";
import {
  constants,
  types,
  ZkSyncPlugin,
  ZKSyncWallet,
} from "web3-plugin-zksync";

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

  const tx: types.PriorityOpResponse = await wallet.deposit({
    token: constants.ETH_ADDRESS,
    to: receiver,
    amount: utils.toWei("0.00020", "ether"),
    refundRecipient: wallet.getAddress(),
    l2GasLimit: 300_000,
  });

  const withdrawReceipt: TransactionReceipt = await tx.waitFinalize();
  console.log("Withdraw Transaction Hash:", withdrawReceipt.transactionHash);

  console.log(
    "[Before Claim Failed] Sender Change In L1 Balance:",
    senderL1BeginningBalance - (await wallet.getBalanceL1()),
  );
  console.log(
    "[Before Claim Failed] Sender Change In L2 Balance:",
    senderL2BeginningBalance - (await wallet.getBalance()),
  );
  console.log(
    "[Before Claim Failed] Receiver Change In L2 Balance:",
    receiverL2BeginningBalance - (await zksync.L2.getBalance(receiver)),
  );

  const claimFailedReceipt: TransactionReceipt =
    await wallet.claimFailedDeposit(withdrawReceipt.transactionHash);
  //  ❌ Error executing script: Web3ValidatorError: Web3 validator found 5 error[s]:
  //  value at "/0" is required
  //  value at "/1" is required
  //  value at "/2" is required
  //  value at "/3" is required
  //  value at "/4" is required
  console.log(
    "Claim Failed Transaction Hash:",
    claimFailedReceipt.transactionHash,
  );

  console.log(
    "[After Claim Failed] Sender Change In L1 Balance:",
    senderL1BeginningBalance - (await wallet.getBalanceL1()),
  );
  console.log(
    "[After Claim Failed] Sender Change In L2 Balance:",
    senderL2BeginningBalance - (await wallet.getBalance()),
  );
  console.log(
    "[After Claim Failed] Receiver Change In L2 Balance:",
    receiverL2BeginningBalance - (await zksync.L2.getBalance(receiver)),
  );
}

main()
  .then(() => console.log("✅ Script executed successfully"))
  .catch((error) => console.error(`❌ Error executing script: ${error}`));
