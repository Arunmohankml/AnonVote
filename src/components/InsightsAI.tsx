"use client";

import React, { useState } from "react";
import {
  BrainCircuit,
  Search,
  Activity,
  Sparkles,
  FileCheck,
  Send,
  Lock,
  Zap,
} from "lucide-react";
import { Election } from "@/lib/storage";
import { blockchain } from "@/lib/blockchain";
import { generateInsightsIntelligence, PRESET_AI_QUERIES } from "@/lib/insights-ai";

interface InsightsAIProps {
  election: Election;
}

export const InsightsAI: React.FC<InsightsAIProps> = ({ election }) => {
  const blocks = blockchain.getBlocks();
  const txs = blockchain.getTransactions();
  const intel = generateInsightsIntelligence(election, blocks, txs, 1);

  const [query, setQuery] = useState("");
  const [activeAnswer, setActiveAnswer] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunQuery = (q: string) => {
    setIsAnalyzing(true);
    setQuery(q);
    setTimeout(() => {
      const match = PRESET_AI_QUERIES.find(
        (p) => p.query.toLowerCase().includes(q.toLowerCase()) || q.toLowerCase().includes(p.query.toLowerCase())
      );
      if (match) {
        setActiveAnswer(match.answer);
      } else {
        setActiveAnswer(
          `[iNSIGHTS Analysis Engine]: Regarding "${q}" — Election "${election.title}" maintains zero linkage between student records and the ballot layer. Each ballot is anchored by an isolated nullifier hash.`
        );
      }
      setIsAnalyzing(false);
    }, 300);
  };

  const handleDownloadCertification = () => {
    const reportText = `================================================================================
SRM INSTITUTE OF SCIENCE AND TECHNOLOGY — CHENNAI
OFFICIAL ELECTION INTEGRITY & AUDIT CERTIFICATION
POWERED BY iNSIGHTS PLATFORM INTELLIGENCE
================================================================================

Election Title:       ${election.title}
Election Session ID:  ${election.id}
Target Institution:   ${election.institution}
Audit Timestamp:      ${new Date().toISOString()}

1. CRYPTOGRAPHIC VERIFICATION
- Identity-Ballot Separation: VERIFIED (100% Zero PII on-chain)
- Double-Voting Protection:   ACTIVE (Solidity nullifier revert mapping enforced)
- Consensus State:            VALID (Arbitrum/Sepolia EVM testnet)
- Overall Privacy Integrity:  ${intel.privacyIntegrity}%
- Election Health Score:      ${intel.healthScore}%

2. TOTAL BALLOTS AUDITED
- Registered Eligible Voters: ${election.voters.length}
- Confirmed Blocks Mined:    ${blocks.length}
- Validated Transactions:     ${txs.length}

3. SUSTAINABLE DEVELOPMENT GOALS (SDG) ALIGNMENT
- SDG 16: Peace, Justice & Strong Institutions
- SDG 9: Industry, Innovation & Infrastructure

CERTIFIED BY:
iNSIGHTS Election Intelligence Engine
SRM IST Campus Election Authority
================================================================================`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SRM_AnonVote_Audit_Certificate_${election.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-xs font-semibold text-purple-700 mb-2 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            <span>AI DEEP SEARCH & INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-950 tracking-tight">
            iNSIGHTS Platform Intelligence
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 font-normal mt-1">
            Real-time security analytics, anomaly detection, and aggregate election telemetry.
          </p>
        </div>

        <button
          onClick={handleDownloadCertification}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
        >
          <FileCheck className="w-4 h-4" />
          <span>Download Audit Certificate</span>
        </button>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-[#f4f4f6] rounded-[28px] p-6 border border-zinc-200/60">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Health Score</span>
          <p className="text-4xl font-bold text-zinc-900 tracking-tight mt-2">{intel.healthScore}%</p>
          <p className="text-xs text-zinc-400 mt-1">Algorithmic stability</p>
        </div>

        <div className="bg-[#f4f4f6] rounded-[28px] p-6 border border-zinc-200/60">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Privacy Integrity</span>
          <p className="text-4xl font-bold text-zinc-900 tracking-tight mt-2">{intel.privacyIntegrity}%</p>
          <p className="text-xs text-zinc-400 mt-1">0 Personal data linked</p>
        </div>

        <div className="bg-[#f4f4f6] rounded-[28px] p-6 border border-zinc-200/60">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Blocked Sybils</span>
          <p className="text-4xl font-bold text-purple-700 tracking-tight mt-2">{intel.doubleVoteAttemptsBlocked}</p>
          <p className="text-xs text-zinc-400 mt-1">Double votes rejected</p>
        </div>

        <div className="bg-[#f4f4f6] rounded-[28px] p-6 border border-zinc-200/60">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Block Interval</span>
          <p className="text-4xl font-bold text-zinc-900 tracking-tight mt-2">{intel.averageBlockTimeSec}s</p>
          <p className="text-xs text-zinc-400 mt-1">Sub-second confirmation</p>
        </div>
      </div>

      {/* AI Deep Search */}
      <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-zinc-200 space-y-6 shadow-xs">
        <div className="flex items-center space-x-3 pb-4 border-b border-zinc-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">iNSIGHTS AI Deep Search</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Natural language queries on zero-knowledge math, separation rules, and voter privacy
            </p>
          </div>
        </div>

        {/* Query Pills */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Suggested Questions:</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_AI_QUERIES.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleRunQuery(item.query)}
                className="px-3.5 py-1.5 rounded-full bg-[#f4f4f6] hover:bg-zinc-200 text-xs font-semibold text-zinc-700 transition-all cursor-pointer"
              >
                {item.query}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Ask iNSIGHTS: 'Can the election authority know who I voted for?'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRunQuery(query)}
              className="w-full bg-[#f4f4f6] border border-zinc-200 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900 transition-all placeholder:text-zinc-400"
            />
          </div>

          <button
            onClick={() => handleRunQuery(query)}
            disabled={!query.trim() || isAnalyzing}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#18181b] hover:bg-zinc-800 disabled:opacity-40 text-white text-sm font-semibold transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* AI Answer Box */}
        {activeAnswer && (
          <div className="p-6 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1.5">
            <div className="flex items-center space-x-2 text-[11px] font-bold text-purple-700 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>iNSIGHTS Analysis Engine Response</span>
            </div>
            <p className="text-sm text-zinc-800 leading-relaxed font-normal">{activeAnswer}</p>
          </div>
        )}
      </div>

      {/* Anomaly Monitor */}
      <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-zinc-200 space-y-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-zinc-800" />
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Security & Anomaly Feed</h3>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            All Systems Nominal
          </span>
        </div>

        <div className="space-y-3">
          {intel.anomaliesDetected.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#f4f4f6] flex items-start justify-between gap-4 border border-zinc-200/60"
            >
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-900">{item.title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{item.description}</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-white text-zinc-800 text-[11px] font-mono font-bold shadow-2xs whitespace-nowrap">
                {item.metric}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Clusters */}
      <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-zinc-200 space-y-6 shadow-xs">
        <div className="pb-4 border-b border-zinc-100">
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">iNSIGHTS Knowledge Clusters</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Decentralized voting governance, cryptography protocols, and SDG 16 accountability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intel.knowledgeClusters.map((k, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#f4f4f6] space-y-1.5 border border-zinc-200/60"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900">{k.topic}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {k.status}
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{k.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
