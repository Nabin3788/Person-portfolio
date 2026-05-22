import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Home/Home.css';

const Admin = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      loadMessages();
    }
  }, [loading, user]);

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/contact/messages', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : data.contacts || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStatusMessage(errorData.error || 'Unable to load messages.');
      }
    } catch (err) {
      setStatusMessage('Unable to load messages.');
    }
  };

  const handleReplyChange = (id, value) => {
    setReplyDrafts((prev) => ({ ...prev, [id]: value }));
  };

  const handleReplySubmit = async (id) => {
    const reply = replyDrafts[id]?.trim();
    if (!reply) {
      setStatusMessage('Reply cannot be empty.');
      return;
    }

    try {
      const response = await fetch('/api/contact/reply', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, reply }),
      });

      const data = await response.json();
      if (!response.ok) {
        setStatusMessage(data.error || 'Unable to send reply.');
        return;
      }

      setStatusMessage('Reply sent successfully.');
      setReplyDrafts((prev) => ({ ...prev, [id]: '' }));
      loadMessages();
    } catch (err) {
      setStatusMessage('Unable to send reply.');
    }
  };

  if (loading) {
    return <main className="home-page"><p className="hero-copy">Checking admin session...</p></main>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <main className="home-page">
        <section className="section-panel">
          <h2 className="section-heading">Admin access required</h2>
          <p className="hero-copy">
            This page is only available to authorized administrators. Please sign in with admin credentials.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="home-page">
      <section className="hero-panel auth-panel">
        <div className="hero-background" />
        <div className="hero-content">
          <span className="eyebrow">Admin dashboard</span>
          <h1>Review and reply to contact requests</h1>
          <p className="hero-copy">Welcome back, {user.name}. Below are the signed-in user messages that await your response.</p>
          <div className="home-buttons">
            <button type="button" className="btn btn-cv" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
      </section>

      <section className="section-panel">
        <h2 className="section-heading">Incoming messages</h2>
        {statusMessage && <p className="form-error">{statusMessage}</p>}
        {messages.length === 0 ? (
          <p className="hero-copy">No user messages have been received yet.</p>
        ) : (
          messages.map((message) => (
            <article key={message.id} className="project-card message-card">
              <div className="message-header">
                <div>
                  <h3>{message.name}</h3>
                  <p>{message.email}</p>
                </div>
                <span className="message-status">{message.status}</span>
              </div>
              <div className="chat-thread">
                {(Array.isArray(message.messages) && message.messages.length > 0
                  ? message.messages
                  : [{ id: `${message.id}-orig`, sender: 'user', text: message.message, createdAt: message.createdAt }]
                ).map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-item ${msg.sender === 'user' ? 'chat-admin-item' : 'chat-user-item'}`}
                  >
                    <div className={`chat-bubble ${msg.sender === 'user' ? 'chat-user' : 'chat-admin'}`}>
                      <div className="chat-meta">
                        <span className="chat-author">{msg.sender === 'user' ? message.name || 'User' : 'Admin'}</span>
                      </div>
                      <p>{msg.text}</p>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="reply-form">
                <label htmlFor={`reply-${message.id}`} className="form-label">Reply</label>
                <textarea
                  id={`reply-${message.id}`}
                  className="form-control"
                  rows="3"
                  value={replyDrafts[message.id] || ''}
                  onChange={(event) => handleReplyChange(message.id, event.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-hire"
                  onClick={() => handleReplySubmit(message.id)}
                >
                  Send reply
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default Admin;
