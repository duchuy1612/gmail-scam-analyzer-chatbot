import { useState } from 'react';
import { apiClient, EmailAnalysisResult } from '../lib/api';
import { useApi } from '../hooks/useApi';
import Card from './Card';
import Badge from './Badge';
import AlertBanner from './AlertBanner';

export default function EmailAnalyzer() {
  const [emailData, setEmailData] = useState({
    subject: '',
    body: '',
    sender: '',
    recipient: '',
  });
  
  const { data: analysis, loading: isLoading, error, execute: analyzeEmail } = useApi<EmailAnalysisResult>();

  const handleAnalyze = async () => {
    if (!emailData.subject || !emailData.body || !emailData.sender || !emailData.recipient) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await analyzeEmail(() => apiClient.analyzeEmail(emailData));
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'safe';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'phishing';
      case 'CRITICAL': return 'phishing';
      default: return 'safe';
    }
  };

  const getRiskEmoji = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return '✅';
      case 'MEDIUM': return '⚠️';
      case 'HIGH': return '🚨';
      case 'CRITICAL': return '🔴';
      default: return '❓';
    }
  };

  const loadSampleEmail = (type: 'phishing' | 'legitimate' | 'suspicious') => {
    const samples = {
      phishing: {
        subject: 'URGENT: Verify Your Account Immediately',
        body: 'Dear Customer,\n\nYour account will be suspended in 24 hours unless you verify your information immediately. Click the link below to avoid suspension:\n\nhttps://verify-account-now.suspicious-site.com/login\n\nThis is an automated message. Do not reply.\n\nBank Security Team',
        sender: 'security@fake-bank-alerts.com',
        recipient: 'user@example.com'
      },
      legitimate: {
        subject: 'Monthly Statement Available',
        body: 'Hello,\n\nYour monthly statement for Account ending in 1234 is now available in your online banking portal.\n\nTo view your statement, please log in to your account at our official website.\n\nIf you have any questions, please contact us at our official customer service number.\n\nBest regards,\nCustomer Service Team',
        sender: 'statements@realbank.com',
        recipient: 'user@example.com'
      },
      suspicious: {
        subject: 'Congratulations! You have won $500,000',
        body: 'Dear Winner,\n\nCongratulations! You have been selected as the winner of our international lottery. You have won $500,000!\n\nTo claim your prize, please send us your personal information including:\n- Full name\n- Address\n- Phone number\n- Bank account details\n\nSend this information to: claims@lottery-winner.org\n\nClaim your prize within 48 hours!',
        sender: 'lottery@winner-notification.biz',
        recipient: 'user@example.com'
      }
    };
    
    setEmailData(samples[type]);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>🛡️ Email Scam Analyzer</h1>
      
      {error && (
        <AlertBanner type="error">
          Analysis failed: {error}
        </AlertBanner>
      )}

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: analysis ? '1fr 1fr' : '1fr' }}>
        <Card title="Email Information">
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                onClick={() => loadSampleEmail('phishing')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Load Phishing Sample
              </button>
              <button
                onClick={() => loadSampleEmail('suspicious')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ffc107',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Load Suspicious Sample
              </button>
              <button
                onClick={() => loadSampleEmail('legitimate')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Load Legitimate Sample
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Subject *
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                placeholder="Enter email subject"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                From Email *
              </label>
              <input
                type="email"
                value={emailData.sender}
                onChange={(e) => setEmailData({ ...emailData, sender: e.target.value })}
                placeholder="sender@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                To Email *
              </label>
              <input
                type="email"
                value={emailData.recipient}
                onChange={(e) => setEmailData({ ...emailData, recipient: e.target.value })}
                placeholder="recipient@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Email Body *
              </label>
              <textarea
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                placeholder="Paste the email content here..."
                rows={8}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  resize: 'vertical',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !emailData.subject || !emailData.body || !emailData.sender || !emailData.recipient}
              style={{
                padding: '1rem',
                backgroundColor: isLoading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Email'}
            </button>
          </div>
        </Card>

        {analysis && (
          <Card title="Analysis Results">
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                  {getRiskEmoji(analysis.riskLevel)}
                </div>
                <Badge type={getRiskColor(analysis.riskLevel)}>
                  {analysis.riskLevel} RISK
                </Badge>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                  {Math.round(analysis.scamProbability * 100)}% Scam Probability
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  Confidence: {Math.round(analysis.confidence * 100)}%
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>Explanation</h4>
                <p style={{ margin: 0, lineHeight: 1.5 }}>{analysis.explanation}</p>
              </div>

              {analysis.redFlags.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '0.5rem' }}>🚩 Red Flags Detected</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    {analysis.redFlags.map((flag, index) => (
                      <li key={index} style={{ marginBottom: '0.25rem' }}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center' }}>
                Analysis ID: {analysis.analysisId}
                <br />
                Analyzed at: {new Date(analysis.analyzedAt).toLocaleString()}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
