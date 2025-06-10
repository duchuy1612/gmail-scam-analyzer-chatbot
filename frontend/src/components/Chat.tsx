export default function Chat() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside className="inbox">
        <div className="email-item">
          <span>📧</span>
          <span style={{ marginLeft: '0.5rem' }}>Email 1</span>
        </div>
        <div className="email-item">
          <span>📧</span>
          <span style={{ marginLeft: '0.5rem' }}>Email 2</span>
        </div>
        <div className="email-item">
          <span>📧</span>
          <span style={{ marginLeft: '0.5rem' }}>Email 3</span>
        </div>
      </aside>
      <section className="chat-panel">
        <div className="chat-messages">
          <div className="chat-bubble user">Is this phishing?</div>
          <div className="chat-bubble bot">
            Yes, risk score 87%. Domain mismatch detected.
          </div>
        </div>
        <div className="chat-input">
          <input style={{ width: '100%', padding: '0.5rem' }} placeholder="Type a message" />
        </div>
      </section>
    </div>
  );
}
