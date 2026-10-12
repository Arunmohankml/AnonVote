import { ethers } from "ethers";

/**
 * AnonVote Cryptographic Library
 * Implements Identity-Ballot Separation via Cryptographic Nullifiers and Commitments.
 * 
 * Flow:
 * 1. Admin issues random Voter ID (e.g. "2f39s2Hh") to eligible student.
 * 2. Student inputs Session ID ("ELX-7F92KQ") + Voter ID ("2f39s2Hh").
 * 3. System generates Anonymous One-Time Voting Credential:
 *    - secret = keccak256(voterId + electionSalt)
 *    - nullifierHash = keccak256(secret + sessionId)
 * 4. The Database marks Voter ID as CLAIMED, without knowing the vote.
 * 5. The Anonymous Credential (nullifierHash + ballot) is cast directly to the Smart Contract.
 * 6. The Smart Contract records the nullifierHash to prevent double voting.
 * 7. ZERO personal identification is recorded on-chain or linked to candidate choice.
 */

export interface AnonymousCredential {
  sessionId: string;
  nullifierHash: string;
  commitmentHash: string;
  credentialToken: string;
  issuedAt: number;
}

/**
 * Generate an 8-character alphanumeric Voter ID (e.g., "2f39s2Hh")
 */
export function generateVoterId(): string {
  const chars = "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a Session ID (e.g., "ELX-7F92KQ")
 */
export function generateSessionId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ELX-${code}`;
}

/**
 * Generate an Anonymous One-Time Voting Credential from Session ID and Voter ID.
 * The output nullifierHash is mathematically un-linkable to the Voter ID without the secret.
 */
export function generateAnonymousCredential(
  sessionId: string,
  voterId: string,
  electionSalt: string = "SRM_ANONVOTE_SALT_2026"
): AnonymousCredential {
  // Secret derived using Keccak-256
  const secretSeed = `${voterId.trim()}:${electionSalt}:${sessionId.trim()}`;
  const secretBytes = ethers.toUtf8Bytes(secretSeed);
  const secretToken = ethers.keccak256(secretBytes);

  // Nullifier Hash: H(secretToken, sessionId)
  const nullifierBytes = ethers.toUtf8Bytes(`${secretToken}:${sessionId.trim()}`);
  const nullifierHash = ethers.keccak256(nullifierBytes);

  // Commitment Hash: H(secretToken)
  const commitmentHash = ethers.keccak256(ethers.toUtf8Bytes(secretToken));

  return {
    sessionId: sessionId.trim(),
    nullifierHash,
    commitmentHash,
    credentialToken: secretToken.slice(0, 18),
    issuedAt: Date.now(),
  };
}

/**
 * Convert string ID into a 32-byte hash for Solidity bytes32
 */
export function toBytes32(text: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(text));
}

/**
 * Shorten hash for display
 */
export function shortenHash(hash: string, start = 6, end = 4): string {
  if (!hash) return "";
  if (hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}
