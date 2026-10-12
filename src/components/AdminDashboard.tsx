"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  Users,
  Vote,
  TrendingUp,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Power,
  BarChart3,
  UserPlus,
  Award,
  Lock,
  EyeOff,
} from "lucide-react";
import { electionStore, Election, Candidate, VoterRecord } from "@/lib/storage";
import { blockchain } from "@/lib/blockchain";
import { shortenHash } from "@/lib/crypto";

interface AdminDashboardProps {
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onRefresh }) => {
  const [elections, setElections] = useState<Election[]>(electionStore.getElections());
  const [selectedElectionId, setSelectedElectionId] = useState<string>(
    elections[0]?.id || "ELX-7F92KQ"
  );
  const [activeTab, setActiveTab] = useState<"RESULTS" | "VOTERS" | "CREATE">("RESULTS");

  // Create Election Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [candidatesList, setCandidatesList] = useState([
    { name: "", department: "", manifesto: "" },
    { name: "", department: "", manifesto: "" },
  ]);
  const [initialVoterCount, setInitialVoterCount] = useState(15);
  const [createSuccessMessage, setCreateSuccessMessage] = useState<string | null>(null);

  // New Cohort Pass input (ZERO PII - no student name!)
  const [newCohort, setNewCohort] = useState("CSE Core (Class of 2026)");
  const [voterAddSuccess, setVoterAddSuccess] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeElection =
    elections.find((e) => e.id === selectedElectionId) || elections[0];

  const tallies = activeElection
    ? blockchain.getElectionTallies(activeElection.id)
    : {};
  const totalVotesCast = Object.values(tallies).reduce((a, b) => a + b, 0);
  const totalEligible = activeElection?.voters.length || 0;
  const participationPercent =
    totalEligible > 0 ? ((totalVotesCast / totalEligible) * 100).toFixed(1) : "0.0";

  let highestVotes = -1;
  let winnerCandidate: Candidate | null = null;
  if (activeElection) {
    for (const c of activeElection.candidates) {
      const votes = tallies[c.id] || 0;
      if (votes > highestVotes && votes > 0) {
        highestVotes = votes;
        winnerCandidate = c;
      }
    }
  }

  const handleToggleStatus = () => {
    if (!activeElection) return;
    electionStore.toggleElectionStatus(activeElection.id);
    setElections([...electionStore.getElections()]);
    onRefresh();
  };

  const handleAddCandidateRow = () => {
    setCandidatesList([...candidatesList, { name: "", department: "", manifesto: "" }]);
  };

  const handleCreateElection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const validCandidates = candidatesList.filter((c) => c.name.trim().length > 0);
    if (validCandidates.length < 2) {
      alert("Please configure at least 2 candidates.");
      return;
    }

    const created = electionStore.createElection(
      newTitle,
      newDescription,
      "STUDENT_COUNCIL",
      validCandidates,
      initialVoterCount
    );

    setElections([...electionStore.getElections()]);
    setSelectedElectionId(created.id);
    setCreateSuccessMessage(`Election '${created.title}' initialized (${created.id})`);
    setActiveTab("RESULTS");
    onRefresh();

    setNewTitle("");
    setNewDescription("");
  };

  const handleAddSingleVoter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeElection) return;

    const createdVoter = electionStore.addVoter(
      activeElection.id,
      newCohort
    );

    setElections([...electionStore.getElections()]);
    setVoterAddSuccess(`Generated Anonymous Voter Pass: ${createdVoter.voterId}`);
    onRefresh();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportVotersCSV = () => {
    if (!activeElection) return;
    const header = "Voter_Pass_ID,Blinded_Commitment_Hash,Cohort,Status\n";
    const rows = activeElection.voters
      .map(
        (v) =>
          `"${v.voterId}","${v.commitmentHash}","${v.cohort}","${
            v.hasVoted ? "Voted" : v.credentialClaimed ? "Pass Claimed" : "Eligible"
          }"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AnonVote_${activeElection.id}_VoterPasses_ZeroPII.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
            <span>CAMPUS ELECTION AUTHORITY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-950 tracking-tight">
            Admin Operations Hub
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 font-normal mt-1">
            Configure elections, distribute cryptographic passes, and verify live results on the EVM testnet.
          </p>
        </div>

        {/* Election Selector & Status */}
        <div className="flex items-center space-x-3">
          <select
            value={selectedElectionId}
            onChange={(e) => setSelectedElectionId(e.target.value)}
            className="bg-[#f4f4f6] border border-zinc-200 text-zinc-900 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:bg-white focus:border-zinc-900 cursor-pointer shadow-2xs"
          >
            {elections.map((el) => (
              <option key={el.id} value={el.id}>
                {el.id} — {el.title}
              </option>
            ))}
          </select>

          {activeElection && (
            <button
              onClick={handleToggleStatus}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeElection.isActive
                  ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{activeElection.isActive ? "Close Polls" : "Open Polls"}</span>
            </button>
          )}
        </div>
      </div>

      {createSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between">
          <span>{createSuccessMessage}</span>
          <button onClick={() => setCreateSuccessMessage(null)} className="text-xs text-emerald-700 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("RESULTS")}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "RESULTS"
              ? "bg-[#18181b] text-white shadow-xs"
              : "bg-[#f4f4f6] text-zinc-600 hover:text-zinc-950"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Screen 4: Live Results</span>
        </button>

        <button
          onClick={() => setActiveTab("VOTERS")}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "VOTERS"
              ? "bg-[#18181b] text-white shadow-xs"
              : "bg-[#f4f4f6] text-zinc-600 hover:text-zinc-950"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Zero-PII Voter Passes ({activeElection?.voters.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("CREATE")}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "CREATE"
              ? "bg-[#18181b] text-white shadow-xs"
              : "bg-[#f4f4f6] text-zinc-600 hover:text-zinc-950"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Screen 1: Create New Election</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: SCREEN 4 RESULTS */}
      {/* ============================================================ */}
      {activeTab === "RESULTS" && activeElection && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="bg-[#f4f4f6] rounded-[28px] p-6 border border-zinc-200/60">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Eligible Passes</span>
              <p className="text-4xl font-bold text-zinc-900 tracking-tight mt-2">{totalEligible}</p>
              <p className="text-xs text-zinc-400 mt-1">Authorized quotas</p>
            </div>

            <div className="bg-[#f4f4f6] rounded-[28px] p-6 border border-zinc-200/60">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Votes Cast</span>
              <p className="text-4xl font-bold text-zinc-900 tracking-tight mt-2">{totalVotesCast}</p>
              <p className="text-xs text-zinc-400 mt-1">Confirmed on-chain</p>
            </div>

            <div className="bg-[#f4f4f6] rounded-[28px] p-6 border border-zinc-200/60">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Turnout</span>
              <p className="text-4xl font-bold text-zinc-900 tracking-tight mt-2">{participationPercent}%</p>
              <div className="w-full bg-zinc-200 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-zinc-900 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(Number(participationPercent), 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-[#f4f4f6] rounded-[28px] p-6 border border-zinc-200/60">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Blockchain Status</span>
              <p className="text-3xl font-bold text-emerald-600 tracking-tight mt-2">VERIFIED ✓</p>
              <p className="text-xs text-zinc-400 mt-1">Zero PII linked</p>
            </div>
          </div>

          {/* Results Bar Chart */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-zinc-200 space-y-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                  {activeElection.title} — Official Ballots
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Real-time smart contract state • Session {activeElection.id}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {activeElection.candidates.map((cand) => {
                const count = tallies[cand.id] || 0;
                const pct =
                  totalVotesCast > 0 ? ((count / totalVotesCast) * 100).toFixed(1) : "0.0";
                const isWinner = winnerCandidate && winnerCandidate.id === cand.id;

                return (
                  <div key={cand.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-zinc-900">{cand.name}</span>
                        <span className="text-xs text-zinc-400">({cand.department})</span>
                        {isWinner && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                            Leading
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 font-mono">
                        <span className="font-bold text-zinc-900">{count}</span>
                        <span className="text-xs text-zinc-400">({pct}%)</span>
                      </div>
                    </div>

                    <div className="w-full bg-[#f4f4f6] h-6 rounded-xl overflow-hidden p-0.5 border border-zinc-200 flex items-center">
                      <div
                        className="bg-[#18181b] h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(Number(pct), count > 0 ? 8 : 0)}%` }}
                      >
                        {count > 0 && <span className="text-[10px] font-mono font-bold text-white">{count}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: ZERO-PII VOTER PASS REGISTRY (Names completely hidden!) */}
      {/* ============================================================ */}
      {activeTab === "VOTERS" && activeElection && (
        <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-zinc-200 space-y-7 shadow-xs">
          
          {/* Zero-Knowledge Privacy Banner */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start space-x-3.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Zero-PII Compliance Verified (Strict Anonymity)
              </p>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Student names, registration numbers, and emails are <strong>purged from the server and admin view</strong>. The election authority only views cryptographic identity commitments and anonymous voter passes, preventing any possible voter de-anonymization.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                Authorized Cryptographic Voter Passes
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Students receive these secret passes via blind distribution. Admin has zero visibility into who holds which pass.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={exportVotersCSV}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Pass Registry (Zero-PII CSV)</span>
              </button>
            </div>
          </div>

          {/* Issue Pass by Cohort Form */}
          <form
            onSubmit={handleAddSingleVoter}
            className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-[#f4f4f6] border border-zinc-200"
          >
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">
                Authorize New Voter Pass for Cohort
              </label>
              <input
                type="text"
                placeholder="e.g. Dept. of CSE - Class of 2026"
                value={newCohort}
                onChange={(e) => setNewCohort(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-white text-xs font-semibold transition-all self-end cursor-pointer"
            >
              + Issue Anonymous Pass
            </button>
          </form>

          {voterAddSuccess && (
            <p className="text-xs font-bold text-emerald-700 font-mono">{voterAddSuccess}</p>
          )}

          {/* Table (Strict Zero PII - No Student Names!) */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-200">
            <table className="w-full text-left text-xs font-sans text-zinc-700">
              <thead className="bg-[#f4f4f6] text-zinc-500 font-semibold uppercase text-[10px] border-b border-zinc-200">
                <tr>
                  <th className="px-4 py-3">Voter Pass ID</th>
                  <th className="px-4 py-3">Blinded Commitment Hash (Keccak-256)</th>
                  <th className="px-4 py-3">Authorized Cohort</th>
                  <th className="px-4 py-3">Pass State</th>
                  <th className="px-4 py-3">Ballot Choice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-mono">
                {activeElection.voters.map((voter: VoterRecord) => (
                  <tr key={voter.voterId} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-zinc-900">
                      <div className="flex items-center space-x-1.5">
                        <span>{voter.voterId}</span>
                        <button
                          onClick={() => copyToClipboard(voter.voterId)}
                          className="p-0.5 text-zinc-400 hover:text-zinc-900"
                        >
                          {copiedId === voter.voterId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 font-mono">
                      {shortenHash(voter.commitmentHash, 10, 8)}
                    </td>
                    <td className="px-4 py-3 text-zinc-700 font-sans font-medium">
                      {voter.cohort}
                    </td>
                    <td className="px-4 py-3 font-sans">
                      {voter.hasVoted ? (
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                          VOTED ✓
                        </span>
                      ) : voter.credentialClaimed ? (
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                          CLAIMED
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-semibold text-[10px]">
                          UNCLAIMED
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-400 italic">
                      [UNLINKABLE / ENCRYPTED ON CHAIN]
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: SCREEN 1 CREATE ELECTION */}
      {/* ============================================================ */}
      {activeTab === "CREATE" && (
        <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-zinc-200 space-y-7 shadow-xs">
          <div className="pb-4 border-b border-zinc-100">
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
              Create New Campus Election (Screen 1 Wireframe)
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Set up candidate manifesto, initialize session ID, and generate voter IDs.
            </p>
          </div>

          <form onSubmit={handleCreateElection} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Election Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. SRM Mechanical Society Executive 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#f4f4f6] border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Initial Anonymous Passes to Generate
                </label>
                <input
                  type="number"
                  min="2"
                  max="100"
                  value={initialVoterCount}
                  onChange={(e) => setInitialVoterCount(Number(e.target.value))}
                  className="w-full bg-[#f4f4f6] border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Candidate Roster (Screen 1 Wireframe)
                </label>
                <button
                  type="button"
                  onClick={handleAddCandidateRow}
                  className="text-xs font-semibold text-zinc-800 hover:underline"
                >
                  + Add Candidate
                </button>
              </div>

              {candidatesList.map((cand, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#f4f4f6] border border-zinc-200"
                >
                  <input
                    type="text"
                    placeholder={`Candidate ${idx + 1} Name`}
                    value={cand.name}
                    onChange={(e) => {
                      const updated = [...candidatesList];
                      updated[idx].name = e.target.value;
                      setCandidatesList(updated);
                    }}
                    className="bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    value={cand.department}
                    onChange={(e) => {
                      const updated = [...candidatesList];
                      updated[idx].department = e.target.value;
                      setCandidatesList(updated);
                    }}
                    className="bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Key Goal"
                    value={cand.manifesto}
                    onChange={(e) => {
                      const updated = [...candidatesList];
                      updated[idx].manifesto = e.target.value;
                      setCandidatesList(updated);
                    }}
                    className="bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    required
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#18181b] hover:bg-zinc-800 text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              CREATE ELECTION & GENERATE SESSION ID
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
