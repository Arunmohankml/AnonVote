"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Vote,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";

interface PitchDeckProps {
  onJumpToTab: (tab: "vote" | "admin" | "ledger" | "insights") => void;
}

export const PitchDeck: React.FC<PitchDeckProps> = ({ onJumpToTab }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 10;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setCurrentSlide((prev) => Math.max(prev - 1, 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Slide Navigation Bar */}
      <div className="flex items-center justify-between bg-white border border-zinc-200 px-6 py-4 rounded-2xl shadow-xs">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900 bg-zinc-100 px-3 py-1 rounded-full">
            Presentation Mode
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-sm font-semibold text-zinc-700">
            Slide {currentSlide} of {totalSlides}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="p-2 rounded-xl bg-[#f4f4f6] hover:bg-zinc-200 disabled:opacity-30 text-zinc-800 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="hidden sm:flex items-center space-x-1.5 px-3">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx + 1)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx + 1 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-200 hover:bg-zinc-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            className="p-2 rounded-xl bg-[#f4f4f6] hover:bg-zinc-200 disabled:opacity-30 text-zinc-800 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Canvas */}
      <div className="min-h-[580px] bg-white border border-zinc-200 rounded-[32px] p-8 sm:p-12 shadow-xs flex flex-col justify-between space-y-8">
        
        {/* SLIDE 1 */}
        {currentSlide === 1 && (
          <div className="space-y-8 my-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
                <span>SLIDE 1 — TITLE</span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight text-zinc-950 leading-[1.05]">
                ANONVOTE
              </h1>
              <p className="text-2xl sm:text-3xl text-zinc-600 font-medium">
                Privacy-Preserving Blockchain Voting for Campus Elections
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Problem Statement</span>
              <p className="text-xl sm:text-2xl text-zinc-900 font-medium italic leading-snug">
                &ldquo;How can we guarantee one-person-one-vote while preventing the election authority from knowing who voted for whom?&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-5 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60">
                <span className="text-xs text-zinc-400 uppercase font-semibold">Institution</span>
                <p className="text-zinc-900 font-bold text-base mt-1">SRM Institute of Science and Technology, Chennai</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60">
                <span className="text-xs text-zinc-400 uppercase font-semibold">Built using iNSIGHTS</span>
                <p className="text-zinc-900 font-bold text-base mt-1">Blockchain × Privacy Cryptography × AI Intelligence</p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2 */}
        {currentSlide === 2 && (
          <div className="space-y-8 my-auto">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                <span>SLIDE 2 — PROBLEM UNDERSTANDING</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold text-zinc-950 tracking-tight">
                Campus Voting Has a Trust Gap
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-2">
                <div className="text-2xl">🔐</div>
                <h4 className="text-base font-bold text-zinc-900">Privacy</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">A student&apos;s vote should remain unconditionally private.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-2">
                <div className="text-2xl">1️⃣</div>
                <h4 className="text-base font-bold text-zinc-900">Uniqueness</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Each eligible member must be able to vote only once.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-2">
                <div className="text-2xl">🔍</div>
                <h4 className="text-base font-bold text-zinc-900">Transparency</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Election results should be auditable & tamper-resistant.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-red-50/60 border border-red-200 space-y-2">
              <span className="text-xs font-bold uppercase text-red-700">The Flaw in Typical Centralized Systems</span>
              <div className="p-3 rounded-xl bg-white border border-red-200 font-mono text-xs text-red-700 font-bold">
                Student → Login / Voter ID → Database → Vote → Result
              </div>
              <p className="text-xs text-red-900 leading-relaxed">
                If the voting database stores voter identity alongside the ballot, the administrator can easily determine who voted for whom.
              </p>
            </div>

            <div className="text-xs text-zinc-500 flex flex-col sm:flex-row sm:items-center justify-between border-t border-zinc-100 pt-4 gap-2">
              <span><strong>Scale:</strong> 4.33 Crore higher education students in India (AISHE Data)</span>
              <span className="text-red-600 font-semibold">❌ Centralized Control • ❌ Weak Ballot Privacy</span>
            </div>
          </div>
        )}

        {/* SLIDE 3 */}
        {currentSlide === 3 && (
          <div className="space-y-8 my-auto">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                <span>SLIDE 3 — PROPOSED SOLUTION</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold text-zinc-950 tracking-tight">Our Solution: ANONVOTE</h2>
              <p className="text-base text-zinc-600 font-normal">
                Separates voter eligibility from the ballot while using blockchain to create a tamper-evident election record.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <span className="text-zinc-900 font-bold">Step 1 & 2</span>
                <p className="text-zinc-900 font-semibold">Upload Member List</p>
                <p className="text-zinc-500 text-[11px]">Members get random Voter ID (e.g. <code>2f39s2Hh</code>)</p>
              </div>

              <div className="p-4 rounded-xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <span className="text-zinc-900 font-bold">Step 3 & 4</span>
                <p className="text-zinc-900 font-semibold">Session ID Entry</p>
                <p className="text-zinc-500 text-[11px]">Admin creates <code>ELX-7F92KQ</code>. No account needed.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <span className="text-zinc-900 font-bold">Step 5</span>
                <p className="text-zinc-900 font-semibold">Anonymous Credential</p>
                <p className="text-zinc-500 text-[11px]">Eligibility verified, isolated nullifier generated.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <span className="text-zinc-900 font-bold">Step 6 & 7</span>
                <p className="text-zinc-900 font-semibold">Smart Contract Mint</p>
                <p className="text-zinc-500 text-[11px]">Ballot commits directly to blockchain.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-1">
                <span className="font-bold text-red-700">Existing Approach:</span>
                <p className="font-mono text-red-800">Identity + Vote ➔ Linkable in DB ❌</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-700">AnonVote Innovation:</span>
                <p className="font-mono text-emerald-800">Identity ➔ Eligibility | Credential ➔ Ballot ✅</p>
              </div>
            </div>

            <button
              onClick={() => onJumpToTab("vote")}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Test This Flow in Live App →</span>
            </button>
          </div>
        )}

        {/* SLIDE 4 */}
        {currentSlide === 4 && (
          <div className="space-y-8 my-auto">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                <span>SLIDE 4 — TECHNICAL ARCHITECTURE</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold text-zinc-950 tracking-tight">System Architecture & Tech Stack</h2>
            </div>

            <div className="p-6 rounded-2xl bg-[#18181b] text-white font-mono text-xs leading-relaxed overflow-x-auto shadow-md">
              <pre>{`ADMIN (Create Election) ──► NEXT.JS APP (Student Voting & Admin Dashboard)
                                   │
                                   ▼
                         Backend API / Node.js
                         ┌─────────┴─────────┐
                         ▼                   ▼
                  PostgreSQL / Registry    Smart Contract (Solidity)
                 (Eligibility & Voter IDs)          │
                                                    ▼
                                           Blockchain Ledger
                                           (Anonymous Ballot)`}</pre>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#f4f4f6] border border-zinc-200/60">
                <span className="text-zinc-400 uppercase text-[10px] font-bold block">Frontend</span>
                <strong className="text-zinc-900 text-sm">Next.js + Tailwind</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f4f4f6] border border-zinc-200/60">
                <span className="text-zinc-400 uppercase text-[10px] font-bold block">Smart Contract</span>
                <strong className="text-zinc-900 text-sm">Solidity + EVM</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f4f4f6] border border-zinc-200/60">
                <span className="text-zinc-400 uppercase text-[10px] font-bold block">Cryptographic Layer</span>
                <strong className="text-zinc-900 text-sm">Nullifiers + ethers.js</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f4f4f6] border border-zinc-200/60">
                <span className="text-zinc-400 uppercase text-[10px] font-bold block">AI & Research</span>
                <strong className="text-purple-700 text-sm">iNSIGHTS Platform</strong>
              </div>
            </div>

            <button
              onClick={() => onJumpToTab("ledger")}
              className="inline-flex items-center space-x-1.5 text-xs text-zinc-900 hover:underline font-bold"
            >
              <span>Inspect Live Contract & Blocks on Ledger →</span>
            </button>
          </div>
        )}

        {/* SLIDE 5 */}
        {currentSlide === 5 && (
          <div className="space-y-8 my-auto">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                <span>SLIDE 5 — INNOVATION & NOVELTY</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold text-zinc-950 tracking-tight">What Makes AnonVote Different?</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <strong className="text-zinc-900 text-sm">1. Identity–Ballot Separation</strong>
                <p className="text-zinc-500">
                  Separates &quot;Who is eligible?&quot; from &quot;What did they vote for?&quot; mathematically.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <strong className="text-zinc-900 text-sm">2. No Voter Account Required</strong>
                <p className="text-zinc-500">
                  No username, password, social OAuth, or personal crypto wallet required for students.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <strong className="text-zinc-900 text-sm">3. One-Time Anonymous Credential</strong>
                <p className="text-zinc-500">
                  Valid Credential ➔ Accepted | Used Credential ➔ Reverted | Invalid ➔ Reverted.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <strong className="text-purple-700 text-sm">4. iNSIGHTS-Powered Intelligence</strong>
                <p className="text-zinc-500">
                  AI Deep Search, Anomaly Detection, Knowledge Clusters, and governance audit.
                </p>
              </div>
            </div>

            <button
              onClick={() => onJumpToTab("insights")}
              className="inline-flex items-center space-x-1.5 text-xs text-purple-700 hover:underline font-bold"
            >
              <span>Explore iNSIGHTS AI Features →</span>
            </button>
          </div>
        )}

        {/* SLIDE 6 */}
        {currentSlide === 6 && (
          <div className="space-y-8 my-auto">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                <span>SLIDE 6 — FEASIBILITY & VIABILITY</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold text-zinc-950 tracking-tight">Can We Build It in 24 Hours? YES!</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2.5">
                <h4 className="font-bold text-emerald-800 uppercase text-xs">24-Hour MVP (Completed & Live)</h4>
                <ul className="space-y-1.5 text-zinc-700 font-medium">
                  <li>✅ Admin election & candidate creation</li>
                  <li>✅ Random Voter IDs & Session IDs</li>
                  <li>✅ Student voting interface</li>
                  <li>✅ One-time voting protection & Nullifiers</li>
                  <li>✅ Solidity smart contract & blockchain recording</li>
                  <li>✅ Live aggregate results & iNSIGHTS integration</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-2.5">
                <h4 className="font-bold text-zinc-500 uppercase text-xs">Scoped Out for Hackathon</h4>
                <ul className="space-y-1.5 text-zinc-400">
                  <li>❌ National election infrastructure</li>
                  <li>❌ Government biometric authentication</li>
                  <li>❌ Heavy hardware tokens</li>
                </ul>
                <p className="text-[11px] text-zinc-500 pt-3 border-t border-zinc-200">
                  Focusing strictly on campus scale ensures 100% feasibility!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 7 */}
        {currentSlide === 7 && (
          <div className="space-y-8 my-auto">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                <span>SLIDE 7 — IMPACT & MEASURABLE TARGETS</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold text-zinc-950 tracking-tight">Quantifiable Impact & SDG Alignment</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-5 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60">
                <p className="text-4xl font-bold text-zinc-900">100%</p>
                <p className="text-xs text-zinc-500 mt-1">Pre-checked Eligibility</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60">
                <p className="text-4xl font-bold text-emerald-600">1</p>
                <p className="text-xs text-zinc-500 mt-1">Max Ballot / Credential</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60">
                <p className="text-4xl font-bold text-purple-700">0</p>
                <p className="text-xs text-zinc-500 mt-1">PII Stored on Chain</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60">
                <p className="text-4xl font-bold text-zinc-900">&lt; 1 min</p>
                <p className="text-xs text-zinc-500 mt-1">Voter Time</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <span className="text-zinc-900 font-bold">SDG 16: Peace, Justice & Strong Institutions</span>
                <p className="text-zinc-500">Transparent institutions, accountable processes, auditable digital governance.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <span className="text-zinc-900 font-bold">SDG 9: Industry, Innovation & Infrastructure</span>
                <p className="text-zinc-500">Decentralized blockchain infrastructure & privacy-preserving cryptography.</p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 8 */}
        {currentSlide === 8 && (
          <div className="space-y-8 my-auto">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                <span>SLIDE 8 — PROTOTYPE / DEMO FLOW</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold text-zinc-950 tracking-tight">Live Working MVP Prototype</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div
                onClick={() => onJumpToTab("admin")}
                className="p-4 rounded-2xl bg-[#f4f4f6] border border-zinc-200 hover:border-zinc-900 cursor-pointer space-y-1 transition-all"
              >
                <span className="text-[10px] text-zinc-400 font-bold">SCREEN 1</span>
                <p className="font-bold text-zinc-900">Admin Creation</p>
                <p className="text-zinc-500 text-[11px]">Create election, setup candidates</p>
              </div>

              <div
                onClick={() => onJumpToTab("vote")}
                className="p-4 rounded-2xl bg-[#f4f4f6] border border-zinc-200 hover:border-zinc-900 cursor-pointer space-y-1 transition-all"
              >
                <span className="text-[10px] text-zinc-400 font-bold">SCREEN 2</span>
                <p className="font-bold text-zinc-900">Voter Auth</p>
                <p className="text-zinc-500 text-[11px]">Session ID + Voter ID</p>
              </div>

              <div
                onClick={() => onJumpToTab("vote")}
                className="p-4 rounded-2xl bg-[#f4f4f6] border border-zinc-200 hover:border-zinc-900 cursor-pointer space-y-1 transition-all"
              >
                <span className="text-[10px] text-zinc-400 font-bold">SCREEN 3</span>
                <p className="font-bold text-zinc-900">Cast Ballot</p>
                <p className="text-zinc-500 text-[11px]">Anonymous smart contract mint</p>
              </div>

              <div
                onClick={() => onJumpToTab("admin")}
                className="p-4 rounded-2xl bg-[#f4f4f6] border border-zinc-200 hover:border-zinc-900 cursor-pointer space-y-1 transition-all"
              >
                <span className="text-[10px] text-zinc-400 font-bold">SCREEN 4</span>
                <p className="font-bold text-zinc-900">Admin Results</p>
                <p className="text-zinc-500 text-[11px]">Blockchain verified telemetries</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#f4f4f6] border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-zinc-700">
                <strong>Demo Flow:</strong> Create Election ➔ Voter IDs ➔ Vote ➔ Attempt Second Vote (Rejection) ➔ Show Blockchain ➔ iNSIGHTS Analysis
              </div>
              <button
                onClick={() => onJumpToTab("vote")}
                className="px-5 py-2.5 rounded-xl bg-[#18181b] text-white text-xs font-semibold hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Launch Demo Now
              </button>
            </div>
          </div>
        )}

        {/* SLIDE 9 */}
        {currentSlide === 9 && (
          <div className="space-y-8 my-auto">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                <span>SLIDE 9 — 24-HOUR PLAN & TEAM ROLES</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold text-zinc-950 tracking-tight">Grand Finale Execution & Team Synergy</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <span className="text-zinc-900 font-bold">Member 1</span>
                <p className="text-zinc-900 font-semibold">Blockchain</p>
                <p className="text-zinc-500 text-[11px]">Solidity, Smart Contract & EVM</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <span className="text-zinc-900 font-bold">Member 2</span>
                <p className="text-zinc-900 font-semibold">Backend</p>
                <p className="text-zinc-500 text-[11px]">PostgreSQL, APIs, Eligibility</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <span className="text-zinc-900 font-bold">Member 3</span>
                <p className="text-zinc-900 font-semibold">Frontend</p>
                <p className="text-zinc-500 text-[11px]">Next.js, Voting Terminal & UI</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#18181b] text-white space-y-1 shadow-xs">
                <span className="text-purple-300 font-bold">Member 4</span>
                <p className="text-white font-semibold">iNSIGHTS AI</p>
                <p className="text-zinc-400 text-[11px]">AI Search & Anomaly Detection</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-1">
                <span className="text-zinc-900 font-bold">Member 5</span>
                <p className="text-zinc-900 font-semibold">UI / Security</p>
                <p className="text-zinc-500 text-[11px]">Testing, UX & Pitch Demo</p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 10 */}
        {currentSlide === 10 && (
          <div className="space-y-8 my-auto text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
              <span>SLIDE 10 — FINAL / WHY US</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-semibold text-zinc-950 tracking-tight leading-tight max-w-2xl mx-auto">
              &ldquo;Verify the voter. Protect the ballot. Trust the result.&rdquo;
            </h2>

            <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#f4f4f6] border border-zinc-200/60 space-y-2">
              <span className="text-zinc-900 font-bold uppercase text-[11px]">Our Core Promise</span>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-zinc-700 font-medium">
                <div className="p-2 rounded-lg bg-white">🔐 Protect Voter</div>
                <div className="p-2 rounded-lg bg-white">1️⃣ One Person One Vote</div>
                <div className="p-2 rounded-lg bg-white">🔗 Auditable Ledger</div>
                <div className="p-2 rounded-lg bg-white">🤖 AI Intelligence</div>
              </div>
            </div>

            <div className="text-xs text-zinc-500 space-y-0.5">
              <p className="font-semibold text-zinc-800">Built using iNSIGHTS + Blockchain + Privacy Cryptography</p>
              <p>SRM Institute of Science and Technology, Chennai</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onJumpToTab("vote")}
                className="px-7 py-3.5 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                ENTER LIVE ANONVOTE APPLICATION ➔
              </button>
            </div>
          </div>
        )}

        {/* Slide Footer */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-6 border-t border-zinc-100">
          <span>SRM IST Chennai • ANONVOTE</span>
          <span>Use &larr; / &rarr; keys to navigate slides</span>
        </div>

      </div>
    </div>
  );
};
