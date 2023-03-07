# Sample Hardhat Project

This is a Weighted Voting Project By all Team members of Team 11

To get Started; 

-Fork this repo,
-Run ```yarn install```"
-Run ```yarn hardhat compile``` 
-To deploy the Token contract ```yarn run ts-node --files ./scripts/DeployERC20Votes.ts```
-To Mint Tokens run ```yarn run ts-node --files scripts/MintERC20.ts "Contract address" "Recipient" "Tokens amount"  ```
-To Delegate Tokens run ```yarn run ts-node --files scripts/DelegateVotes.ts "contract address" "Delegatee" ```

N.B. its important to Delegate Tokens first before deploying Ballot Contract has the chosen Block is not changeable after deployment 

-To Deploy Tokenized Ballot run ```yarn ts-node --files scripts/DeployTokenizedBallot.ts "Token addresss" "block number" "proposal1"proposal2" "proposal3" "proposal4"```
-To vote run ```yarn run ts-node --files scripts/vote.ts "Ballot address" "proposal id" "amount of voting power" ```

If you get gas estimation error after voting then you most likely didn't delegate before the assigned blockNumber, thus you have a voting power of zero,(To confirm this vote with zero(0) voting power, the transaction should go through)
 or you are voting with more voting power than yu actually have

