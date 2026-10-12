-- ==============================================================================
-- ANONVOTE SUPABASE POSTGRESQL SCHEMA
-- SRM Institute of Science and Technology, Chennai
-- Enforces Zero-Knowledge Identity–Ballot Separation (No Student Names/PII)
-- ==============================================================================

-- 1. Elections Table
CREATE TABLE IF NOT EXISTS elections (
    id VARCHAR(32) PRIMARY KEY, -- e.g. ELX-7F92KQ
    title TEXT NOT NULL,
    description TEXT,
    institution TEXT DEFAULT 'SRM Institute of Science and Technology, Chennai',
    is_active BOOLEAN DEFAULT TRUE,
    category TEXT DEFAULT 'STUDENT_COUNCIL',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    election_id VARCHAR(32) REFERENCES elections(id) ON DELETE CASCADE,
    candidate_index INT NOT NULL, -- 1, 2, 3
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    manifesto TEXT,
    avatar_color TEXT DEFAULT 'from-blue-600 to-indigo-600',
    UNIQUE(election_id, candidate_index)
);

-- 3. Anonymous Voter Passes Table (Strictly Zero-PII: No Student Names or Roll Numbers!)
CREATE TABLE IF NOT EXISTS voter_passes (
    voter_id VARCHAR(32) PRIMARY KEY, -- Random 8-char pass e.g. 2f39s2Hh
    election_id VARCHAR(32) REFERENCES elections(id) ON DELETE CASCADE,
    commitment_hash TEXT NOT NULL, -- Cryptographic Blinded Token: Keccak-256(Roll + Salt)
    cohort TEXT NOT NULL, -- e.g. "CSE Core Section A"
    credential_claimed BOOLEAN DEFAULT FALSE,
    has_voted BOOLEAN DEFAULT FALSE,
    voted_at TIMESTAMPTZ
);

-- 4. Blockchain Ledger Audit Table
CREATE TABLE IF NOT EXISTS blockchain_blocks (
    block_number BIGINT PRIMARY KEY,
    block_hash TEXT NOT NULL UNIQUE,
    parent_hash TEXT NOT NULL,
    miner TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blockchain_transactions (
    transaction_hash TEXT PRIMARY KEY,
    block_number BIGINT REFERENCES blockchain_blocks(block_number) ON DELETE CASCADE,
    election_id VARCHAR(32) REFERENCES elections(id) ON DELETE CASCADE,
    nullifier_hash TEXT NOT NULL UNIQUE, -- Prevents double voting on-chain
    candidate_id INT NOT NULL,
    gas_used TEXT DEFAULT '48192 Gwei',
    status TEXT DEFAULT 'SUCCESS',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- DEFAULT SEED DATA (SRM CSE Council 2026 - Slide 3 & Slide 8)
-- ==============================================================================
INSERT INTO elections (id, title, description, institution, is_active)
VALUES (
    'ELX-7F92KQ',
    'SRM CSE Council 2026',
    'Annual Executive Council Election for the Department of Computer Science & Engineering, SRM IST Chennai.',
    'SRM Institute of Science and Technology, Chennai',
    TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO candidates (election_id, candidate_index, name, department, manifesto, avatar_color)
VALUES 
    ('ELX-7F92KQ', 1, 'Aarav Sharma', 'CSE Core (Cybersecurity & Systems)', '24x7 Lab Access, Open Source Hackathons, and Transparent Budgeting.', 'from-blue-600 to-indigo-600'),
    ('ELX-7F92KQ', 2, 'Priya Venkatesh', 'CSE (Artificial Intelligence & ML)', 'Industry Mentorship Tie-ups, Research Travel Grants, and Mental Health Initiatives.', 'from-purple-600 to-pink-600'),
    ('ELX-7F92KQ', 3, 'Karthik Raja', 'CSE (Cloud Computing & IoT)', 'High-Speed Campus WiFi Upgrade, Tech Symposium Sponsorships, and Peer Tutoring.', 'from-emerald-600 to-teal-600')
ON CONFLICT (election_id, candidate_index) DO NOTHING;

INSERT INTO voter_passes (voter_id, election_id, commitment_hash, cohort, credential_claimed, has_voted)
VALUES 
    ('2f39s2Hh', 'ELX-7F92KQ', '0x3a8f9021b4d8c7e6a51203948571029384756102938475610293847561029384', 'CSE Core (Section A)', FALSE, FALSE),
    ('8k92PqLm', 'ELX-7F92KQ', '0x5b9c8142d7e9f012a67382910495827364859102938475610293847561029384', 'CSE AI/ML (Section B)', FALSE, FALSE),
    ('4v71NwZx', 'ELX-7F92KQ', '0x7c0d9253e8f0a123b78493021506938475960213049586720193847561029384', 'CSE Cloud (Section C)', FALSE, FALSE)
ON CONFLICT (voter_id) DO NOTHING;
