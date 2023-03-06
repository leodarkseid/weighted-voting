import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config();

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }

async function main() {
    const args = process.argv;
    const tokenContract = args[2];
    const blockNumber = args[3];
    const proposals = args.slice(4);
    if (proposals.length <= 0) throw new Error("Missing proposals");
  
    const provider = new ethers.providers.AlchemyProvider(
      "goerli",
      process.env.ALCHEMY_API_KEY
    );
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || privateKey.length <= 0) {
      throw new Error("Private key missing");
    }

    const wallet = new ethers.Wallet(privateKey);
    console.log("Connected to the wallet address", wallet.address);
    const signer = wallet.connect(provider);

    //Deploy TokenizedBallot.sol
    const contractTokenizedBallot = new Ballot__factory(signer);
    const contractDeploy = await contractTokenizedBallot.deploy(convertStringArrayToBytes32(proposals), tokenContract, blockNumber);
    console.log("Deploying contract ...");
    await contractDeploy.deployed();
    const deployedTransactionReceipt = await contractDeploy.deployTransaction.wait();
    console.log(`
    Block Number : ${deployedTransactionReceipt.blockNumber}, 
    Contract Address: ${deployedTransactionReceipt.blockNumber},
    Courtesy of : ${signer.address}
    `)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });