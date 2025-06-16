-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS gmail_scam_analyzer;
USE gmail_scam_analyzer;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create email_analyses table
CREATE TABLE IF NOT EXISTS email_analyses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    email_content TEXT NOT NULL,
    email_subject VARCHAR(500),
    email_sender VARCHAR(255),
    analysis_result JSON NOT NULL,
    risk_score DECIMAL(3,2) NOT NULL,
    is_scam BOOLEAN NOT NULL,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_analyzed_at (analyzed_at),
    INDEX idx_risk_score (risk_score)
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) DEFAULT 'New Chat',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id VARCHAR(36) NOT NULL,
    role ENUM('user', 'assistant') NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at)
);

-- Create gmail_messages table
CREATE TABLE IF NOT EXISTS gmail_messages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    gmail_id VARCHAR(255) NOT NULL,
    thread_id VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    sender VARCHAR(255),
    snippet VARCHAR(1000),
    body TEXT,
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_gmail_user_id (user_id),
    INDEX idx_imported_at (imported_at)
);

-- Insert mock users (passwords are hashed for 'password123')
INSERT INTO users (id, email, name, password) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'John Doe', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeANh0pnEP1Hc8Oz6'),
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', 'Jane Smith', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeANh0pnEP1Hc8Oz6'),
('550e8400-e29b-41d4-a716-446655440003', 'admin@example.com', 'Admin User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeANh0pnEP1Hc8Oz6');

-- Insert mock email analyses
INSERT INTO email_analyses (id, user_id, email_content, email_subject, email_sender, analysis_result, risk_score, is_scam, analyzed_at) VALUES 
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 
    'Dear Customer, Your account has been suspended. Click here to verify your identity immediately: http://suspicious-link.com',
    'URGENT: Account Verification Required',
    'security@fake-bank.com',
    '{"indicators": ["suspicious_links", "urgency_language", "impersonation"], "confidence": 0.95, "details": "High probability phishing attempt"}',
    0.95, true, '2024-12-01 10:30:00'),
    
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001',
    'Hi John, Thanks for your order! Your package will arrive tomorrow. Tracking: 1234567890',
    'Package Delivery Update',
    'noreply@legitimate-store.com',
    '{"indicators": [], "confidence": 0.05, "details": "Legitimate delivery notification"}',
    0.05, false, '2024-12-01 14:15:00'),
    
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002',
    'Congratulations! You have won $1,000,000! Send us your bank details to claim your prize.',
    'YOU ARE A WINNER!!!',
    'winner@lottery-scam.com',
    '{"indicators": ["money_request", "too_good_to_be_true", "suspicious_sender"], "confidence": 0.98, "details": "Classic lottery scam"}',
    0.98, true, '2024-12-01 16:45:00');

-- Insert mock chat sessions
INSERT INTO chat_sessions (id, user_id, title, created_at) VALUES 
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Email Security Help', '2024-12-01 09:00:00'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Phishing Detection Tips', '2024-12-01 11:30:00');

-- Insert mock chat messages
INSERT INTO chat_messages (id, session_id, role, content, created_at) VALUES 
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'user', 'How can I identify phishing emails?', '2024-12-01 09:01:00'),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'assistant', 'Here are key signs of phishing emails: 1) Urgent language demanding immediate action, 2) Suspicious links or attachments, 3) Requests for personal information, 4) Poor grammar or spelling, 5) Sender address doesn\'t match the claimed organization.', '2024-12-01 09:01:30'),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', 'user', 'What should I do if I receive a suspicious email?', '2024-12-01 11:31:00'),
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', 'assistant', 'If you receive a suspicious email: 1) Don\'t click any links or download attachments, 2) Don\'t reply or provide any information, 3) Report it to your IT department or email provider, 4) Delete the email, 5) Use our analyzer tool to verify if it\'s a scam.', '2024-12-01 11:31:45');
