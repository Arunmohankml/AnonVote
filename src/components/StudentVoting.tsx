"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  ExternalLink,
  Copy,
  Check,
  FileCheck2,
  Zap,
  Activity,
  Award,
  Layers,
  Sparkles,
} from "lucide-react";
import { electionStore, Election, Candidate } from "@/lib/storage";
import { generateAnonymousCredential, AnonymousCredential, shortenHash } from "@/lib/crypto";
import { blockchain, TransactionReceipt } from "@/lib/blockchain";

interface StudentVotingProps {
  onVoteCastSuccess: () => void;
  onNavigateToLedger: () => void;
}

export const StudentVoting: React.FC<StudentVotingProps> = ({
  onVoteCastSuccess,
  onNavigateToLedger,
}) => {
  // Input fields
  const [sessionId, setSessionId] = useState("ELX-7F92KQ");
  const [voterId, setVoterId] = useState("2f39s2Hh");

  // Flow states
  const [step, setStep] = useState<"AUTH" | "SELECT" | "SUBMITTING" | "SUCCESS">("AUTH");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Active verified session data
  const [activeElection, setActiveElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [credential, setCredential] = useState<AnonymousCredential | null>(null);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);

  // Copy states
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedNullifier, setCopiedNullifier] = useState(false);

  // Quick fill helper
  const handleQuickFill = (vId: string) => {
    setSessionId("ELX-7F92KQ");
    setVoterId(vId);
    setErrorMessage(null);
    setWarningMessage(null);
  };

  // Verify eligibility & generate anonymous one-time credential
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setWarningMessage(null);

    const sId = sessionId.trim().toUpperCase();
    const vId = voterId.trim();

    if (!sId || !vId) {
      setErrorMessage("Please enter both Session ID and Voter ID.");
      return;
    }

    const election = electionStore.getElectionById(sId);
    if (!election) {
      setErrorMessage(`Election with Session ID '${sId}' not found. Please verify the code.`);
      return;
    }

    if (!election.isActive) {
      setErrorMessage("This election is currently closed or paused by the administrator.");
      return;
    }

    const voter = election.voters.find(
      (v) => v.voterId.toLowerCase() === vId.toLowerCase()
    );

    if (!voter) {
      setErrorMessage(`Voter ID '${vId}' is not registered on the eligible voter list.`);
      return;
    }

    if (voter.hasVoted) {
      setErrorMessage(
        `ACCESS DENIED: Voter ID '${vId}' has already cast a ballot. One-person-one-vote enforced.`
      );
      return;
    }

    const anonCred = generateAnonymousCredential(election.id, voter.voterId);

    if (blockchain.isNullifierUsed(election.id, anonCred.nullifierHash)) {
      setErrorMessage("Cryptographic Nullifier has already been recorded on the blockchain ledger.");
      return;
    }

    electionStore.markCredentialClaimed(election.id, voter.voterId);

    setActiveElection(election);
    setCredential(anonCred);
    setStep("SELECT");
  };

  // Submit anonymous vote directly to the Smart Contract
  const handleSubmitVote = async () => {
    if (!activeElection || !selectedCandidate || !credential) {
      setErrorMessage("Please select a candidate before submitting.");
      return;
    }

    setStep("SUBMITTING");
    setErrorMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 850));

      const txReceipt = await blockchain.castVote(
        activeElection.id,
        credential.nullifierHash,
        selectedCandidate
      );

      electionStore.markVoted(activeElection.id, voterId.trim());

      setReceipt(txReceipt);
      setStep("SUCCESS");
      onVoteCastSuccess();

      try {
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      } catch {}
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error casting vote on blockchain";
      setErrorMessage(msg);
      setStep("SELECT");
    }
  };

  // Second Vote Rejection Demo (Prove core problem is solved!)
  const handleTestSecondVote = async () => {
    setWarningMessage(null);
    setErrorMessage(null);

    if (!activeElection || !credential) return;

    try {
      await blockchain.castVote(activeElection.id, credential.nullifierHash, 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Smart contract rejected duplicate vote.";
      setWarningMessage(`🛡️ REVERT PROOF CONFIRMED: "${msg}"`);
    }
  };

  const copyToClipboard = (text: string, type: "tx" | "nullifier") => {
    navigator.clipboard.writeText(text);
    if (type === "tx") {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } else {
      setCopiedNullifier(true);
      setTimeout(() => setCopiedNullifier(false), 2000);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* ============================================================ */}
      {/* HERO SECTION (Matches Image 5: Top Pill, Big Heading, CTA) */}
      {/* ============================================================ */}
      <section className="pt-16 sm:pt-24 pb-12 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-7">
        
        {/* Top Pill Tag (Nerdstack Signature Style) */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-50 border border-zinc-200/80 text-[13px] font-medium text-zinc-600 shadow-2xs">
          <span className="w-2 h-2 rounded-xs bg-[#f87171]" />
          <span className="tracking-wide">ZERO-KNOWLEDGE VOTING PROTOCOL</span>
        </div>

        {/* Hero Main Heading (Nerdstack Typography) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-zinc-950 leading-[1.08] max-w-4xl mx-auto">
          From cryptic logic to clean ballot integrity in seconds
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-zinc-500 font-normal max-w-2xl mx-auto leading-relaxed">
          Decentralized campus elections separating voter identity from the ballot. Verify eligibility once, cast an anonymous cryptographic nullifier on the blockchain.
        </p>

        {/* Quick CTA */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              const el = document.getElementById("terminal");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-7 py-3.5 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-white text-[15px] font-medium transition-all shadow-sm flex items-center space-x-2 cursor-pointer group"
          >
            <span>Cast Anonymous Vote</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleQuickFill("2f39s2Hh")}
            className="px-6 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[15px] font-medium transition-all cursor-pointer"
          >
            Load Slide 3 Demo Pass (2f39s2Hh)
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3-CARD BENTO GRID (Exact Match to Image 2 in Nerdstack) */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Protocol / Timeline Inset */}
          <div className="bg-[#f4f4f6] rounded-[32px] p-8 flex flex-col justify-between space-y-8 border border-zinc-200/50">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-white border border-zinc-200 text-xs font-semibold uppercase tracking-wider text-zinc-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>PROTOCOL</span>
              </div>
              <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight leading-snug">
                See failures before they spread through your election
              </h3>
            </div>

            {/* Inset Dark Card (Matches Image 2 Left Card) */}
            <div className="bg-[#18181b] rounded-2xl p-6 text-white space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">0 PII on-chain</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-emerald-400 font-mono">
                  100% UNLINKABLE
                </span>
              </div>

              {/* Wave SVG Illustration */}
              <div className="h-24 flex items-center justify-center relative">
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

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span>CRITICAL CHECK</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span>ONE-PERSON-ONE-VOTE</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Identity Separation / Review (Matches Image 2 Center Card) */}
          <div className="bg-[#f4f4f6] rounded-[32px] p-8 flex flex-col justify-between space-y-8 border border-zinc-200/50">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-white border border-zinc-200 text-xs font-semibold uppercase tracking-wider text-zinc-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>SEPARATION</span>
              </div>
              <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight leading-snug">
                Understand how your vote decouples from your identity
              </h3>
            </div>

            {/* Inset Dark Card with PASS Badge */}
            <div className="bg-[#18181b] rounded-2xl p-6 text-white space-y-4 shadow-md">
              <p className="text-xs text-zinc-300 leading-relaxed">
                Summarizes voter eligibility check, token lifecycle rules, and isolated HMAC derivation — with zero student ID exposed on-chain.
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="px-3 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-bold font-mono">
                  PASS
                </span>
                <span className="text-xs text-zinc-400 font-mono">0x8920...43e7</span>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-zinc-800 text-xs text-zinc-400 font-mono">
                <span className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <span>AnonVote.sol Module</span>
              </div>
            </div>
          </div>

          {/* Card 3: Blockchain Audit Table (Matches Image 2 Right Card) */}
          <div className="bg-[#f4f4f6] rounded-[32px] p-8 flex flex-col justify-between space-y-8 border border-zinc-200/50">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-white border border-zinc-200 text-xs font-semibold uppercase tracking-wider text-zinc-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>AUDIT</span>
              </div>
              <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight leading-snug">
                Results and telemetry that stay accurate as voting unfolds
              </h3>
            </div>

            {/* Inset Table Card with ISSUE FOUND / PASS badges */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-400 text-[10px] font-bold uppercase pb-1 border-b border-zinc-100">
                <span>MODULE</span>
                <span>STATUS</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-800 font-medium">DoubleVoteCheck</span>
                <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200">
                  BLOCKED
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-800 font-medium">NullifierTally</span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                  PASS
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-800 font-medium">EVMConsensus</span>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                  SYNCED
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SPLIT INTERACTIVE SECTION (Matches Image 4: Pastel Aura Canvas) */}
      {/* ============================================================ */}
      <section id="terminal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Context & Explanations */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 py-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-zinc-100 text-xs font-semibold uppercase tracking-wider text-zinc-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
                <span>TERMINAL</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-950 tracking-tight leading-tight">
                Cast your ballot before election day closes
              </h2>

              <p className="text-base text-zinc-600 leading-relaxed font-normal">
                When student councils use centralized portals, administrators can view voter records. AnonVote verifies your Voter ID once, issues an isolated nullifier, and mints your vote directly to the smart contract.
              </p>
            </div>

            {/* Quick Test Pass Helper Pills */}
            <div className="p-5 rounded-2xl bg-[#f4f4f6] border border-zinc-200 space-y-3">
              <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Pre-authorized Sample Voter Passes:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickFill("2f39s2Hh")}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-mono font-bold text-zinc-800 transition-all cursor-pointer"
                >
                  2f39s2Hh (Slide 3)
                </button>
                <button
                  onClick={() => handleQuickFill("8k92PqLm")}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-mono font-bold text-zinc-800 transition-all cursor-pointer"
                >
                  8k92PqLm
                </button>
                <button
                  onClick={() => handleQuickFill("4v71NwZx")}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-mono font-bold text-zinc-800 transition-all cursor-pointer"
                >
                  4v71NwZx
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                <p className="font-medium text-xs leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {warningMessage && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-sm flex items-start space-x-3">
                <Zap className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
                <p className="font-medium text-xs leading-relaxed">{warningMessage}</p>
              </div>
            )}
          </div>

          {/* Right Column: Pastel Aura Canvas (Exact match to Image 4) */}
          <div className="lg:col-span-7 pastel-aura-canvas rounded-[32px] p-6 sm:p-10 flex items-center justify-center min-h-[460px] shadow-sm">
            
            {/* STEP 1: AUTHENTICATION FORM CARD */}
            {step === "AUTH" && (
              <div className="bg-white rounded-[24px] p-8 sm:p-10 w-full max-w-lg shadow-xl shadow-zinc-900/5 space-y-6 border border-white/60">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                      Voter Authorization
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Session ID + Random Voter ID verification
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800">
                    <KeyRound className="w-4 h-4" />
                  </div>
                </div>

                <form onSubmit={handleVerify} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">
                      Session ID
                    </label>
                    <input
                      type="text"
                      value={sessionId}
                      onChange={(e) => setSessionId(e.target.value.toUpperCase())}
                      placeholder="e.g. ELX-7F92KQ"
                      className="w-full bg-[#f4f4f6] border border-zinc-200 rounded-xl px-4 py-3 text-base font-mono font-bold text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">
                      Your Random Voter ID
                    </label>
                    <input
                      type="text"
                      value={voterId}
                      onChange={(e) => setVoterId(e.target.value)}
                      placeholder="e.g. 2f39s2Hh"
                      className="w-full bg-[#f4f4f6] border border-zinc-200 rounded-xl px-4 py-3 text-base font-mono font-bold text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900 transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-white text-[15px] font-semibold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Verify & Continue →</span>
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: CANDIDATE BALLOT SELECTION */}
            {(step === "SELECT" || step === "SUBMITTING") && activeElection && (
              <div className="bg-white rounded-[24px] p-6 sm:p-8 w-full max-w-xl shadow-xl shadow-zinc-900/5 space-y-6 border border-white/60">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-zinc-400">
                      SESSION {activeElection.id}
                    </span>
                    <h3 className="text-xl font-bold text-zinc-900">
                      {activeElection.title}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Pass Verified ✓
                  </span>
                </div>

                {/* Candidate Selection List */}
                <div className="space-y-3">
                  {activeElection.candidates.map((cand) => {
                    const isSelected = selectedCandidate === cand.id;
                    return (
                      <div
                        key={cand.id}
                        onClick={() => setSelectedCandidate(cand.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between gap-4 ${
                          isSelected
                            ? "bg-zinc-50 border-zinc-900 ring-2 ring-zinc-200"
                            : "bg-[#f4f4f6]/60 border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-zinc-900 text-sm">{cand.name}</span>
                            <span className="text-xs text-zinc-400">({cand.department})</span>
                          </div>
                          <p className="text-xs text-zinc-500 font-normal">&ldquo;{cand.manifesto}&rdquo;</p>
                        </div>

                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 bg-white"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("AUTH")}
                    disabled={step === "SUBMITTING"}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 cursor-pointer"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitVote}
                    disabled={!selectedCandidate || step === "SUBMITTING"}
                    className="px-6 py-3 rounded-xl bg-[#18181b] hover:bg-zinc-800 disabled:opacity-40 text-white text-sm font-semibold transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
                  >
                    {step === "SUBMITTING" ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Minting on Chain...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Anonymous Ballot</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS & DEMO REVERT TRIGGER */}
            {step === "SUCCESS" && receipt && (
              <div className="bg-white rounded-[24px] p-6 sm:p-8 w-full max-w-lg shadow-xl shadow-zinc-900/5 space-y-5 border border-white/60">
                <div className="text-center space-y-2 pb-4 border-b border-zinc-100">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">
                    Ballot Successfully Cast!
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Confirmed in Block #{receipt.blockNumber} on the decentralized ledger.
                  </p>
                </div>

                {/* Receipt Inset */}
                <div className="p-4 rounded-xl bg-[#f4f4f6] font-mono text-xs space-y-2 text-zinc-600">
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-medium text-zinc-400">Tx Hash:</span>
                    <span className="text-zinc-900 font-bold">{shortenHash(receipt.transactionHash, 8, 6)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-medium text-zinc-400">Nullifier:</span>
                    <span className="text-purple-700 font-bold">{shortenHash(receipt.event.nullifierHash, 8, 6)}</span>
                  </div>
                </div>

                {/* Rejection Demo Button (Slide 8) */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <p className="text-[11px] font-bold uppercase text-amber-800">
                    Slide 8 Live Double-Vote Rejection Demo:
                  </p>
                  <button
                    onClick={handleTestSecondVote}
                    className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    ⚡ Test Second Vote Attempt (Trigger Revert)
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={onNavigateToLedger}
                    className="py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold text-center transition-all cursor-pointer"
                  >
                    View Ledger
                  </button>
                  <button
                    onClick={() => {
                      setStep("AUTH");
                      setSessionId("ELX-7F92KQ");
                      setVoterId("8k92PqLm");
                      setSelectedCandidate(null);
                      setReceipt(null);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-white text-xs font-semibold text-center transition-all cursor-pointer"
                  >
                    Next Voter Pass
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

    </div>
  );
};
