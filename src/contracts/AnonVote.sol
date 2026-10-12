// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AnonVote
 * @dev Privacy-Preserving Campus Election Smart Contract
 * Separates voter identity from the ballot using cryptographic nullifiers.
 * Developed for SRM Institute of Science and Technology.
 */
contract AnonVote {
    struct Candidate {
        uint256 id;
        string name;
        string department;
        uint256 voteCount;
    }

    struct Election {
        bytes32 electionId;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 totalVotes;
        uint256 candidateCount;
    }

    address public admin;

    // electionId => Election details
    mapping(bytes32 => Election) public elections;
    
    // electionId => candidateId => Candidate
    mapping(bytes32 => mapping(uint256 => Candidate)) public electionCandidates;
    
    // electionId => nullifierHash => isUsed (Prevents double voting anonymously)
    mapping(bytes32 => mapping(bytes32 => bool)) public isNullifierUsed;

    // Audit logs of all transactions
    event ElectionCreated(bytes32 indexed electionId, string title, uint256 candidateCount);
    event VoteCast(
        bytes32 indexed electionId,
        bytes32 indexed nullifierHash,
        uint256 candidateId,
        uint256 blockNumber,
        uint256 timestamp
    );
    event ElectionStatusChanged(bytes32 indexed electionId, bool isActive);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createElection(
        bytes32 electionId,
        string memory title,
        string memory description,
        string[] memory candidateNames,
        string[] memory candidateDepts
    ) external onlyAdmin {
        require(elections[electionId].electionId == bytes32(0), "Election ID already exists");
        require(candidateNames.length == candidateDepts.length, "Candidate array mismatch");
        require(candidateNames.length > 0, "At least one candidate required");

        Election storage el = elections[electionId];
        el.electionId = electionId;
        el.title = title;
        el.description = description;
        el.startTime = block.timestamp;
        el.endTime = block.timestamp + 7 days;
        el.isActive = true;
        el.totalVotes = 0;
        el.candidateCount = candidateNames.length;

        for (uint256 i = 0; i < candidateNames.length; i++) {
            electionCandidates[electionId][i + 1] = Candidate({
                id: i + 1,
                name: candidateNames[i],
                department: candidateDepts[i],
                voteCount: 0
            });
        }

        emit ElectionCreated(electionId, title, candidateNames.length);
    }

    /**
     * @notice Casts an anonymous vote using a one-time cryptographic nullifier.
     * @dev Zero voter personal identifiable information (PII) is provided or stored.
     * @param electionId The identifier for the election
     * @param nullifierHash Hash derived from voter secret and session ID
     * @param candidateId ID of the selected candidate
     */
    function castVote(
        bytes32 electionId,
        bytes32 nullifierHash,
        uint256 candidateId
    ) external {
        Election storage el = elections[electionId];
        require(el.isActive, "Election is not active or has ended");
        require(!isNullifierUsed[electionId][nullifierHash], "Nullifier already spent: Duplicate vote rejected");
        require(candidateId > 0 && candidateId <= el.candidateCount, "Invalid candidate selected");

        // Mark nullifier as spent permanently
        isNullifierUsed[electionId][nullifierHash] = true;
        
        // Increment candidate count & total votes
        electionCandidates[electionId][candidateId].voteCount++;
        el.totalVotes++;

        emit VoteCast(electionId, nullifierHash, candidateId, block.number, block.timestamp);
    }

    function getCandidateVotes(bytes32 electionId, uint256 candidateId) external view returns (uint256) {
        return electionCandidates[electionId][candidateId].voteCount;
    }

    function isVoteUsed(bytes32 electionId, bytes32 nullifierHash) external view returns (bool) {
        return isNullifierUsed[electionId][nullifierHash];
    }

    function setElectionStatus(bytes32 electionId, bool isActive) external onlyAdmin {
        elections[electionId].isActive = isActive;
        emit ElectionStatusChanged(electionId, isActive);
    }
}
