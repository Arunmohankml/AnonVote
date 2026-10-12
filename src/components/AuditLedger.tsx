"use client";

import React, { useState } from "react";
import {
  FileCode,
  ShieldCheck,
  Search,
  Download,
  RotateCcw,
  Check,
  Copy,
  Layers,
  Cpu,
  Terminal,
} from "lucide-react";
import { blockchain, Block, TransactionReceipt, CONTRACT_ADDRESS, NETWORK_NAME, CHAIN_ID } from "@/lib/blockchain";
import { shortenHash } from "@/lib/crypto";

interface AuditLedgerProps {
  onReset: () => void;
}

export const AuditLedger: React.FC<AuditLedgerProps> = ({ onReset }) => {
  const [blocks, setBlocks] = useState<Block[]>(blockchain.getBlocks());
  const [transactions, setTransactions] = useState<TransactionReceipt[]>(blockchain.getTransactions());
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<TransactionReceipt | null>(null);

  const handleRefresh = () => {
    setBlocks(blockchain.getBlocks());
    setTransactions(blockchain.getTransactions());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const downloadAuditJSON = () => {
    const data = {
      institution: "SRM Institute of Science and Technology, Chennai",
      network: NETWORK_NAME,
      chainId: CHAIN_ID,
      smartContract: CONTRACT_ADDRESS,
      totalBlocks: blocks.length,
      totalTransactions: transactions.length,
      timestamp: new Date().toISOString(),
      blocks,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AnonVote_Blockchain_Audit_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredTxs = transactions.filter((tx) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      tx.transactionHash.toLowerCase().includes(q) ||
      tx.event.nullifierHash.toLowerCase().includes(q) ||
      tx.event.electionId.toLowerCase().includes(q) ||
      tx.blockNumber.toString().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>DECENTRALIZED VERIFICATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-950 tracking-tight">
            Public Blockchain Audit Ledger
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 font-normal mt-1">
            Zero-knowledge auditability: Every vote produces an immutable on-chain record without exposing voter identity.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={downloadAuditJSON}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit Proof (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (confirm("Reset local blockchain ledger to genesis block?")) {
                blockchain.resetLedger();
                handleRefresh();
                onReset();
              }
            }}
            title="Reset Ledger"
            className="p-2.5 rounded-xl bg-[#f4f4f6] text-zinc-500 hover:text-red-600 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Network Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#f4f4f6] rounded-[28px] p-6 border border-zinc-200/60 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-800 shadow-2xs">
            <FileCode className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Solidity Contract</span>
            <span className="text-xs font-mono font-bold text-zinc-900 truncate block mt-0.5">{CONTRACT_ADDRESS}</span>
          </div>
        </div>

        <div className="bg-[#f4f4f6] rounded-[28px] p-6 border border-zinc-200/60 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-800 shadow-2xs">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Execution Layer</span>
            <span className="text-xs font-semibold text-zinc-900 truncate block mt-0.5">{NETWORK_NAME}</span>
          </div>
        </div>

        <div className="bg-[#f4f4f6] rounded-[28px] p-6 border border-zinc-200/60 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-2xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Consensus State</span>
            <span className="text-xs font-bold text-emerald-600 truncate block mt-0.5">Tamper-Resistant ✓</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Filter by Tx Hash, Nullifier Hash, Session ID, or Block Number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#f4f4f6] border border-zinc-200 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900 placeholder:text-zinc-400 transition-all font-mono"
        />
      </div>

      {/* Mined Transactions */}
      <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-zinc-200 space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Mined Vote Transactions</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Each transaction commits an anonymous cryptographic nullifier without exposing voter identity.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full">
            {transactions.length} Total Tx
          </span>
        </div>

        {filteredTxs.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-sm">
            No transactions found. Cast a vote in the terminal to mint the first block!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-200">
            <table className="w-full text-left text-xs font-mono text-zinc-700">
              <thead className="bg-[#f4f4f6] text-zinc-500 font-semibold uppercase text-[10px] border-b border-zinc-200">
                <tr>
                  <th className="px-4 py-3">Block</th>
                  <th className="px-4 py-3">Tx Hash</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Nullifier</th>
                  <th className="px-4 py-3">Ballot</th>
                  <th className="px-4 py-3">Gas</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredTxs.map((tx) => (
                  <tr
                    key={tx.transactionHash}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-zinc-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-bold text-zinc-900">#{tx.blockNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-zinc-800">{shortenHash(tx.transactionHash, 8, 6)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(tx.transactionHash);
                          }}
                          className="p-0.5 text-zinc-400 hover:text-zinc-900"
                        >
                          {copiedText === tx.transactionHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                        castVote
                      </span>
                    </td>
                    <td className="px-4 py-3 text-purple-700 font-semibold">
                      {shortenHash(tx.event.nullifierHash, 8, 6)}
                    </td>
                    <td className="px-4 py-3 font-bold text-zinc-900 font-sans">
                      Candidate #{tx.event.candidateId}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{tx.gasUsed}</td>
                    <td className="px-4 py-3 font-sans">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                        CONFIRMED ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Transaction Inspector */}
      {selectedTx && (
        <div className="bg-[#18181b] rounded-[28px] p-6 text-white space-y-3 font-mono text-xs shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="font-bold text-sm text-zinc-200 font-sans">Transaction Inspector</span>
            <button
              onClick={() => setSelectedTx(null)}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 rounded-md font-sans"
            >
              Close
            </button>
          </div>

          <div className="space-y-1.5 text-zinc-300">
            <div><span className="text-zinc-500">Tx Hash: </span>{selectedTx.transactionHash}</div>
            <div><span className="text-zinc-500">Block: </span>#{selectedTx.blockNumber}</div>
            <div><span className="text-zinc-500">Nullifier: </span>{selectedTx.event.nullifierHash}</div>
            <div><span className="text-zinc-500">Candidate: </span>Candidate #{selectedTx.event.candidateId}</div>
          </div>
        </div>
      )}

      {/* Recent Mined Blocks */}
      <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-zinc-200 space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Recent Mined Blocks</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Chained with Keccak-256 cryptographic parent hashes
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500">Height: #{blocks[0]?.blockNumber}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blocks.slice(0, 6).map((block) => (
            <div
              key={block.hash}
              className="bg-[#f4f4f6] rounded-2xl p-5 space-y-2.5 font-mono text-xs border border-zinc-200/60"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 text-sm">Block #{block.blockNumber}</span>
                <span className="text-zinc-400 font-sans text-[11px]">
                  {new Date(block.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase font-sans">Hash</span>
                <span className="text-zinc-700 truncate block">{shortenHash(block.hash, 10, 8)}</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 flex items-center justify-between font-sans text-[11px]">
                <span className="text-zinc-500">{block.transactions.length} Tx</span>
                <span className="text-emerald-600 font-semibold">Validator Signed ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
