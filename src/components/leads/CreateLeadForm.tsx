import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { LeadFormData, LoanType, LeadSource } from '../../services/types/lead.types';
import { leadsService } from '../../services/leads/leadsService';
import './CreateLeadForm.css';

interface CreateLeadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const LOAN_TYPE_OPTIONS = [
  { value: 'HOME', label: 'Home Loan' },
  { value: 'PERSONAL', label: 'Personal Loan' },
  { value: 'BUSINESS', label: 'Business Loan' },
  { value: 'CAR', label: 'Car Loan' },
  { value: 'EDUCATION', label: 'Education Loan' },
];

const SOURCE_OPTIONS = [
  { value: 'WEBSITE', label: 'Website' },
  { value: 'REFERENCE', label: 'Reference' },
  { value: 'DIRECT', label: 'Direct' },
  { value: 'CAMPAIGN', label: 'Campaign' },
];

const CreateLeadForm: React.FC<CreateLeadFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<LeadFormData>({
    customerName: '',
    mobile: '',
    email: '',
    loanType: 'HOME' as LoanType,
    loanAmount: 0,
    source: 'WEBSITE' as LeadSource,
    city: '',
    state: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof LeadFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Invalid mobile number';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.loanAmount || formData.loanAmount <= 0) newErrors.loanAmount = 'Loan amount must be greater than 0';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      await leadsService.createLead(formData);
      onSuccess();
    } catch (error) {
      console.error('Failed to create lead:', error);
      alert('Failed to create lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="create-lead-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <Input
          label="Customer Name *"
          placeholder="Enter full name"
          value={formData.customerName}
          onChange={(e) => handleChange('customerName', e.target.value)}
          error={errors.customerName}
        />

        <Input
          label="Mobile Number *"
          placeholder="10-digit mobile"
          value={formData.mobile}
          onChange={(e) => handleChange('mobile', e.target.value)}
          error={errors.mobile}
          maxLength={10}
        />

        <Input
          label="Email Address *"
          type="email"
          placeholder="customer@email.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />

        <Select
          label="Loan Type *"
          options={LOAN_TYPE_OPTIONS}
          value={formData.loanType}
          onChange={(e) => handleChange('loanType', e.target.value as LoanType)}
        />

        <Input
          label="Loan Amount *"
          type="number"
          placeholder="Enter amount"
          value={formData.loanAmount || ''}
          onChange={(e) => handleChange('loanAmount', Number(e.target.value))}
          error={errors.loanAmount}
        />

        <Select
          label="Lead Source *"
          options={SOURCE_OPTIONS}
          value={formData.source}
          onChange={(e) => handleChange('source', e.target.value as LeadSource)}
        />

        <Input
          label="City *"
          placeholder="Enter city"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          error={errors.city}
        />

        <Input
          label="State *"
          placeholder="Enter state"
          value={formData.state}
          onChange={(e) => handleChange('state', e.target.value)}
          error={errors.state}
        />
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Create Lead
        </Button>
      </div>
    </form>
  );
};

export default CreateLeadForm;
