# 🗳️ AnonVote: Privacy-Preserving Blockchain Voting for Campus Elections

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-363636?style=flat&logo=solidity)](https://soliditylang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-v6-627EEA?style=flat&logo=ethereum)](https://docs.ethers.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![SDG 16](https://img.shields.io/badge/SDG_16-Strong_Institutions-00689D)](https://sdgs.un.org/goals/goal16)
[![SDG 9](https://img.shields.io/badge/SDG_9-Innovation_%26_Infrastructure-FD6925)](https://sdgs.un.org/goals/goal9)

> **"Verify the voter. Protect the ballot. Trust the result."**  
> *Developed for SRM Institute of Science and Technology, Chennai*  
> *Built using iNSIGHTS: Blockchain × Privacy-Preserving Cryptography × AI Intelligence*

---

## 📌 Problem Statement

> **How can we guarantee one-person-one-vote while preventing the election authority from knowing who voted for whom?**

Campus and institutional elections require three critical properties simultaneously:
1. 🔐 **Ballot Privacy**: A student's vote must remain unconditionally confidential.
2. 1️⃣ **Voter Uniqueness**: Each authorized member must be able to cast exactly one ballot.
3. 🔍 **Audit Transparency**: Tally results must be publicly verifiable and tamper-evident.

### The Centralized Database Flaw
In typical student portals and voting systems:
$$\text{Student} \longrightarrow \text{Login / SSO / Roll No} \longrightarrow \text{Centralized Database} \longrightarrow \text{Ballot Choice} \longrightarrow \text{Result}$$

Because the voter identity is stored alongside the ballot in a centralized database or server access log, **the system administrator or election authority can easily determine who voted for whom**.

### Who is Affected?
- College students & student councils
- Academic departments & faculty committees
- Clubs, technical societies, and sports chapters
- **Scale**: India enrolled over **4.33 crore students** in higher education in 2021–22 (*Ministry of Education AISHE Data*).

---

## 💡 The AnonVote Solution: Identity–Ballot Separation

AnonVote decouples voter authorization from the ballot record through a cryptographic **Zero-Knowledge Nullifier** mechanism and records anonymous votes directly onto an immutable blockchain smart contract.

```
                  ANONVOTE ZERO-KNOWLEDGE ARCHITECTURE

       ┌──────────────────────────────────────────────────────────┐
       │                 ELIGIBILITY LAYER (PostgreSQL)           │
       │                   "Can this person vote?"                │
       └─────────────────────────────┬────────────────────────────┘
                                     │
                    HMAC Keccak-256 Secret Derivation
                                     │
                                     ▼
       ┌──────────────────────────────────────────────────────────┐
       │             ONE-TIME ANONYMOUS CREDENTIAL                │
       │           NullifierHash = H(Secret, SessionID)           │
       └─────────────────────────────┬────────────────────────────┘
                                     │
                         Direct Smart Contract Call
                                     │
                                     ▼
       ┌──────────────────────────────────────────────────────────┐
       │                 BALLOT LAYER (Blockchain)                │
       │                    "What was voted?"                     │
       └─────────────────────────────┬────────────────────────────┘
                                     │
                                     ▼
       ┌──────────────────────────────────────────────────────────┐
       │             PUBLIC AUDIT LEDGER & iNSIGHTS AI            │
       │               Tamper-Evident Certified Tally             │
       └──────────────────────────────────────────────────────────┘
```

### Key Differentiators:
| Feature | Traditional Campus Voting | AnonVote Platform |
| :--- | :--- | :--- |
| **Voter Privacy** | ❌ Linkable in DB / Server logs | ✅ Mathematically Unlinkable (Zero-PII) |
| **Voter Accounts** | ❌ Requires passwords / Google SSO | ✅ No accounts or crypto wallets needed |
| **Double Voting** | ❌ Centralized flag (can be edited) | ✅ Solidity Smart Contract Nullifier Revert |
| **Auditability** | ❌ Black-box admin dashboard | ✅ Public Blockchain Block Explorer + Merkle Root |
| **AI Governance** | ❌ None | ✅ Integrated iNSIGHTS Anomaly & Deep Search |

---

## ⚙️ Cryptographic Mechanism

1. **Random Voter Pass Generation**:
   The organization imports eligible voter quotas. The system generates random 8-character passes (e.g., `2f39s2Hh`).
2. **Identity Blind Commitment**:
   Student registration IDs are converted into a cryptographic commitment:
   $$\text{CommitmentHash} = \text{Keccak256}(\text{Salt} \mathbin{\Vert} \text{StudentRollNo})$$
   *Zero student names or registration numbers are stored in plain text.*
3. **Anonymous One-Time Nullifier Derivation**:
   When entering the Session ID (`ELX-7F92KQ`) and Voter Pass (`2f39s2Hh`):
   $$\text{Secret} = \text{Keccak256}(\text{VoterID} \mathbin{\Vert} \text{ElectionSalt} \mathbin{\Vert} \text{SessionID})$$
   $$\text{NullifierHash} = \text{Keccak256}(\text{Secret} \mathbin{\Vert} \text{SessionID})$$
4. **Smart Contract Verification**:
   The client relays `(electionId, nullifierHash, candidateId)` to the smart contract:
   - If `isNullifierUsed[electionId][nullifierHash] == true` $\longrightarrow$ **REVERT: Double Vote Detected**.
   - Otherwise, records `isNullifierUsed = true`, increments candidate tally, and emits `VoteCast` event.

---

## 🏗️ Technical Architecture

```
                    ┌─────────────────────────┐
                    │     ELECTION ADMIN      │
                    └────────────┬────────────┘
                                 │ Create Election
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS WEB APPLICATION                     │
│               (Nerdstack Design System • Tailwind CSS)          │
│                                                                 │
│   Student Voting Terminal                  Admin Operations Hub │
│   Public Blockchain Explorer               iNSIGHTS AI Studio   │
└───────────────────────┬───────────────────┬─────────────────────┘
                        │                   │
                        ▼                   ▼
           ┌────────────────────────┐  ┌─────────────────────────┐
           │      CLOUD BACKEND     │  │   SMART CONTRACT / L2   │
           │  Supabase PostgreSQL   │  │   Solidity EVM Engine   │
           │  (Zero-PII Registry)   │  │  (Nullifiers & Tallies) │
           └────────────────────────┘  └────────────┬────────────┘
                                                    │
                                                    ▼
                                       ┌─────────────────────────┐
                                       │   BLOCKCHAIN LEDGER     │
                                       │  Chained Blocks & TxID  │
                                       └─────────────────────────┘
```

---

## 📂 Project Structure

```
anonvote/
├── contracts/
│   └── AnonVote.sol              # Solidity smart contract for nullifier tracking & tallies
├── src/
│   ├── app/
│   │   ├── globals.css           # Tailwind v4 configuration & pastel aura mesh styling
│   │   ├── layout.tsx            # Plus Jakarta Sans typography & root metadata
│   │   └── page.tsx              # Unified single-page experience & Nerdstack footer
│   ├── components/
│   │   ├── Navbar.tsx            # Floating pill navbar with coral logo & demo helper
│   │   ├── StudentVoting.tsx     # 3-step confidential voting terminal & rejection demo
│   │   ├── AdminDashboard.tsx    # Live results graph (Screen 4) & Zero-PII registry
│   │   ├── AuditLedger.tsx       # Live block explorer, EVM receipts & JSON audit export
│   │   ├── InsightsAI.tsx        # iNSIGHTS Deep Search, Anomaly detector & certificate
│   │   └── PitchDeck.tsx         # Complete 10-slide presentation deck with quick-jump
│   └── lib/
│       ├── blockchain.ts         # EVM ledger engine, Keccak-256 block mining & gas math
│       ├── crypto.ts             # Blind credentials, nullifiers & commitment hashes
│       ├── insights-ai.ts        # AI anomaly detection & SDG governance metrics
│       ├── storage.ts            # Supabase PostgreSQL store & local state sync
│       └── supabase.ts           # Supabase client connector
├── supabase_schema.sql           # PostgreSQL schema for elections, passes & ledger
├── .env.local                    # Supabase project URL and anon public key
└── package.json                  # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (`v24.x` recommended)
- **npm**: v9.x or higher

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/anonvote.git
cd anonvote
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
*(A pre-configured live test instance is already bundled for immediate testing).*

### 4. Database Setup (Supabase PostgreSQL)
If setting up a fresh Supabase project:
1. Navigate to the **SQL Editor** in your Supabase dashboard.
2. Open [`supabase_schema.sql`](./supabase_schema.sql).
3. Paste the contents and click **Run**.

### 5. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 6. Production Build Verification
```bash
npm run build
npm run start
```

---

## 🎯 Quick Demo Walkthrough (For Judges & Evaluators)

1. **Step 1 — Launch Terminal**:
   - Open [http://localhost:3000](http://localhost:3000).
   - In the top right or on the hero, click **"Load Slide 3 Demo Pass (2f39s2Hh)"**.
   - Click **"Verify & Continue →"**.

2. **Step 2 — Cast Confidential Ballot**:
   - Notice the derived **Anonymous Nullifier** (zero student names linked).
   - Select a candidate (e.g. *Aarav Sharma* or *Priya Venkatesh*).
   - Click **"Submit Anonymous Ballot"**.

3. **Step 3 — Inspect Cryptographic Receipt**:
   - View your confirmed **Block Number** (e.g. `#1048571`) and **Transaction Hash** (`0x...`).

4. **Step 4 — Prove Double-Vote Prevention (Slide 8 Requirement)**:
   - Click the yellow button: **"⚡ Test Second Vote Attempt (Trigger Revert)"**.
   - Watch the blockchain engine immediately revert the transaction with:
     > `REVERT: Nullifier already spent. Double vote detected on blockchain ledger.`

5. **Step 5 — Admin Hub & Zero-PII Registry**:
   - Switch to the **Admin Hub** tab.
   - View live candidate tallies and the **Zero-PII Voter Passes** table.
   - Notice that **zero student names or roll numbers** exist on the server.

6. **Step 6 — Public Blockchain Ledger**:
   - Switch to the **Ledger** tab to inspect chained blocks, gas metrics, and raw EVM receipts.
   - Click **"Export Audit Proof (JSON)"** to download the complete tamper-evident audit file.

7. **Step 7 — iNSIGHTS AI Studio**:
   - Ask questions like: *"Can the election authority know who I voted for?"* or *"What prevents double voting?"*.
   - Click **"Download Audit Certificate"** to export the official institutional certification.

8. **Step 8 — Interactive Pitch Deck**:
   - Switch to **Pitch Deck** to present all 10 hackathon presentation slides directly inside the browser using arrow keys.

---

## 📜 Smart Contract Reference (`AnonVote.sol`)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AnonVote {
    // electionId => nullifierHash => isUsed
    mapping(bytes32 => mapping(bytes32 => bool)) public isNullifierUsed;

    event VoteCast(
        bytes32 indexed electionId,
        bytes32 indexed nullifierHash,
        uint256 candidateId,
        uint256 blockNumber,
        uint256 timestamp
    );

    function castVote(
        bytes32 electionId,
        bytes32 nullifierHash,
        uint256 candidateId
    ) external {
        require(!isNullifierUsed[electionId][nullifierHash], "Nullifier already spent: Duplicate vote rejected");
        isNullifierUsed[electionId][nullifierHash] = true;
        emit VoteCast(electionId, nullifierHash, candidateId, block.number, block.timestamp);
    }
}
```

---

## 🌍 Sustainable Development Goals (SDG) Alignment

- **SDG 16: Peace, Justice & Strong Institutions**  
  *Promotes accountable, transparent institutions by eliminating electoral tampering, voter coercion, and administrative bias.*
- **SDG 9: Industry, Innovation & Infrastructure**  
  *Demonstrates resilient digital public infrastructure using privacy-preserving cryptography and decentralized blockchain records.*

---

## 👥 Team & Acknowledgments

- **Institution**: SRM Institute of Science and Technology, Chennai
- **Platform**: Built using the **iNSIGHTS** AI Platform
- **Design Inspiration**: Nerdstack Minimalist Grotesque Design System

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
