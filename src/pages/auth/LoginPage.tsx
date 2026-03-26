import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { authService, MOCK_CREDENTIALS } from '../../services/auth/authService';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'ADMIN' as 'ADMIN' | 'DSA' | 'AGENT',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '', general: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '', general: '' };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({ email: '', password: '', general: '' });

    try {
      const response = await authService.login(formData);

      if (response.success) {
        // Redirect based on role
        const roleRoutes = {
          ADMIN: '/admin/dashboard',
          DSA: '/dsa/dashboard',
          AGENT: '/agent/dashboard',
        };
        navigate(roleRoutes[formData.role]);
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: 'Invalid credentials. Please try again.',
      }));
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'ADMIN' | 'DSA' | 'AGENT') => {
    const creds = MOCK_CREDENTIALS[role.toLowerCase() as keyof typeof MOCK_CREDENTIALS];
    setFormData({
      email: creds.email,
      password: creds.password,
      role: role,
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-branding">
  <div className="brand-logo">
    <span className="brand-mark">CN</span>
  </div>
  <h1 className="brand-title">CredNova</h1>
  <p className="brand-subtitle">
    Unified ecosystem for DSAs, NBFCs & Banks
  </p>
</div>


          <div className="login-features">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div className="feature-text">
                <strong>Real-time Lead Management</strong>
                <p>Track every customer from inquiry to disbursement</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏦</span>
              <div className="feature-text">
                <strong>40+ Banking Partners</strong>
                <p>Access to NBFCs, banks and lending institutions</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <div className="feature-text">
                <strong>Automated Commissions</strong>
                <p>Transparent payout tracking and processing</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Sign in to continue to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <Select
                label="Login As"
                options={[
                  { value: 'ADMIN', label: 'Admin' },
                  { value: 'DSA', label: 'DSA Owner' },
                  { value: 'AGENT', label: 'Field Agent' },
                ]}
                value={formData.role}
                onChange={e => handleChange('role', e.target.value)}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                error={errors.email}
                icon="📧"
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={e => handleChange('password', e.target.value)}
                error={errors.password}
                icon="🔒"
              />

              {errors.general && (
                <div className="login-error-banner">{errors.general}</div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
              >
                Sign In
              </Button>
            </form>

            <div className="login-demo-section">
              <div className="demo-divider">
                <span>Demo Credentials</span>
              </div>
              <div className="demo-buttons">
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => fillDemoCredentials('ADMIN')}
                >
                  Use Admin
                </button>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => fillDemoCredentials('DSA')}
                >
                  Use DSA
                </button>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => fillDemoCredentials('AGENT')}
                >
                  Use Agent
                </button>
              </div>
            </div>
          </div>

          <div className="login-footer">
            <p>© 2026 DSA Lending Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
