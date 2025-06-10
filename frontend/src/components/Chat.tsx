import { useState, useEffect, useRef } from 'react';
import { apiClient, ChatResponse } from '../lib/api';
import { useApi } from '../hooks/useApi';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { loading: isLoading, error, execute: sendMessage } = useApi<ChatResponse>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');

    try {
      const context = messages.slice(-5).map(msg => msg.content); // Last 5 messages for context
      const response = await sendMessage(() => 
        apiClient.sendChatMessage(messageToSend, sessionId, context)
      );

      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        content: response.response,
        sender: 'bot',
        timestamp: response.timestamp,
      };

      setMessages(prev => [...prev, botMessage]);
      setSessionId(response.sessionId);
      setSuggestions(response.suggestions);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage: Message = {
        id: `bot_error_${Date.now()}`,
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const useSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const sampleEmails = [
    {
      subject: 'Urgent: Account Verification Required',
      sender: 'security@suspicious-bank.com',
      preview: 'Your account will be suspended...'
    },
    {
      subject: 'Congratulations! You\'ve Won $1,000,000!',
      sender: 'winner@lottery-scam.com',
      preview: 'Claim your prize now...'
    },
    {
      subject: 'Bank Security Alert',
      sender: 'alert@fake-bank.net',
      preview: 'Unusual activity detected...'
    },
    {
      subject: 'Refund Processing - Action Required',
      sender: 'refunds@phishing-site.org',
      preview: 'Click here to claim your refund...'
    }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside className="inbox">
        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e5e5' }}>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Sample Suspicious Emails</h3>
        </div>
        {sampleEmails.map((email, index) => (
          <div key={index} className="email-item" onClick={() => 
            setInputMessage(`Can you analyze this email? Subject: "${email.subject}" From: ${email.sender} Content: ${email.preview}`)
          }>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {email.subject}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
                From: {email.sender}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>
                {email.preview}
              </div>
            </div>
          </div>
        ))}
      </aside>
      
      <section className="chat-panel">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', marginTop: '2rem', padding: '1rem' }}>
              <h2>🛡️ ScamMail AI Assistant</h2>
              <p>I can help you analyze emails for potential scams and phishing attempts.</p>
              <p>Try asking me about suspicious emails or click on sample emails in the sidebar.</p>
              <div style={{ marginTop: '1rem' }}>
                <strong>Example questions:</strong>
                <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '0.5rem' }}>
                  <li>"Is this email suspicious?"</li>
                  <li>"What are signs of phishing emails?"</li>
                  <li>"How can I verify if an email is legitimate?"</li>
                </ul>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className={`chat-bubble ${message.sender}`}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-bubble bot">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>Analyzing...</span>
                <div style={{ marginLeft: '0.5rem' }}>⏳</div>
              </div>
            </div>
          )}

          {error && (
            <div className="chat-bubble bot" style={{ backgroundColor: '#fee', color: '#c00' }}>
              Error: {error}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {suggestions.length > 0 && (
          <div style={{ padding: '0.5rem', borderTop: '1px solid #e5e5e5', background: '#f9f9f9' }}>
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#666' }}>
              💡 Suggested actions:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => useSuggestion(suggestion)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    background: 'white',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#f0f0f0'}
                  onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'white'}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="chat-input">
          <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem' }}>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message about email security, paste email content for analysis, or ask about scam detection..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                resize: 'none',
                minHeight: '50px',
                maxHeight: '120px',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: inputMessage.trim() && !isLoading ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                alignSelf: 'flex-end',
                transition: 'background-color 0.2s',
              }}
            >
              {isLoading ? '⏳' : 'Send'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
