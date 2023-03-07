import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {
  const args = process.argv;
  const contractAddress = args[2];

  const provider = new ethers.providers.InfuraProvider(
    "goerli",
    process.env.INFURA_API_KEY
  );

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0)
    throw new Error("Missing enviroment: private key missing");
  const wallet = new ethers.Wallet(privateKey);

  const signer = wallet.connect(provider);
  console.log("The signer is: " + signer.address);

  
  //Ballot Address
  const ballotFactory = new Ballot__factory(signer);

  //Attach an address to the contract
  console.log(`Attaching to ballot contract at address ${contractAddress} ...`);
  const deployedContract = await ballotFactory.attach(contractAddress);
  console.log("Successfully attached");

  const currentBlock = await provider.getBlockNumber();
  console.log("Current block number: ", currentBlock);

  //Call the winningProposal function for show the winner
  const winner = await deployedContract.winningProposal();
  console.log("The Winner at block", currentBlock, "is: " + winner);

  //Call the winnerName function for show the winner name
  const winnerName = await deployedContract.winnerName();
  console.log("The Winner Name at block", currentBlock, "is: " + winnerName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});