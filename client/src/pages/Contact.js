import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Home/Home.css";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiLinkedin,
  FiGithub,
  FiTwitter,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

const Contact = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState(null);
  const [userMessages, setUserMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const threadRef = useRef(null);

  const activeThread = userMessages.find(
    (item) => item.id === selectedConversationId,
  );
  const threadMessages = activeThread?.messages || [];

  useEffect(() => {
    if (user) {
      setFormData((current) => ({
        ...current,
        name: user.name || current.name,
        email: user.email || current.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchUserMessages = async () => {
      if (!user) return;
      try {
        const response = await fetch("/api/contact/mine", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          const messages = Array.isArray(data) ? data : [];
          setUserMessages(messages);
          if (!selectedConversationId && messages.length > 0) {
            setSelectedConversationId(messages[0].id);
          }
          if (
            selectedConversationId &&
            !messages.some((item) => item.id === selectedConversationId)
          ) {
            setSelectedConversationId(
              messages.length > 0 ? messages[0].id : null,
            );
          }
        }
      } catch (error) {
        // ignore failures for now
      }
    };

    fetchUserMessages();
  }, [user, statusMessage, selectedConversationId]);

  useEffect(() => {
    const targetId =
      location.state?.messageId || location.hash?.replace("#", "");
    if (targetId) {
      setSelectedConversationId(targetId);
    }
  }, [location]);

  useEffect(() => {
    if (!threadRef.current) return;
    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [userMessages, selectedConversationId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage(null);

    const isExistingThread = !!selectedConversationId;
    const endpoint = isExistingThread
      ? `/api/contact/${selectedConversationId}/message`
      : "/api/contact";
    const payload = isExistingThread
      ? { message: formData.message }
      : {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setStatusMessage(data.error || "Unable to send message.");
        return;
      }

      const conversation = isExistingThread ? data.conversation : data;
      setFormData((current) => ({ ...current, message: "" }));

      if (isExistingThread) {
        setUserMessages((current) =>
          current.map((item) =>
            item.id === conversation.id ? conversation : item,
          ),
        );
      } else {
        setUserMessages((current) => [...current, conversation]);
        if (conversation.id) {
          setSelectedConversationId(conversation.id);
        }
      }
    } catch (err) {
      setStatusMessage("Unable to contact the server.");
    }
  };

  return (
    <main className="home-page">
      <section className="hero-panel">
        <div className="hero-background" />
        <div className="hero-content">
          <span className="eyebrow">Let's connect</span>
          <h1>Ready to build your next web product.</h1>
          <p className="hero-copy">
            Sign in using the secure portal to share your message with the
            admin. Your request will be handled privately.
          </p>
          <div className="home-buttons">
            {!user ? (
              <Link className="btn btn-hire" to="/login">
                Sign in to contact
              </Link>
            ) : (
              <span className="btn btn-cv">Signed in as {user.name}</span>
            )}
          </div>
        </div>
      </section>

      <section className="section-panel contact-panel chat-panel">
        <div>
          <h2 className="section-heading">Your conversation</h2>
          <p className="hero-copy">
            Keep chat history in one place and continue replying in the same
            thread.
          </p>
        </div>

        {user ? (
          <>
            <div className="chat-card">
              <div className="chat-header">
                <div>
                  <h3>Conversation with Admin</h3>
                  <p className="chat-subtitle">
                    {activeThread
                      ? `Last update: ${new Date(activeThread.updatedAt || activeThread.createdAt).toLocaleString()}`
                      : "Start a new private message thread with admin."}
                  </p>
                </div>
                <span
                  className={`chat-status ${activeThread?.status || "new"}`}
                >
                  {activeThread ? activeThread.status : "new"}
                </span>
              </div>

              <div className="chat-thread" ref={threadRef}>
                {threadMessages.length > 0 ? (
                  threadMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-item ${msg.sender === "user" ? "chat-user-item" : "chat-admin-item"}`}
                    >
                      <div
                        className={`chat-bubble ${msg.sender === "user" ? "chat-user" : "chat-admin"}`}
                      >
                        <div className="chat-meta">
                          <span className="chat-author">
                            {msg.sender === "user" ? "You" : "Admin"}
                          </span>
                        </div>
                        <p>{msg.text}</p>
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="chat-empty">
                    No messages yet. Start the chat below and your conversation
                    will appear here.
                  </div>
                )}
              </div>

              <div className="chat-input-area">
                {statusMessage && <p className="form-error">{statusMessage}</p>}
                <form className="contact-form" onSubmit={handleSubmit}>
                  {!selectedConversationId && (
                    <>
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          className="form-control"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}
                  <div className="form-group">
                    <label htmlFor="message">
                      {selectedConversationId
                        ? "Send a message"
                        : "Start the conversation"}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      className="form-control"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-hire">
                    {selectedConversationId ? "Reply" : "Start chat"}
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="footer-card">
            <p className="hero-copy">
              You must sign in before sending a message. Register or login to
              continue.
            </p>
            <Link className="btn btn-hire" to="/login">
              Sign in now
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default Contact;
