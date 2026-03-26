import React, { useMemo, useState } from 'react';
import Input from '../../components/common/Input';
import { applicationsService } from '../../services/applications/applicationsService';
import './PhaseOnePages.css';

const formatCurrency = (amount: number): string => `₹${amount.toLocaleString('en-IN')}`;

const EligibilityPage: React.FC = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyObligations, setMonthlyObligations] = useState(0);
  const [cibilScore, setCibilScore] = useState(700);

  const result = useMemo(() => {
    return applicationsService.evaluateEligibility({
      monthlyIncome,
      monthlyObligations,
      cibilScore,
    });
  }, [monthlyIncome, monthlyObligations, cibilScore]);

  return (
    <div className="phase-page">
      <div className="phase-header">
        <h1>Eligibility & Pre-Screening</h1>
        <p>Evaluate FOIR and CIBIL before creating loan applications</p>
      </div>

      <div className="phase-panel">
        <div className="phase-grid-2">
          <Input
            label="Monthly Income"
            type="number"
            value={monthlyIncome || ''}
            onChange={(event) => setMonthlyIncome(Number(event.target.value))}
          />
          <Input
            label="Monthly Obligations"
            type="number"
            value={monthlyObligations || ''}
            onChange={(event) => setMonthlyObligations(Number(event.target.value))}
          />
          <Input
            label="CIBIL Score"
            type="number"
            value={cibilScore || ''}
            onChange={(event) => setCibilScore(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="phase-grid-4">
        <div className="phase-stat">
          <span className="phase-stat-label">FOIR</span>
          <span className="phase-stat-value">{result.foir.toFixed(2)}%</span>
        </div>
        <div className="phase-stat">
          <span className="phase-stat-label">CIBIL Rule</span>
          <span className="phase-stat-value">{cibilScore >= 700 ? 'PASS' : 'FAIL'}</span>
        </div>
        <div className="phase-stat">
          <span className="phase-stat-label">Decision</span>
          <span className="phase-stat-value">{result.eligible ? 'Eligible' : 'Not Eligible'}</span>
        </div>
        <div className="phase-stat">
          <span className="phase-stat-label">Recommended Amount</span>
          <span className="phase-stat-value">{formatCurrency(result.recommendedAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default EligibilityPage;
