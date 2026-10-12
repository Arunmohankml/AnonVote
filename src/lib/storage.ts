import { generateVoterId, generateSessionId } from "./crypto";
import { ethers } from "ethers";
import { supabase } from "./supabase";

export interface Candidate {
  id: number;
  name: string;
  department: string;
  manifesto: string;
  avatarColor: string;
}

export interface VoterRecord {
  voterId: string; // 8-char alphanumeric pass distributed confidentially (e.g. 2f39s2Hh)
  commitmentHash: string; // Cryptographic blinded token: Keccak-256(Roll + Salt)
  cohort: string; // Department / Batch for quorum verification
  credentialClaimed: boolean;
  hasVoted: boolean;
  votedAt?: number;
}

export interface Election {
  id: string; // Session ID e.g. ELX-7F92KQ
  title: string;
  description: string;
  institution: string;
  createdAt: number;
  isActive: boolean;
  candidates: Candidate[];
  voters: VoterRecord[];
  category: "STUDENT_COUNCIL" | "DEPARTMENT" | "CLUB" | "FACULTY";
}

function deriveBlindedCommitment(rollNumber: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(`SRM_SALT_2026:${rollNumber}`));
}

const DEFAULT_ELECTIONS: Election[] = [
  {
    id: "ELX-7F92KQ",
    title: "SRM CSE Council 2026",
    description: "Annual Executive Council Election for the Department of Computer Science & Engineering, SRM IST Chennai.",
    institution: "SRM Institute of Science and Technology, Chennai",
    createdAt: Date.now() - 3600000 * 12,
    isActive: true,
    category: "STUDENT_COUNCIL",
    candidates: [
      {
        id: 1,
        name: "Aarav Sharma",
        department: "CSE Core (Cybersecurity & Systems)",
        manifesto: "24x7 Lab Access, Open Source Hackathons, and Transparent Student Council Budgeting.",
        avatarColor: "from-blue-600 to-indigo-600",
      },
      {
        id: 2,
        name: "Priya Venkatesh",
        department: "CSE (Artificial Intelligence & ML)",
        manifesto: "Industry Mentorship Tie-ups, Research Paper Travel Grants, and Mental Health Initiatives.",
        avatarColor: "from-purple-600 to-pink-600",
      },
      {
        id: 3,
        name: "Karthik Raja",
        department: "CSE (Cloud Computing & IoT)",
        manifesto: "High-Speed Campus WiFi Upgrade, Tech Symposium Sponsorships, and Peer Tutoring.",
        avatarColor: "from-emerald-600 to-teal-600",
      },
    ],
    voters: [
      {
        voterId: "2f39s2Hh",
        commitmentHash: deriveBlindedCommitment("RA2211003010042"),
        cohort: "CSE Core (Section A)",
        credentialClaimed: false,
        hasVoted: false,
      },
      {
        voterId: "8k92PqLm",
        commitmentHash: deriveBlindedCommitment("RA2211003010058"),
        cohort: "CSE AI/ML (Section B)",
        credentialClaimed: false,
        hasVoted: false,
      },
      {
        voterId: "4v71NwZx",
        commitmentHash: deriveBlindedCommitment("RA2211003010112"),
        cohort: "CSE Cloud (Section C)",
        credentialClaimed: false,
        hasVoted: false,
      },
      {
        voterId: "7h29KmTy",
        commitmentHash: deriveBlindedCommitment("RA2211003010189"),
        cohort: "CSE Core (Section D)",
        credentialClaimed: false,
        hasVoted: false,
      },
      {
        voterId: "9m14QwEr",
        commitmentHash: deriveBlindedCommitment("RA2211003010245"),
        cohort: "CSE Big Data (Section E)",
        credentialClaimed: false,
        hasVoted: false,
      },
      {
        voterId: "3b68XsPl",
        commitmentHash: deriveBlindedCommitment("RA2211003010310"),
        cohort: "CSE Core (Section F)",
        credentialClaimed: false,
        hasVoted: false,
      },
    ],
  },
];

class ElectionStore {
  private elections: Election[] = [];

  constructor() {
    this.loadFromStorage();
    this.syncWithSupabase();
  }

  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  private loadFromStorage() {
    if (!this.isBrowser()) {
      this.elections = DEFAULT_ELECTIONS;
      return;
    }

    try {
      const data = localStorage.getItem("anonvote_elections_v2");
      if (data) {
        this.elections = JSON.parse(data);
      } else {
        this.elections = DEFAULT_ELECTIONS;
        this.saveToStorage();
      }
    } catch {
      this.elections = DEFAULT_ELECTIONS;
    }
  }

  private saveToStorage() {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem("anonvote_elections_v2", JSON.stringify(this.elections));
    } catch {}
  }

  /**
   * Real-time sync with Supabase PostgreSQL
   */
  public async syncWithSupabase() {
    try {
      const { data: electionsData, error: elError } = await supabase
        .from("elections")
        .select("*");

      if (elError || !electionsData || electionsData.length === 0) return;

      const syncedElections: Election[] = [];

      for (const el of electionsData) {
        const { data: candData } = await supabase
          .from("candidates")
          .select("*")
          .eq("election_id", el.id)
          .order("candidate_index", { ascending: true });

        const { data: passesData } = await supabase
          .from("voter_passes")
          .select("*")
          .eq("election_id", el.id);

        const candidates: Candidate[] = (candData || []).map((c) => ({
          id: c.candidate_index,
          name: c.name,
          department: c.department,
          manifesto: c.manifesto || "",
          avatarColor: c.avatar_color || "from-blue-600 to-indigo-600",
        }));

        const voters: VoterRecord[] = (passesData || []).map((v) => ({
          voterId: v.voter_id,
          commitmentHash: v.commitment_hash,
          cohort: v.cohort,
          credentialClaimed: v.credential_claimed,
          hasVoted: v.has_voted,
          votedAt: v.voted_at ? new Date(v.voted_at).getTime() : undefined,
        }));

        syncedElections.push({
          id: el.id,
          title: el.title,
          description: el.description || "",
          institution: el.institution || "SRM Institute of Science and Technology, Chennai",
          createdAt: el.created_at ? new Date(el.created_at).getTime() : Date.now(),
          isActive: el.is_active,
          category: (el.category as Election["category"]) || "STUDENT_COUNCIL",
          candidates,
          voters,
        });
      }

      if (syncedElections.length > 0) {
        this.elections = syncedElections;
        this.saveToStorage();
      }
    } catch (err) {
      console.warn("Supabase sync notice:", err);
    }
  }

  public getElections(): Election[] {
    return this.elections;
  }

  public getElectionById(id: string): Election | undefined {
    return this.elections.find((e) => e.id.toLowerCase() === id.trim().toLowerCase());
  }

  public createElection(
    title: string,
    description: string,
    category: Election["category"],
    candidateInputs: { name: string; department: string; manifesto: string }[],
    voterCount = 10
  ): Election {
    const sessionId = generateSessionId();

    const colors = [
      "from-blue-600 to-indigo-600",
      "from-purple-600 to-pink-600",
      "from-emerald-600 to-teal-600",
      "from-amber-600 to-orange-600",
      "from-rose-600 to-red-600",
    ];

    const candidates: Candidate[] = candidateInputs.map((c, idx) => ({
      id: idx + 1,
      name: c.name,
      department: c.department,
      manifesto: c.manifesto,
      avatarColor: colors[idx % colors.length],
    }));

    // Auto-generate strictly confidential voter passes (ZERO PII)
    const voters: VoterRecord[] = [];
    for (let i = 1; i <= voterCount; i++) {
      voters.push({
        voterId: generateVoterId(),
        commitmentHash: deriveBlindedCommitment(`SRM_ENROLL_${1000 + i}`),
        cohort: "Department of CSE",
        credentialClaimed: false,
        hasVoted: false,
      });
    }

    const newElection: Election = {
      id: sessionId,
      title,
      description,
      institution: "SRM Institute of Science and Technology, Chennai",
      createdAt: Date.now(),
      isActive: true,
      category,
      candidates,
      voters,
    };

    this.elections.unshift(newElection);
    this.saveToStorage();

    // Async write to Supabase
    (async () => {
      try {
        await supabase.from("elections").insert({
          id: sessionId,
          title,
          description,
          institution: "SRM Institute of Science and Technology, Chennai",
          is_active: true,
          category,
        });

        const candInserts = candidates.map((c) => ({
          election_id: sessionId,
          candidate_index: c.id,
          name: c.name,
          department: c.department,
          manifesto: c.manifesto,
          avatar_color: c.avatarColor,
        }));
        await supabase.from("candidates").insert(candInserts);

        const passInserts = voters.map((v) => ({
          voter_id: v.voterId,
          election_id: sessionId,
          commitment_hash: v.commitmentHash,
          cohort: v.cohort,
          credential_claimed: false,
          has_voted: false,
        }));
        await supabase.from("voter_passes").insert(passInserts);
      } catch (err) {
        console.error("Supabase write error:", err);
      }
    })();

    return newElection;
  }

  public addVoter(electionId: string, cohort: string): VoterRecord {
    const election = this.getElectionById(electionId);
    if (!election) throw new Error("Election not found");

    const newVoter: VoterRecord = {
      voterId: generateVoterId(),
      commitmentHash: deriveBlindedCommitment(`SRM_ENROLL_${Date.now()}`),
      cohort: cohort || "Department of CSE",
      credentialClaimed: false,
      hasVoted: false,
    };

    election.voters.push(newVoter);
    this.saveToStorage();

    // Async write to Supabase
    (async () => {
      try {
        await supabase.from("voter_passes").insert({
          voter_id: newVoter.voterId,
          election_id: electionId,
          commitment_hash: newVoter.commitmentHash,
          cohort: newVoter.cohort,
          credential_claimed: false,
          has_voted: false,
        });
      } catch (err) {
        console.error("Supabase voter insert error:", err);
      }
    })();

    return newVoter;
  }

  public markCredentialClaimed(electionId: string, voterId: string): boolean {
    const election = this.getElectionById(electionId);
    if (!election) return false;

    const voter = election.voters.find((v) => v.voterId.toLowerCase() === voterId.trim().toLowerCase());
    if (!voter) return false;

    voter.credentialClaimed = true;
    this.saveToStorage();

    // Async update in Supabase
    (async () => {
      try {
        await supabase
          .from("voter_passes")
          .update({ credential_claimed: true })
          .eq("voter_id", voterId.trim());
      } catch (err) {
        console.error("Supabase pass claim error:", err);
      }
    })();

    return true;
  }

  public markVoted(electionId: string, voterId: string): boolean {
    const election = this.getElectionById(electionId);
    if (!election) return false;

    const voter = election.voters.find((v) => v.voterId.toLowerCase() === voterId.trim().toLowerCase());
    if (!voter) return false;

    voter.hasVoted = true;
    voter.votedAt = Date.now();
    this.saveToStorage();

    // Async update in Supabase
    (async () => {
      try {
        await supabase
          .from("voter_passes")
          .update({ has_voted: true, voted_at: new Date().toISOString() })
          .eq("voter_id", voterId.trim());
      } catch (err) {
        console.error("Supabase pass voted error:", err);
      }
    })();

    return true;
  }

  public toggleElectionStatus(electionId: string): boolean {
    const election = this.getElectionById(electionId);
    if (!election) return false;
    election.isActive = !election.isActive;
    this.saveToStorage();

    (async () => {
      try {
        await supabase
          .from("elections")
          .update({ is_active: election.isActive })
          .eq("id", electionId);
      } catch (err) {
        console.error("Supabase toggle status error:", err);
      }
    })();

    return election.isActive;
  }

  public resetToDefault() {
    this.elections = DEFAULT_ELECTIONS;
    this.saveToStorage();
  }
}

export const electionStore = new ElectionStore();
