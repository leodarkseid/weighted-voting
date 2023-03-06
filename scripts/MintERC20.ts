import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

import * as dotenv from "dotenv";
import { Signer } from "ethers";

dotenv.config();


async function main() {
    const args = process.argv;
  const tokenAddress = args[2]; // replace with actual token address
  const account1 = args[3];
  const mint_value = ethers.utils.parseEther(args[200000]);

  const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY
  );
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) {
    throw new Error("Private key missing");
  }

  const wallet = new ethers.Wallet(privateKey);
  console.log("Connected to the wallet address", wallet.address);
  const signer = wallet.connect(provider);


//ERC20 contract 
const contractFactory = new MyToken__factory(signer);
console.log('Arg successfully suplied and contract is being attached to',tokenAddress);
const tokenContract = await contractFactory.attach(tokenAddress);
console.log("Contract Attached !!!")

//Mint script
const mintTx = await tokenContract.mint(account1, mint_value);
const mintTxReceipt = await mintTx.wait();
console.log(`
  Minted: ${ethers.utils.formatEther(mint_value)},
  Destination: ${account1},
  Block Number: ${mintTxReceipt.blockNumber}
`);

//Check the balance of the token to confirm Mint

const tokenBalanceAccount1 = await tokenContract.balanceOf(account1);
  console.log(
    "Balance:",ethers.utils.formatEther(tokenBalanceAccount1), "ERC20 tokens!"
  );

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });