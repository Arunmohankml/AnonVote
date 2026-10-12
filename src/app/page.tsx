"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { StudentVoting } from "@/components/StudentVoting";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AuditLedger } from "@/components/AuditLedger";
import { InsightsAI } from "@/components/InsightsAI";
import { PitchDeck } from "@/components/PitchDeck";
import { electionStore } from "@/lib/storage";
import { blockchain } from "@/lib/blockchain";
import { Globe, MessageCircle, Share2, Mail, ArrowUpRight } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "vote" | "admin" | "ledger" | "insights" | "slides"
  >("vote");
  const [blockNumber, setBlockNumber] = useState(1048571);
  const [copiedDemo, setCopiedDemo] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const blocks = blockchain.getBlocks();
    if (blocks.length > 0) {
      setBlockNumber(blocks[0].blockNumber);
    }
  }, [refreshKey]);

  const handleCopyDemoCreds = () => {
    const demoInfo = "Session ID: ELX-7F92KQ\nVoter ID: 2f39s2Hh";
    navigator.clipboard.writeText(demoInfo);
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 2500);
  };

  const handleTriggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const defaultElection = electionStore.getElections()[0];

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-zinc-900 selection:text-white">
      {/* Navbar (Nerdstack Signature Style) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCopyDemoCreds={handleCopyDemoCreds}
        copiedDemo={copiedDemo}
        blockNumber={blockNumber}
      />

      {/* Main Viewport */}
      <main className="flex-1">
        {activeTab === "vote" && (
          <>
            <StudentVoting
              onVoteCastSuccess={handleTriggerRefresh}
              onNavigateToLedger={() => setActiveTab("ledger")}
            />

            {/* ============================================================ */}
            {/* DARK SECTION (Exact Match to Image 3 in Nerdstack Template)  */}
            {/* ============================================================ */}
            <section className="bg-[#111113] text-white py-24 sm:py-32 my-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                
                {/* Section Title */}
                <div className="max-w-3xl space-y-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-semibold text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
                    <span>CRYPTOGRAPHIC CERTAINTY</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight">
                    Turn centralized mistrust into predictable clarity
                  </h2>
                </div>

                {/* 3 Dark Bento Cards (Exact Match to Image 3) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Dark Card 1: Time Distribution */}
                  <div className="bg-[#18181b] rounded-[32px] p-8 space-y-8 border border-zinc-800 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <span className="text-xs font-mono text-zinc-400">⏱ Time Distribution</span>
                        <p className="text-2xl font-bold font-mono text-white">24 total cycles</p>
                      </div>

                      {/* Multi-color Pill Bar (Matches Image 3 Left Inset) */}
                      <div className="h-3 w-full rounded-full bg-zinc-800 flex overflow-hidden p-0.5 gap-1">
                        <div className="w-[20%] bg-emerald-400 rounded-full" />
                        <div className="w-[30%] bg-blue-400 rounded-full" />
                        <div className="w-[35%] bg-purple-400 rounded-full" />
                        <div className="w-[15%] bg-zinc-400 rounded-full" />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-zinc-400">
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>EXPLAIN</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400" />
                          <span>DEBUG</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-purple-400" />
                          <span>REVIEW</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-zinc-400" />
                          <span>DOCS</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed pt-4 border-t border-zinc-800">
                      <strong className="text-white">Maps how voter eligibility is checked</strong> across institutions, departments, and councils.
                    </p>
                  </div>

                  {/* Dark Card 2: 37 Issues / Wave Graph (Matches Image 3 Center Inset) */}
                  <div className="bg-[#18181b] rounded-[32px] p-8 space-y-8 border border-zinc-800 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-zinc-400">37 issues prevented</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                          0 CRITICAL
                        </span>
                      </div>

                      {/* Smooth Wavy Graph */}
                      <div className="h-28 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 240 70" fill="none">
                          <path
                            d="M 10 35 Q 60 5, 120 40 T 230 20"
                            stroke="#f87171"
                            strokeWidth="2.5"
                            fill="none"
                          />
                          <path
                            d="M 10 50 Q 70 65, 130 25 T 230 45"
                            stroke="#fde047"
                            strokeWidth="2"
                            fill="none"
                            opacity="0.8"
                          />
                        </svg>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-800">
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-red-400" />
                          <span>CRITICAL</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-yellow-400" />
                          <span>WARNING</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-zinc-500" />
                          <span>DEPRECATED</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed pt-4 border-t border-zinc-800">
                      <strong className="text-white">Shows how integrity evolves</strong> across cast ballots so administrators can detect anomalies early.
                    </p>
                  </div>

                  {/* Dark Card 3: Stacked Feature Items (Matches Image 3 Right Inset) */}
                  <div className="bg-[#18181b] rounded-[32px] p-8 space-y-6 border border-zinc-800 flex flex-col justify-between">
                    <div className="space-y-3">
                      
                      <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                          ✓
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Double-vote Revert</p>
                          <p className="text-[11px] text-zinc-400">Permanent nullifier spend lock</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center text-xs font-bold font-mono">
                          ⚡
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Zero-PII On Chain</p>
                          <p className="text-[11px] text-zinc-400">No name or email stored in EVM</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center text-xs font-bold font-mono">
                          Ω
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">iNSIGHTS Anomaly Detector</p>
                          <p className="text-[11px] text-zinc-400">Continuous AI telemetry audit</p>
                        </div>
                      </div>

                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed pt-4 border-t border-zinc-800">
                      <strong className="text-white">Highlights hidden patterns</strong> your election committee might miss in day-to-day voting.
                    </p>
                  </div>

                </div>

              </div>
            </section>
          </>
        )}

        {activeTab === "admin" && (
          <AdminDashboard onRefresh={handleTriggerRefresh} />
        )}

        {activeTab === "ledger" && (
          <AuditLedger onReset={handleTriggerRefresh} />
        )}

        {activeTab === "insights" && defaultElection && (
          <InsightsAI election={defaultElection} />
        )}

        {activeTab === "slides" && (
          <PitchDeck onJumpToTab={(tab) => setActiveTab(tab)} />
        )}
      </main>

      {/* ============================================================ */}
      {/* NERDSTACK FOOTER WITH TOP PASTEL AURA (Exact Match to Image 1) */}
      {/* ============================================================ */}
      <section className="pastel-aura-subtle pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white rounded-[36px] sm:rounded-[44px] p-10 sm:p-16 border border-zinc-200/80 shadow-sm space-y-12">
          
          {/* 3 Columns matching Image 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-[#f87171] rotate-45 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white -rotate-45" />
                </div>
                <span className="font-bold text-lg text-zinc-900">AnonVote</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
                Privacy-preserving micro-voting platform developed for SRM Institute of Science and Technology, Chennai.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Company</p>
              <ul className="space-y-2 text-zinc-600 text-xs sm:text-sm">
                <li><button onClick={() => setActiveTab("vote")} className="hover:text-zinc-950">Home A</button></li>
                <li><button onClick={() => setActiveTab("admin")} className="hover:text-zinc-950">Home B</button></li>
                <li><button onClick={() => setActiveTab("ledger")} className="hover:text-zinc-950">Home C</button></li>
                <li><button onClick={() => setActiveTab("slides")} className="hover:text-zinc-950">About</button></li>
                <li><span className="text-zinc-400">Case Studies</span></li>
                <li><span className="text-zinc-400">Blog</span></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Product</p>
              <ul className="space-y-2 text-zinc-600 text-xs sm:text-sm">
                <li><button onClick={() => setActiveTab("vote")} className="hover:text-zinc-950">Voting Terminal</button></li>
                <li><button onClick={() => setActiveTab("admin")} className="hover:text-zinc-950">Admin Hub</button></li>
                <li><button onClick={() => setActiveTab("ledger")} className="hover:text-zinc-950">EVM Smart Contract</button></li>
                <li className="flex items-center space-x-2">
                  <button onClick={() => setActiveTab("insights")} className="hover:text-zinc-950">iNSIGHTS AI</button>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">NEW</span>
                </li>
                <li><button onClick={() => setActiveTab("slides")} className="hover:text-zinc-950">Presentation Deck</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">More</p>
              <ul className="space-y-2 text-zinc-600 text-xs sm:text-sm">
                <li><span className="hover:text-zinc-950 cursor-pointer">FAQ</span></li>
                <li><span className="hover:text-zinc-950 cursor-pointer">Legal</span></li>
                <li><span className="hover:text-zinc-950 cursor-pointer">SDG 16 Compliance</span></li>
                <li><span className="hover:text-zinc-950 cursor-pointer">SDG 9 Infrastructure</span></li>
                <li><span className="hover:text-zinc-950 cursor-pointer">SRM IST Chennai</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar matching Image 1 */}
          <div className="pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-medium">
            <div className="flex flex-wrap items-center gap-4">
              <span>© AnonVote powered by iNSIGHTS</span>
              <span>•</span>
              <span className="hover:text-zinc-700 cursor-pointer">Changelog</span>
              <span className="hover:text-zinc-700 cursor-pointer">Style Guide</span>
              <span className="hover:text-zinc-700 cursor-pointer">SRM Chennai</span>
            </div>

            <div className="flex items-center space-x-4 text-zinc-500">
              <Globe className="w-4 h-4 hover:text-zinc-900 cursor-pointer" />
              <MessageCircle className="w-4 h-4 hover:text-zinc-900 cursor-pointer" />
              <Share2 className="w-4 h-4 hover:text-zinc-900 cursor-pointer" />
              <Mail className="w-4 h-4 hover:text-zinc-900 cursor-pointer" />
            </div>
          </div>

        </div>
      </section>

      {/* Floating Bottom Left Page Badge (Nerdstack Template Signature Detail) */}
      <div className="fixed bottom-5 left-5 z-40 flex items-center space-x-1.5 p-1 bg-[#111113] text-white rounded-xl shadow-lg text-[11px] font-semibold">
        <button
          onClick={() => setActiveTab("slides")}
          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center space-x-1 cursor-pointer"
        >
          <span>Pages</span>
          <span className="text-[9px]">^</span>
        </button>
        <span className="px-2 py-1 rounded-lg bg-amber-400 text-zinc-950 font-bold">
          Ultra
        </span>
        <button
          onClick={() => setActiveTab("vote")}
          className="px-2.5 py-1 rounded-lg hover:bg-zinc-800 cursor-pointer"
        >
          Vote
        </button>
      </div>

    </div>
  );
}
