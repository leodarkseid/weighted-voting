import { ethers } from "hardhat";
import { MyToken__factory, Ballot__factory } from "../typechain-types";

import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const args = process.argv;
    const ballotAddress = args[2];
    const proposal = parseInt(args[3]);
    const amount = parseInt(args[4]);
  
    const provider = new ethers.providers.InfuraProvider(
      "goerli",
      process.env.INFURA_API_KEY
    );
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || privateKey.length <= 0) {
      throw new Error("Private key missing");
    }
  
    const wallet = new ethers.Wallet(privateKey);
    console.log("Connected to the wallet address", wallet.address);
    const signer = wallet.connect(provider);

    //Ballot Contract
    const contractFactory = new Ballot__factory(signer);

    //Attach an address to the contract
  const contract = await contractFactory.attach(ballotAddress);
  console.log("Successful attached Ballot Address");

  //Vote on proposal
  const voteTx = await contract.connect(signer).vote(proposal, amount);
  const voteTxReceipt = await voteTx.wait();
  console.log(`
  Address: ${signer.address},
  Vote power used: ${amount},
  Proposal Voted for: ${proposal},
  Block Number: ${voteTxReceipt.blockNumber},
  `)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});