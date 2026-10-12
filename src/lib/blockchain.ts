import { ethers } from "ethers";
import { supabase } from "./supabase";

export interface TransactionReceipt {
  transactionHash: string;
  blockNumber: number;
  blockHash: string;
  from: string;
  to: string;
  contractAddress: string;
  gasUsed: string;
  timestamp: number;
  status: "SUCCESS" | "REVERTED";
  errorMessage?: string;
  event: {
    name: "VoteCast";
    electionId: string;
    nullifierHash: string;
    candidateId: number;
  };
}

export interface Block {
  blockNumber: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactions: TransactionReceipt[];
  miner: string;
  difficulty: number;
}

export const CONTRACT_ADDRESS = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
export const NETWORK_NAME = "AnonVote Testnet L2 (Sepolia/Arbitrum compatible)";
export const CHAIN_ID = 421614;

const GENESIS_BLOCK: Block = {
  blockNumber: 1048570,
  hash: "0x3a9b1c7f42d8e906b3fa1280d9c467ea3519b0271cd827459fa126830598b9f1",
  parentHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  timestamp: Date.now() - 3600000 * 24,
  transactions: [],
  miner: "0xSRM_INSTITUTION_VALIDATOR_NODE_01",
  difficulty: 1,
};

class BlockchainLedger {
  private blocks: Block[] = [];
  private nullifiersMap: Map<string, Set<string>> = new Map();
  private voteTallies: Map<string, Map<number, number>> = new Map();

  constructor() {
    this.loadFromStorage();
    this.syncWithSupabase();
  }

  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  private loadFromStorage() {
    if (!this.isBrowser()) {
      this.blocks = [GENESIS_BLOCK];
      return;
    }

    try {
      const savedBlocks = localStorage.getItem("anonvote_blocks");
      const savedNullifiers = localStorage.getItem("anonvote_nullifiers");
      const savedTallies = localStorage.getItem("anonvote_tallies");

      if (savedBlocks) {
        this.blocks = JSON.parse(savedBlocks);
      } else {
        this.blocks = [GENESIS_BLOCK];
        this.saveToStorage();
      }

      if (savedNullifiers) {
        const raw = JSON.parse(savedNullifiers);
        this.nullifiersMap = new Map();
        for (const [eId, nList] of Object.entries(raw)) {
          this.nullifiersMap.set(eId, new Set(nList as string[]));
        }
      }

      if (savedTallies) {
        const rawTallies = JSON.parse(savedTallies);
        this.voteTallies = new Map();
        for (const [eId, candMap] of Object.entries(rawTallies)) {
          const map = new Map<number, number>();
          for (const [cId, count] of Object.entries(candMap as Record<string, number>)) {
            map.set(Number(cId), Number(count));
          }
          this.voteTallies.set(eId, map);
        }
      }
    } catch {
      this.blocks = [GENESIS_BLOCK];
    }
  }

  private saveToStorage() {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem("anonvote_blocks", JSON.stringify(this.blocks));

      const nullifiersObj: Record<string, string[]> = {};
      for (const [eId, set] of this.nullifiersMap.entries()) {
        nullifiersObj[eId] = Array.from(set);
      }
      localStorage.setItem("anonvote_nullifiers", JSON.stringify(nullifiersObj));

      const talliesObj: Record<string, Record<number, number>> = {};
      for (const [eId, map] of this.voteTallies.entries()) {
        const cObj: Record<number, number> = {};
        for (const [cId, count] of map.entries()) {
          cObj[cId] = count;
        }
        talliesObj[eId] = cObj;
      }
      localStorage.setItem("anonvote_tallies", JSON.stringify(talliesObj));
    } catch {}
  }

  public async syncWithSupabase() {
    try {
      const { data: dbBlocks } = await supabase
        .from("blockchain_blocks")
        .select("*")
        .order("block_number", { ascending: true });

      const { data: dbTxs } = await supabase
        .from("blockchain_transactions")
        .select("*");

      if (dbBlocks && dbBlocks.length > 0 && dbTxs) {
        const loadedBlocks: Block[] = [GENESIS_BLOCK];

        for (const b of dbBlocks) {
          const matchingTxs: TransactionReceipt[] = dbTxs
            .filter((t) => Number(t.block_number) === Number(b.block_number))
            .map((t) => ({
              transactionHash: t.transaction_hash,
              blockNumber: Number(t.block_number),
              blockHash: b.block_hash,
              from: "0xRELAYER_DELEGATE_NODE",
              to: CONTRACT_ADDRESS,
              contractAddress: CONTRACT_ADDRESS,
              gasUsed: t.gas_used || "48192 Gwei",
              timestamp: new Date(t.created_at || b.created_at).getTime(),
              status: "SUCCESS",
              event: {
                name: "VoteCast",
                electionId: t.election_id,
                nullifierHash: t.nullifier_hash,
                candidateId: Number(t.candidate_id),
              },
            }));

          loadedBlocks.push({
            blockNumber: Number(b.block_number),
            hash: b.block_hash,
            parentHash: b.parent_hash,
            timestamp: new Date(b.created_at).getTime(),
            transactions: matchingTxs,
            miner: b.miner,
            difficulty: 1,
          });

          // Sync nullifiers and tallies
          for (const tx of matchingTxs) {
            const eId = tx.event.electionId;
            if (!this.nullifiersMap.has(eId)) {
              this.nullifiersMap.set(eId, new Set());
            }
            this.nullifiersMap.get(eId)!.add(tx.event.nullifierHash);

            if (!this.voteTallies.has(eId)) {
              this.voteTallies.set(eId, new Map());
            }
            const current = this.voteTallies.get(eId)!.get(tx.event.candidateId) || 0;
            this.voteTallies.get(eId)!.set(tx.event.candidateId, current + 1);
          }
        }

        this.blocks = loadedBlocks;
        this.saveToStorage();
      }
    } catch (err) {
      console.warn("Supabase blockchain sync:", err);
    }
  }

  public getBlocks(): Block[] {
    return [...this.blocks].reverse();
  }

  public getTransactions(): TransactionReceipt[] {
    const txs: TransactionReceipt[] = [];
    for (const b of this.blocks) {
      txs.push(...b.transactions);
    }
    return txs.reverse();
  }

  public isNullifierUsed(electionId: string, nullifierHash: string): boolean {
    const set = this.nullifiersMap.get(electionId);
    return set ? set.has(nullifierHash) : false;
  }

  public getCandidateVotes(electionId: string, candidateId: number): number {
    const map = this.voteTallies.get(electionId);
    return map?.get(candidateId) || 0;
  }

  public getElectionTallies(electionId: string): Record<number, number> {
    const map = this.voteTallies.get(electionId);
    const res: Record<number, number> = {};
    if (map) {
      for (const [cId, count] of map.entries()) {
        res[cId] = count;
      }
    }
    return res;
  }

  public async castVote(
    electionId: string,
    nullifierHash: string,
    candidateId: number
  ): Promise<TransactionReceipt> {
    if (this.isNullifierUsed(electionId, nullifierHash)) {
      throw new Error("REVERT: Nullifier already spent. Double vote detected on blockchain ledger.");
    }

    if (!this.nullifiersMap.has(electionId)) {
      this.nullifiersMap.set(electionId, new Set());
    }
    this.nullifiersMap.get(electionId)!.add(nullifierHash);

    if (!this.voteTallies.has(electionId)) {
      this.voteTallies.set(electionId, new Map());
    }
    const current = this.voteTallies.get(electionId)!.get(candidateId) || 0;
    this.voteTallies.get(electionId)!.set(candidateId, current + 1);

    const latestBlock = this.blocks[this.blocks.length - 1] || GENESIS_BLOCK;
    const newBlockNumber = latestBlock.blockNumber + 1;
    const timestamp = Date.now();

    const relayerWallet = ethers.Wallet.createRandom();
    const txHash = ethers.keccak256(
      ethers.toUtf8Bytes(`${electionId}-${nullifierHash}-${candidateId}-${timestamp}-${newBlockNumber}`)
    );
    const blockHash = ethers.keccak256(
      ethers.toUtf8Bytes(`${latestBlock.hash}-${txHash}-${timestamp}`)
    );

    const txReceipt: TransactionReceipt = {
      transactionHash: txHash,
      blockNumber: newBlockNumber,
      blockHash,
      from: relayerWallet.address,
      to: CONTRACT_ADDRESS,
      contractAddress: CONTRACT_ADDRESS,
      gasUsed: "48192 Gwei",
      timestamp,
      status: "SUCCESS",
      event: {
        name: "VoteCast",
        electionId,
        nullifierHash,
        candidateId,
      },
    };

    const newBlock: Block = {
      blockNumber: newBlockNumber,
      hash: blockHash,
      parentHash: latestBlock.hash,
      timestamp,
      transactions: [txReceipt],
      miner: "0xSRM_INSTITUTION_VALIDATOR_NODE_01",
      difficulty: 1,
    };

    this.blocks.push(newBlock);
    this.saveToStorage();

    // Permanent cloud commit to Supabase PostgreSQL
    (async () => {
      try {
        await supabase.from("blockchain_blocks").insert({
          block_number: newBlockNumber,
          block_hash: blockHash,
          parent_hash: latestBlock.hash,
          miner: "0xSRM_INSTITUTION_VALIDATOR_NODE_01",
        });

        await supabase.from("blockchain_transactions").insert({
          transaction_hash: txHash,
          block_number: newBlockNumber,
          election_id: electionId,
          nullifier_hash: nullifierHash,
          candidate_id: candidateId,
          gas_used: "48192 Gwei",
          status: "SUCCESS",
        });
      } catch (err) {
        console.error("Supabase block recording notice:", err);
      }
    })();

    return txReceipt;
  }

  public resetLedger() {
    this.blocks = [GENESIS_BLOCK];
    this.nullifiersMap.clear();
    this.voteTallies.clear();
    this.saveToStorage();
  }
}

export const blockchain = new BlockchainLedger();
