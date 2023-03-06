import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";

async function main() {
    const provider = new ethers.providers.AlchemyProvider(
        "goerli",
        process.env.ALCHEMY_API_KEY
    );
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || privateKey.length <= 0){
        throw new Error("Private key missing");
    }

    const wallet = new ethers.Wallet(privateKey);
    console.log("Connected to the wallet address", wallet.address);
    const signer = wallet.connect(provider);  


//Deploy ERC20vote contract 

const contractFactory = new MyToken__factory(signer);
const contract = await contractFactory.deploy();
console.log("Deploying contract ...");
await contract.deployed();
const deployTransactionReceipt = await contract.deployTransaction.wait();
console.log(
    "Contract address:",
    contract.address,
    "deployer",
    signer.address,
    "block number",
    deployTransactionReceipt.blockNumber,
    "\n"
  );
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});