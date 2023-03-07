//This script self-delegate or delegates ERC20Voting tokens to an account and checks the balance
import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const args = process.argv;
    const tokenAddress = args[2];
    const delegateeAddress = args[3];

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

    //Ballot contract 
    const contractFactory = new MyToken__factory(signer);

    //Attach address to Ballot
    const contract = await contractFactory.attach(tokenAddress);
    console.log("Successfully attached");

    //To Self Delegate just pass in your own address as argument
        
    
        //Check voting power and token Balance Before Delgating
        const votePowerAccountBefore = await contract.getVotes(signer.address);
        const tokenBalanceAccountBefore = await contract.balanceOf(signer.address);
        console.log(`
        Signer Voting power before Delegation: ${ethers.utils.formatEther(votePowerAccountBefore)},
        Signer Token Balance before Delegation: ${tokenBalanceAccountBefore}
        `);

        
        //Check Delegatee Voting power and balance before delegating
        const tokenBalanceDelegateBefore = await contract.balanceOf(delegateeAddress);
        const delegateeVotePowerBefore = await contract.getVotes(delegateeAddress);
        console.log(`
          Delegatee Vote token Balance before Delegation: ${ethers.utils.formatEther(tokenBalanceDelegateBefore)},
          Vote tokens
        `);
        console.log(`Delegatee Vote Power before Delegation: ${ethers.utils.formatEther(delegateeVotePowerBefore)},
        vote tokens`)


        // Delegate Voting Powers to Delegatee

        const delegateTxDelegate = await contract.delegate(delegateeAddress);
        console.log("Delegating ...")
        const delegateTxReceiptDelegate = await delegateTxDelegate.wait();

        // check  Delegate voting Powers after delegation
        const tokenBalanceSignerAfter = await contract.balanceOf(signer.address);
        const votePowerSignerAfter = await contract.getVotes(signer.address);
        const tokenBalanceDelegateAfter = await contract.balanceOf(delegateeAddress);
        const votePowerDelegateAfter = await contract.getVotes(delegateeAddress);
        console.log(`
            Successful !!!

            Signer(Delegator) Address:${signer.address}
            Signer Token Balance After Delegation :${ethers.utils.formatEther(tokenBalanceSignerAfter)}
            Signer Token Voting Power After Delegation : ${ethers.utils.formatEther(votePowerSignerAfter)}

            Delegatee Address:${delegateeAddress},
            Block number: ${delegateTxReceiptDelegate.blockNumber},

            Delegatee Token Balance After Delegation: ${ethers.utils.formatEther(tokenBalanceDelegateAfter)},
            Delegatee Voting Power after Delegation: ${ethers.utils.formatEther(votePowerDelegateAfter)},
    
          `);
        
        

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });