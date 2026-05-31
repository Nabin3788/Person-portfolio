import React, { useContext, useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";
import Menus from "../Menus/Menus";
import { AuthContext } from "../../context/AuthContext";

const Layout = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setDropdownOpen(false);
      return;
    }

    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const response = await fetch("/api/notifications", {
          credentials: "include",
        });
        if (!response.ok) {
          setNotifications([]);
          setUnreadCount(0);
          return;
        }

        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch (error) {
        setNotifications([]);
        setUnreadCount(0);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const markNotificationRead = async (messageId) => {
    try {
      await fetch(`/api/notifications/read/${messageId}`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      // ignore read errors for now
    }
  };

  const goToReply = async (messageId) => {
    await markNotificationRead(messageId);
    setNotifications((current) =>
      current.filter((item) => item.id !== messageId),
    );
    setUnreadCount((current) => Math.max(0, current - 1));
    setDropdownOpen(false);
    navigate("/contact", { state: { messageId } });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen((current) => !current);
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((current) => !current);
  };

  return (
    <div className="app-shell">
      <header className="navbar" ref={dropdownRef}>
        <div className="navbar-brand">
          <div className="brand-ring" />
          <span>Portfolio</span>
        </div>
        <button
          type="button"
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
        <div className={`navbar-menu ${menuOpen ? "open" : "closed"}`}>
          <Menus />
        </div>
        {user && (
          <div className="notification-wrapper">
            <button
              type="button"
              className="notification-button"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
              aria-label="View admin replies"
            >
              <span className="notification-icon">🔔</span>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            {dropdownOpen && (
              <div className="notification-panel">
                <div className="notification-panel-header">
                  <span>Admin replies</span>
                  <button
                    type="button"
                    className="notification-close"
                    onClick={() => setDropdownOpen(false)}
                  >
                    ×
                  </button>
                </div>
                {loadingNotifications ? (
                  <p className="notification-loading">Loading replies…</p>
                ) : notifications.length === 0 ? (
                  <p className="notification-empty">
                    No admin replies yet. You will see them here once the admin
                    responds.
                  </p>
                ) : (
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="notification-item notification-action"
                      onClick={() => goToReply(item.id)}
                    >
                      <div className="notification-item-header">
                        <span className="notification-title">
                          Reply received
                        </span>
                        <time>
                          {new Date(item.lastReplyAt).toLocaleString()}
                        </time>
                      </div>
                      <p className="notification-message">
                        {item.replies[item.replies.length - 1]?.text}
                      </p>
                      <p className="notification-context">
                        View reply in your message thread
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </header>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
