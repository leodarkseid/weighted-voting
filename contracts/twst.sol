mapping(address => address) public delegates;

function delegate(address to) public {
    require(to != msg.sender, "You cannot delegate your vote to yourself");

    // Update the delegate for the caller
    delegates[msg.sender] = to;

    // If the delegate has already voted, add the caller's voting power to their vote count
    uint256 delegateVoteCount = proposals[winningProposal()].voteCount;
    if (delegateVoteCount != 0) {
        address delegate = delegates[to];
        proposals[winningProposal()].voteCount = delegateVoteCount + votingPower(msg.sender);
        votingPowerSpent[msg.sender] += votingPower(msg.sender);
    }
}
