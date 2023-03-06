//This script self-delegate or delegates ERC20Voting tokens to an account and checks the balance
import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const args = process.argv;
    const tokenAddress = args[2];
  
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

    //Ballot contract 
    const contractFactory = new MyToken__factory(signer);

    //Attach address to Ballot
    const contract = await contractFactory.attach(tokenAddress);
    console.log("Successfully attached");

    //To Self Delegate just pass in your own address as argument
        
    
        //Check voting power Before Delgating
        const votePowerAccount = await contract.getVotes(signer.address);
        const tokenBalanceAccount = await contract.balanceOf(signer.address);
        console.log(`
        Voting power: ${ethers.utils.formatEther(votePowerAccount)},
        Signer Voting Power: ${tokenBalanceAccount}
        `);

        
        const delegateAddress = args[3];

        const tokenBalanceDelegateBefore = await contract.balanceOf(delegateAddress);
        
          console.log(`
          Delegatee Vote token Balance: ${ethers.utils.formatEther(tokenBalanceDelegateBefore)},
          "vote tokens!"
        `);

        const votePowerDelegateBefore = await contract.getVotes(delegateAddress);
        console.log(`
      Delegate voting power:",
      ${ethers.utils.formatEther(votePowerDelegateBefore)}`);
        

        const delegateTxDelegate = await contract.delegate(delegateAddress);
        const delegateTxReceiptDelegate = await delegateTxDelegate.wait();

        console.log(`
            Delegatee:${delegateAddress},
            Block number: ${delegateTxReceiptDelegate.blockNumber},
          `);
        const tokenBalanceDelegateAfter = await contract.balanceOf(delegateAddress);
        console.log(`
        Delegate: ${delegateAddress},
        Balance:${ethers.utils.formatEther(tokenBalanceDelegateAfter)} vote tokens"
        `);
        const votePowerDelegateAfter = await contract.balanceOf(delegateAddress);
        console.log(`
        Delegate: ${delegateAddress},
        Balance:${ethers.utils.formatEther(votePowerDelegateAfter)} "
        `);

}}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });