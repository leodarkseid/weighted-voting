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
  console.log(`Attaching....... ${contractAddress}`);
  const deployedContract = await ballotFactory.attach(contractAddress);
  console.log("Successfully Attached Contract");

  //Get Block No
  const getBlock = await provider.getBlockNumber();
  console.log("Loading !!!");

  //winning Proposal 
  const winner = await deployedContract.winningProposal();

  //Call the winnerName function for show the winner name
  const winnerName = await deployedContract.winnerName();
  
  console.log(`
  Loading Succesful !!!


  Current Block Number: ${getBlock},
  Winning Proposal: ${winner},
  Winning Proposal Name: ${winnerName}
  `)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});