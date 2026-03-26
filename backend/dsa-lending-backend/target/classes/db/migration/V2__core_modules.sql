ALTER TABLE lead ADD COLUMN IF NOT EXISTS email VARCHAR(150);
ALTER TABLE lead ADD COLUMN IF NOT EXISTS source VARCHAR(30);
ALTER TABLE lead ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE lead ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE lead ADD COLUMN IF NOT EXISTS dsa_name VARCHAR(120);
ALTER TABLE lead ADD COLUMN IF NOT EXISTS agent_name VARCHAR(120);

CREATE TABLE IF NOT EXISTS loan_application (
  id BIGSERIAL PRIMARY KEY,
  application_no VARCHAR(40) UNIQUE NOT NULL,
  lead_id BIGINT NOT NULL REFERENCES lead(id),
  requested_amount NUMERIC(15,2) NOT NULL,
  eligible_amount NUMERIC(15,2) NOT NULL,
  monthly_income NUMERIC(15,2) NOT NULL,
  monthly_obligations NUMERIC(15,2) NOT NULL,
  cibil_score INT NOT NULL,
  pan_number VARCHAR(20),
  ckyc_number VARCHAR(30),
  status VARCHAR(30) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_application_lead_id ON loan_application(lead_id);
CREATE INDEX IF NOT EXISTS idx_application_status ON loan_application(status);

CREATE TABLE IF NOT EXISTS application_document (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT NOT NULL REFERENCES loan_application(id),
  doc_type VARCHAR(30) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  is_aadhaar_masked BOOLEAN,
  verification_status VARCHAR(30) NOT NULL,
  remarks VARCHAR(500),
  uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_doc_application_id ON application_document(application_id);

CREATE TABLE IF NOT EXISTS payout_batch (
  id BIGSERIAL PRIMARY KEY,
  batch_code VARCHAR(40) UNIQUE NOT NULL,
  record_count INT NOT NULL,
  total_amount NUMERIC(15,2) NOT NULL,
  generated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commission_record (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT NOT NULL REFERENCES loan_application(id),
  dsa_name VARCHAR(120),
  agent_name VARCHAR(120),
  disbursed_amount NUMERIC(15,2) NOT NULL,
  commission_pct NUMERIC(5,2) NOT NULL,
  commission_amount NUMERIC(15,2) NOT NULL,
  gst_rate NUMERIC(5,2) NOT NULL,
  gst_amount NUMERIC(15,2) NOT NULL,
  tds_rate NUMERIC(5,2) NOT NULL,
  tds_amount NUMERIC(15,2) NOT NULL,
  net_payout NUMERIC(15,2) NOT NULL,
  payout_status VARCHAR(20) NOT NULL,
  payout_date TIMESTAMP,
  batch_code VARCHAR(40),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_commission_application_id ON commission_record(application_id);
CREATE INDEX IF NOT EXISTS idx_commission_payout_status ON commission_record(payout_status);
