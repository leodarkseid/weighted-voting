
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { TeamToken, Ballot__factory, MyToken, MyToken__factory, TeamToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("200000");
const blockNumber = 4;
let tokenAddress;
const transferAmount = ethers.utils.parseEther('100')

const proposalNames = [
    ethers.utils.formatBytes32String("apple"),
    ethers.utils.formatBytes32String("orange"),
    ethers.utils.formatBytes32String("kiwi"),
  ];

  const proposals = proposalNames.map(name => name )

async function main() {

    const [deployer,account1,account2] = await ethers.getSigners();

    //This is for the token Minting
    const tokenContractFactory = new TeamToken__factory(deployer);
    const tokenContract = await tokenContractFactory.deploy();
    const tokenContractTxReceipt = await tokenContract.deployTransaction.wait();
    const mintTx = await tokenContract.mint(deployer.address, MINT_VALUE);
    const mintTxReceipt = await mintTx.wait();
    tokenAddress = await tokenContractTxReceipt.contractAddress;
    console.log(`Tokens with Contract address ${tokenAddress} minted for ${account1.address} at block ${mintTxReceipt.blockNumber}`);

    //Check the balance of the token to confirm Mint
    const balanceTokenMinted = await tokenContract.balanceOf(account1.address);
    console.log(`${account1.address} has a  ${ethers.utils.formatEther(balanceTokenMinted)} `)


    //This is the Tokenized Ballot
    
    const contractTokenizedBallot = new Ballot__factory(deployer);
    const contractDeploy = await contractTokenizedBallot.deploy(proposalNames, tokenAddress,blockNumber);
    const deployedTransactionReceipt = await contractDeploy.deployTransaction.wait();
    console.log(`The Tokenized Ballot was deployed at the block ${deployedTransactionReceipt.blockNumber} `);
    

    
    //TO DO

    //Transfer tokens to everyone else
    const balanceBefore = await tokenContract.balanceOf(account1.address);
    const transferTokens = await tokenContract.connect(deployer).transfer(account1.address, transferAmount);
    const transferReceipt = await transferTokens.wait();
    const balanceAfter = await tokenContract.balanceOf(account1.address);
    console.log(`This is for transfer ${account1.address} which has a before balance of ${balanceBefore} and now has a after  ${ethers.utils.formatEther(balanceAfter)}, block is ${transferReceipt.blockNumber} `)    
    
    
    // check voting power before 
    let votePowerAccount = await tokenContract.getVotes(account1.address);
    console.log(`Account 1 has a before vote power of ${ethers.utils.formatEther(votePowerAccount)} units` );

    // Delegating Votes(either to yourself or someone else)

    const delegateTx = await tokenContract.connect(account1).delegate(account1.address);
    const delegateTxReceipt = await delegateTx.wait();
    console.log(`Tokens delegated from ${account1.address} minted for ${account1.address} at block ${delegateTxReceipt.blockNumber} for a cost of ${delegateTxReceipt.gasUsed} gas units, totalling a tx cost of ${delegateTxReceipt.gasUsed.mul(delegateTxReceipt.effectiveGasPrice)} Wei (${ethers.utils.formatEther(delegateTxReceipt.gasUsed.mul(delegateTxReceipt.effectiveGasPrice)) } ether)
    `);
    


    // Check voting Power

    let votePowerAccount1 = await tokenContract.getPastVotes(account1.address,4);
    const dtx = await contractDeploy.votingPower(account1.address);
    console.log(`Account 1 has a vote power of ${ethers.utils.formatEther(votePowerAccount1)} units and ${dtx} `);

    // Cast Vote

    // for (let i = 0; i<proposalNames.length; i++){
    //     const castVote = await contractDeploy.connect(account1).vote(proposalNames[i],ethers.utils.parseEther('100'))
    //     await castVote.wait();  
    // }
    

    

    // Query result from Proposals

    const proposalResult = await contractDeploy.winningProposal();
    const winningName = await contractDeploy.winnerName();
    console.log(`the winning proposal is ${winningName}, with ${proposalResult} votes`)
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
