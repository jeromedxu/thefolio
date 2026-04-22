import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "the-folio-community-v1";

const seedCommunity = {
  users: [
    {
      id: "admin-1",
      name: "Admin",
      email: "admin@thefolio.local",
      role: "admin",
      status: "active",
      bio: "Guiding the community and keeping the routes safe.",
      location: "Nueva Vizcaya",
    },
    {
      id: "traveler-101",
      name: "Traveler101",
      email: "traveler101@thefolio.local",
      role: "member",
      status: "active",
      bio: "Weekend rider chasing mountain roads and sunrise stops.",
      location: "Baguio",
    },
    {
      id: "biker-pro",
      name: "BikerPro",
      email: "bikerpro@thefolio.local",
      role: "member",
      status: "inactive",
      bio: "Currently paused by admin review.",
      location: "Tarlac",
    },
  ],
  posts: [
    {
      id: "post-1",
      authorId: "admin-1",
      authorName: "Admin",
      authorRole: "admin",
      content:
        "Welcome to the new community feed. Share recent rides, ask for route advice, and keep the comments respectful.",
      status: "active",
      createdAt: "2026-04-19T08:30:00.000Z",
      reactions: {
        support: ["traveler-101"],
        route: [],
      },
      comments: [
        {
          id: "comment-1",
          authorId: "traveler-101",
          authorName: "Traveler101",
          content: "This layout looks cleaner. Can we start a Benguet ride thread next?",
          createdAt: "2026-04-19T10:10:00.000Z",
          replies: [
            {
              id: "reply-1",
              authorId: "admin-1",
              authorName: "Admin",
              content: "Yes. Drop your suggested route and schedule below.",
              createdAt: "2026-04-19T10:40:00.000Z",
            },
          ],
        },
      ],
    },
    {
      id: "post-2",
      authorId: "traveler-101",
      authorName: "Traveler101",
      authorRole: "member",
      content:
        "Just reached the summit of Mt. Pulag. Cold wind, clear trail, and a perfect sunrise over the ridge.",
      status: "active",
      createdAt: "2026-04-20T06:05:00.000Z",
      reactions: {
        support: ["admin-1"],
        route: ["admin-1"],
      },
      comments: [],
    },
  ],
  conversations: [
    {
      id: "thread-1",
      fromId: "traveler-101",
      fromName: "Traveler101",
      subject: "Feature request",
      body: "Can members upload route photos from the profile area next?",
      createdAt: "2026-04-20T11:00:00.000Z",
      status: "open",
      replies: [
        {
          id: "thread-1-reply-1",
          authorId: "admin-1",
          authorName: "Admin",
          authorRole: "admin",
          content: "That is on the shortlist after the community feed rollout.",
          createdAt: "2026-04-20T12:10:00.000Z",
        },
      ],
    },
  ],
};

function readCommunityState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return seedCommunity;
    }

    const parsed = JSON.parse(stored);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : seedCommunity.users,
      posts: Array.isArray(parsed.posts) ? parsed.posts : seedCommunity.posts,
      conversations: Array.isArray(parsed.conversations)
        ? parsed.conversations
        : seedCommunity.conversations,
    };
  } catch (error) {
    return seedCommunity;
  }
}

function formatStamp(value) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function HomePage() {
  const { user, setUser } = useAuth();
  const [community, setCommunity] = useState(readCommunityState);
  const [newPost, setNewPost] = useState("");
  const [profileDraft, setProfileDraft] = useState({
    name: "",
    bio: "",
    location: "",
  });
  const [messageDraft, setMessageDraft] = useState({ subject: "", body: "" });
  const [commentDrafts, setCommentDrafts] = useState({});
  const [replyDrafts, setReplyDrafts] = useState({});
  const [conversationReplyDrafts, setConversationReplyDrafts] = useState({});
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const viewer = useMemo(() => {
    if (!user) {
      return null;
    }

    return {
      id: user._id || user.id || user.email || "current-user",
      name: user.name || user.username || "Traveler",
      email: user.email || "",
      role: user.role === "admin" ? "admin" : "member",
      status: user.status || "active",
      bio: user.bio || "",
      location: user.location || "",
    };
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(community));
  }, [community]);

  useEffect(() => {
    if (!viewer) {
      return;
    }

    setCommunity((prev) => {
      const existing = prev.users.find((item) => item.id === viewer.id);
      const nextUsers = existing
        ? prev.users.map((item) =>
            item.id === viewer.id
              ? {
                  ...item,
                  name: viewer.name,
                  email: viewer.email,
                  role: viewer.role,
                  bio: viewer.bio || item.bio,
                  location: viewer.location || item.location,
                }
              : item
          )
        : [{ ...viewer }, ...prev.users];

      return { ...prev, users: nextUsers };
    });
  }, [viewer]);

  const communityViewer = viewer
    ? community.users.find((item) => item.id === viewer.id) || viewer
    : null;
  const isLoggedIn = Boolean(communityViewer);
  const isAdmin = communityViewer?.role === "admin";
  const isActiveUser = communityViewer?.status !== "inactive";

  useEffect(() => {
    if (!communityViewer) {
      setProfileDraft({ name: "", bio: "", location: "" });
      return;
    }

    setProfileDraft({
      name: communityViewer.name || "",
      bio: communityViewer.bio || "",
      location: communityViewer.location || "",
    });
  }, [communityViewer]);

  useEffect(() => {
    if (!activeMessageId && community.conversations.length) {
      setActiveMessageId(community.conversations[0].id);
    }
  }, [activeMessageId, community.conversations]);

  const visiblePosts = community.posts.filter(
    (post) => post.status === "active" || isAdmin
  );
  const activeUsers = community.users.filter((member) => member.status === "active");
  const openThreads = community.conversations.filter(
    (thread) => thread.status === "open"
  );
  const userThreads = isAdmin
    ? community.conversations
    : community.conversations.filter((thread) => thread.fromId === communityViewer?.id);
  const activeConversation =
    userThreads.find((thread) => thread.id === activeMessageId) || userThreads[0] || null;
  const myPostsCount = communityViewer
    ? community.posts.filter((post) => post.authorId === communityViewer.id).length
    : 0;
  const myMessagesCount = communityViewer
    ? community.conversations.filter((thread) => thread.fromId === communityViewer.id).length
    : 0;

  const resetStatus = (message) => {
    setStatusMessage(message);
    window.clearTimeout(HomePage.statusTimer);
    HomePage.statusTimer = window.setTimeout(() => setStatusMessage(""), 2600);
  };

  const updatePosts = (updater) => {
    setCommunity((prev) => ({ ...prev, posts: updater(prev.posts) }));
  };

  const handleCreatePost = (event) => {
    event.preventDefault();
    if (!isLoggedIn) {
      resetStatus("Login or register first to publish a post.");
      return;
    }
    if (!isActiveUser) {
      resetStatus("Your account is deactivated. Contact the admin to restore access.");
      return;
    }
    if (!newPost.trim()) {
      return;
    }

    const entry = {
      id: `post-${Date.now()}`,
      authorId: communityViewer.id,
      authorName: profileDraft.name || communityViewer.name,
      authorRole: communityViewer.role,
      content: newPost.trim(),
      status: "active",
      createdAt: new Date().toISOString(),
      reactions: { support: [], route: [] },
      comments: [],
    };

    updatePosts((prevPosts) => [entry, ...prevPosts]);
    setNewPost("");
    resetStatus("Post published to the homepage feed.");
  };

  const toggleReaction = (postId, reactionType) => {
    if (!isLoggedIn) {
      resetStatus("Login is required before reacting to posts.");
      return;
    }
    if (!isActiveUser) {
      resetStatus("This account is inactive and cannot react.");
      return;
    }

    updatePosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        const current = post.reactions?.[reactionType] || [];
        const nextList = current.includes(communityViewer.id)
          ? current.filter((id) => id !== communityViewer.id)
          : [...current, communityViewer.id];

        return {
          ...post,
          reactions: {
            ...post.reactions,
            [reactionType]: nextList,
          },
        };
      })
    );
  };

  const submitComment = (postId) => {
    const content = commentDrafts[postId]?.trim();
    if (!isLoggedIn) {
      resetStatus("Login is required before commenting.");
      return;
    }
    if (!isActiveUser) {
      resetStatus("This account is inactive and cannot comment.");
      return;
    }
    if (!content) {
      return;
    }

    updatePosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `comment-${Date.now()}`,
                  authorId: communityViewer.id,
                  authorName: communityViewer.name,
                  content,
                  createdAt: new Date().toISOString(),
                  replies: [],
                },
              ],
            }
          : post
      )
    );
    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
  };

  const submitReply = (postId, commentId) => {
    const key = `${postId}-${commentId}`;
    const content = replyDrafts[key]?.trim();
    if (!isLoggedIn) {
      resetStatus("Login is required before replying.");
      return;
    }
    if (!isActiveUser) {
      resetStatus("This account is inactive and cannot reply.");
      return;
    }
    if (!content) {
      return;
    }

    updatePosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      replies: [
                        ...comment.replies,
                        {
                          id: `reply-${Date.now()}`,
                          authorId: communityViewer.id,
                          authorName: communityViewer.name,
                          content,
                          createdAt: new Date().toISOString(),
                        },
                      ],
                    }
                  : comment
              ),
            }
          : post
      )
    );
    setReplyDrafts((prev) => ({ ...prev, [key]: "" }));
  };

  const togglePostStatus = (postId) => {
    if (!isAdmin) {
      return;
    }

    updatePosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              status: post.status === "active" ? "inactive" : "active",
            }
          : post
      )
    );
  };

  const toggleUserStatus = (userId) => {
    if (!isAdmin) {
      return;
    }

    setCommunity((prev) => ({
      ...prev,
      users: prev.users.map((member) =>
        member.id === userId
          ? {
              ...member,
              status: member.status === "active" ? "inactive" : "active",
            }
          : member
      ),
    }));
  };

  const handleProfileUpdate = (event) => {
    event.preventDefault();
    if (!communityViewer || !isActiveUser) {
      return;
    }

    const trimmedName = profileDraft.name.trim();
    if (!trimmedName) {
      return;
    }

    setCommunity((prev) => ({
      ...prev,
      users: prev.users.map((member) =>
        member.id === communityViewer.id
          ? {
              ...member,
              name: trimmedName,
              bio: profileDraft.bio.trim(),
              location: profileDraft.location.trim(),
            }
          : member
      ),
      posts: prev.posts.map((post) =>
        post.authorId === communityViewer.id
          ? { ...post, authorName: trimmedName }
          : post
      ),
      conversations: prev.conversations.map((thread) =>
        thread.fromId === communityViewer.id
          ? { ...thread, fromName: trimmedName }
          : thread
      ),
    }));

    if (setUser) {
      setUser((current) =>
        current
          ? {
              ...current,
              name: trimmedName,
              bio: profileDraft.bio.trim(),
              location: profileDraft.location.trim(),
            }
          : current
      );
    }

    resetStatus("Profile details updated.");
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!isLoggedIn) {
      resetStatus("Login or register first to message the admin.");
      return;
    }
    if (!isActiveUser) {
      resetStatus("Your account is inactive and cannot send messages.");
      return;
    }
    if (!messageDraft.subject.trim() || !messageDraft.body.trim()) {
      return;
    }

    const thread = {
      id: `thread-${Date.now()}`,
      fromId: communityViewer.id,
      fromName: communityViewer.name,
      subject: messageDraft.subject.trim(),
      body: messageDraft.body.trim(),
      createdAt: new Date().toISOString(),
      status: "open",
      replies: [],
    };

    setCommunity((prev) => ({
      ...prev,
      conversations: [thread, ...prev.conversations],
    }));
    setMessageDraft({ subject: "", body: "" });
    setActiveMessageId(thread.id);
    resetStatus("Message sent to admin.");
  };

  const replyToConversation = (threadId) => {
    const content = conversationReplyDrafts[threadId]?.trim();
    if (!content || !communityViewer || !isActiveUser) {
      return;
    }

    setCommunity((prev) => ({
      ...prev,
      conversations: prev.conversations.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              replies: [
                ...thread.replies,
                {
                  id: `thread-reply-${Date.now()}`,
                  authorId: communityViewer.id,
                  authorName: communityViewer.name,
                  authorRole: communityViewer.role,
                  content,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : thread
      ),
    }));
    setConversationReplyDrafts((prev) => ({ ...prev, [threadId]: "" }));
  };

  return (
    <>
      <section
        className="hero-section"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15, 76, 117, 0.3), rgba(15, 76, 117, 0.3)), url('/asset/travel28.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="section-overlay"></div>
        <div className="hero-content">
          <div className="hero-left">
            <h1>
              THE ROAD <span>AHEAD</span>
            </h1>
            <p className="hero-copy">
              A profile-driven community space where account features only open after
              login: update profile, post on the homepage, react, comment, reply,
              and message the admin team.
            </p>
            <div className="btn-group">
              <Link className="btn btn-solid" to={isLoggedIn ? "/profile" : "/login"}>
                {isLoggedIn ? "Open My Profile" : "Login To Join"}
              </Link>
              {!isLoggedIn && (
                <Link className="btn btn-outline" to="/register">
                  Register Account
                </Link>
              )}
            </div>
          </div>
          <div className="hero-right hero-visual-stack">
            <div className="hero-visual-card tall">
              <img src="/asset/travel2.jpg" alt="Open road through the mountains" />
            </div>
            <div className="hero-visual-card short">
              <img src="/asset/travel3.jpg" alt="Roadside travel route view" />
            </div>
          </div>
        </div>
      </section>

      <section className="content-block section-light">
        {!isLoggedIn ? (
          <div className="community-guest-card">
            <div className="guest-copy">
              <h2 className="slide-title">
                Member <span>Access</span>
              </h2>
              <p>
                The interactive features follow the profile-style account flow. Users
                need to login or register before they can edit profile details, post,
                react, comment, reply, or send messages to admin.
              </p>
              <div className="btn-group guest-actions">
                <Link className="btn btn-solid" to="/login">
                  Login
                </Link>
                <Link className="btn btn-outline community-outline" to="/register">
                  Register
                </Link>
              </div>
            </div>

            <div className="guest-preview-grid">
              <div className="preview-tile">
                <strong>Profile</strong>
                <span>Update display name, bio, and location after login.</span>
              </div>
              <div className="preview-tile">
                <strong>Posts</strong>
                <span>Create homepage updates and interact in the feed.</span>
              </div>
              <div className="preview-tile">
                <strong>Messages</strong>
                <span>Open a private thread with admin and continue replies.</span>
              </div>
              <div className="preview-tile">
                <strong>Admin</strong>
                <span>Admins can manage posts and activate or deactivate users.</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="profile-dashboard-card">
              <div className="profile-dashboard-main">
                <div className="profile-avatar">{communityViewer.name?.charAt(0) || "U"}</div>
                <div>
                  <h2 className="slide-title">
                    My <span>Dashboard</span>
                  </h2>
                  <p className="dashboard-copy">
                    Profile-centered account tools for posting, messaging, and community
                    participation.
                  </p>
                  <div className="community-meta">
                    <span className={`status-pill ${communityViewer.role === "admin" ? "admin" : "active"}`}>
                      {communityViewer.role}
                    </span>
                    <span className={`status-pill ${communityViewer.status}`}>
                      {communityViewer.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-stat-row">
                <div className="stat-card">
                  <strong>{myPostsCount}</strong>
                  <span>My posts</span>
                </div>
                <div className="stat-card">
                  <strong>{myMessagesCount}</strong>
                  <span>My messages</span>
                </div>
                <div className="stat-card">
                  <strong>{openThreads.length}</strong>
                  <span>Open threads</span>
                </div>
              </div>
            </div>

            <div className="split-grid community-shell">
              <aside className="community-sidebar">
                <div className="contact-form-container community-card">
                  <h3>Profile Settings</h3>
                  <form className="contact-form" onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                      <label htmlFor="profile-name">Display Name</label>
                      <input
                        id="profile-name"
                        type="text"
                        value={profileDraft.name}
                        onChange={(event) =>
                          setProfileDraft((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }))
                        }
                        disabled={!isActiveUser}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-location">Location</label>
                      <input
                        id="profile-location"
                        type="text"
                        value={profileDraft.location}
                        onChange={(event) =>
                          setProfileDraft((prev) => ({
                            ...prev,
                            location: event.target.value,
                          }))
                        }
                        disabled={!isActiveUser}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-bio">Bio</label>
                      <textarea
                        id="profile-bio"
                        rows="4"
                        value={profileDraft.bio}
                        onChange={(event) =>
                          setProfileDraft((prev) => ({
                            ...prev,
                            bio: event.target.value,
                          }))
                        }
                        disabled={!isActiveUser}
                      />
                    </div>
                    <button className="btn btn-solid" type="submit" disabled={!isActiveUser}>
                      Save Profile
                    </button>
                  </form>
                </div>

                <div className="contact-form-container community-card">
                  <h3>Messages</h3>
                  <form className="contact-form" onSubmit={handleSendMessage}>
                    <div className="form-group">
                      <label htmlFor="message-subject">Subject</label>
                      <input
                        id="message-subject"
                        type="text"
                        value={messageDraft.subject}
                        onChange={(event) =>
                          setMessageDraft((prev) => ({
                            ...prev,
                            subject: event.target.value,
                          }))
                        }
                        disabled={!isActiveUser}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message-body">Message</label>
                      <textarea
                        id="message-body"
                        rows="4"
                        value={messageDraft.body}
                        onChange={(event) =>
                          setMessageDraft((prev) => ({
                            ...prev,
                            body: event.target.value,
                          }))
                        }
                        disabled={!isActiveUser}
                      />
                    </div>
                    <button className="btn btn-solid" type="submit" disabled={!isActiveUser}>
                      Send To Admin
                    </button>
                  </form>

                  <div className="thread-list">
                    {userThreads.length ? (
                      userThreads.map((thread) => (
                        <button
                          key={thread.id}
                          className={`thread-item ${
                            activeConversation?.id === thread.id ? "active" : ""
                          }`}
                          onClick={() => setActiveMessageId(thread.id)}
                          type="button"
                        >
                          <strong>{thread.subject}</strong>
                          <span>{thread.fromName}</span>
                        </button>
                      ))
                    ) : (
                      <p className="helper-text">No messages yet.</p>
                    )}
                  </div>
                </div>
              </aside>

              <div className="feed-container">
                <div className="community-heading">
                  <div>
                    <h2 className="slide-title">
                      Community <span>Feed</span>
                    </h2>
                    <p>
                      The posting area now stays below the gallery so community activity
                      sits at the bottom of the homepage.
                    </p>
                  </div>
                  <div className="community-stat-grid">
                    <div className="stat-card">
                      <strong>{visiblePosts.length}</strong>
                      <span>Visible posts</span>
                    </div>
                    <div className="stat-card">
                      <strong>{activeUsers.length}</strong>
                      <span>Active users</span>
                    </div>
                    <div className="stat-card">
                      <strong>{openThreads.length}</strong>
                      <span>Open messages</span>
                    </div>
                  </div>
                </div>

                {statusMessage && <div className="flash-note">{statusMessage}</div>}

                <div className="contact-form-container post-composer">
                  <form onSubmit={handleCreatePost} className="contact-form">
                    <div className="composer-header">
                      <div>
                        <strong>{isLoggedIn ? communityViewer.name : "Guest"}</strong>
                        <span>
                          {isLoggedIn
                            ? isActiveUser
                              ? "Write an update for the homepage feed."
                              : "Account is inactive."
                            : "Login or register to publish a post."}
                        </span>
                      </div>
                      {isLoggedIn && (
                        <span className={`status-pill ${communityViewer.status}`}>
                          {communityViewer.role}
                        </span>
                      )}
                    </div>
                    <textarea
                      rows="4"
                      placeholder="Share your route, plan, announcement, or trip update..."
                      value={newPost}
                      onChange={(event) => setNewPost(event.target.value)}
                      disabled={!isLoggedIn || !isActiveUser}
                    ></textarea>
                    <button className="btn btn-solid" type="submit" disabled={!isLoggedIn || !isActiveUser}>
                      Post On Homepage
                    </button>
                  </form>
                </div>

                <div className="posts-list">
                  {visiblePosts.map((post) => {
                    const supportCount = post.reactions?.support?.length || 0;
                    const routeCount = post.reactions?.route?.length || 0;
                    const supportActive = post.reactions?.support?.includes(communityViewer?.id);
                    const routeActive = post.reactions?.route?.includes(communityViewer?.id);

                    return (
                      <article
                        key={post.id}
                        className={`contact-form-container post-card ${
                          post.status === "inactive" ? "muted" : ""
                        }`}
                      >
                        <div className="post-topline">
                          <div>
                            <div className="post-author-row">
                              <strong>{post.authorName}</strong>
                              <span
                                className={`status-pill ${
                                  post.authorRole === "admin" ? "admin" : "active"
                                }`}
                              >
                                {post.authorRole}
                              </span>
                            </div>
                            <span className="post-time">{formatStamp(post.createdAt)}</span>
                          </div>
                          {post.status === "inactive" && (
                            <span className="status-pill inactive">hidden from members</span>
                          )}
                        </div>

                        <p className="post-body">{post.content}</p>

                        <div className="reaction-row">
                          <button
                            className={`reaction-chip ${supportActive ? "active" : ""}`}
                            onClick={() => toggleReaction(post.id, "support")}
                            type="button"
                          >
                            Support {supportCount}
                          </button>
                          <button
                            className={`reaction-chip ${routeActive ? "active" : ""}`}
                            onClick={() => toggleReaction(post.id, "route")}
                            type="button"
                          >
                            Route Tip {routeCount}
                          </button>
                          <span className="comment-count">{post.comments.length} comments</span>
                        </div>

                        <div className="comment-thread">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="comment-card">
                              <div className="comment-header">
                                <strong>{comment.authorName}</strong>
                                <span>{formatStamp(comment.createdAt)}</span>
                              </div>
                              <p>{comment.content}</p>
                              <div className="reply-list">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="reply-card">
                                    <div className="comment-header">
                                      <strong>{reply.authorName}</strong>
                                      <span>{formatStamp(reply.createdAt)}</span>
                                    </div>
                                    <p>{reply.content}</p>
                                  </div>
                                ))}
                              </div>

                              <div className="inline-reply">
                                <input
                                  type="text"
                                  placeholder="Reply to this comment"
                                  value={replyDrafts[`${post.id}-${comment.id}`] || ""}
                                  onChange={(event) =>
                                    setReplyDrafts((prev) => ({
                                      ...prev,
                                      [`${post.id}-${comment.id}`]: event.target.value,
                                    }))
                                  }
                                  disabled={!isLoggedIn || !isActiveUser}
                                />
                                <button
                                  className="btn btn-solid"
                                  onClick={() => submitReply(post.id, comment.id)}
                                  type="button"
                                  disabled={!isLoggedIn || !isActiveUser}
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          ))}

                          <div className="inline-reply comment-entry">
                            <input
                              type="text"
                              placeholder="Add a comment"
                              value={commentDrafts[post.id] || ""}
                              onChange={(event) =>
                                setCommentDrafts((prev) => ({
                                  ...prev,
                                  [post.id]: event.target.value,
                                }))
                              }
                              disabled={!isLoggedIn || !isActiveUser}
                            />
                            <button
                              className="btn btn-solid"
                              onClick={() => submitComment(post.id)}
                              type="button"
                              disabled={!isLoggedIn || !isActiveUser}
                            >
                              Comment
                            </button>
                          </div>
                        </div>

                        {isAdmin && (
                          <div className="admin-tools">
                            <button
                              className="btn admin-action admin-danger"
                              onClick={() => togglePostStatus(post.id)}
                              type="button"
                            >
                              {post.status === "active" ? "Deactivate Post" : "Activate Post"}
                            </button>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="content-block section-dark">
        <div className="gallery-wrapper admin-hub">
          <div className="admin-heading">
            <div>
              <h2 className="slide-title">
                {isAdmin ? "Admin" : "Community"} <span>Control</span>
              </h2>
              <p>
                {isAdmin
                  ? "Admins can manage users, moderate posts, and reply to message threads from this section."
                  : "Members can review their message thread here and continue the conversation with admin."}
              </p>
            </div>
          </div>

          {activeConversation && (
            <div className="dashboard-card conversation-card">
              <div className="conversation-topline">
                <div>
                  <strong>{activeConversation.subject}</strong>
                  <span>
                    {activeConversation.fromName} | {formatStamp(activeConversation.createdAt)}
                  </span>
                </div>
                <span className="status-pill active">{activeConversation.status}</span>
              </div>
              <p className="conversation-body">{activeConversation.body}</p>
              <div className="reply-list">
                {activeConversation.replies.map((reply) => (
                  <div key={reply.id} className="reply-card dashboard-reply">
                    <div className="comment-header">
                      <strong>{reply.authorName}</strong>
                      <span>{formatStamp(reply.createdAt)}</span>
                    </div>
                    <p>{reply.content}</p>
                  </div>
                ))}
              </div>
              {isLoggedIn && isActiveUser && (
                <div className="inline-reply">
                  <input
                    type="text"
                    placeholder={isAdmin ? "Reply as admin" : "Reply to admin"}
                    value={conversationReplyDrafts[activeConversation.id] || ""}
                    onChange={(event) =>
                      setConversationReplyDrafts((prev) => ({
                        ...prev,
                        [activeConversation.id]: event.target.value,
                      }))
                    }
                  />
                  <button
                    className="btn btn-solid"
                    onClick={() => replyToConversation(activeConversation.id)}
                    type="button"
                  >
                    Send Reply
                  </button>
                </div>
              )}
            </div>
          )}

          {isAdmin && (
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>User Management</h3>
                <table className="resource-table admin-table-lite">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {community.users.map((member) => (
                      <tr key={member.id}>
                        <td>{member.name}</td>
                        <td>{member.role}</td>
                        <td>{member.status}</td>
                        <td>
                          <button
                            className={`btn admin-action ${
                              member.status === "active" ? "admin-danger" : "admin-success"
                            }`}
                            onClick={() => toggleUserStatus(member.id)}
                            type="button"
                          >
                            {member.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="dashboard-card">
                <h3>Posts Queue</h3>
                <div className="mini-list">
                  {community.posts.map((post) => (
                    <div key={post.id} className="mini-list-item">
                      <div>
                        <strong>{post.authorName}</strong>
                        <p>{post.content}</p>
                      </div>
                      <button
                        className={`btn admin-action ${
                          post.status === "active" ? "admin-danger" : "admin-success"
                        }`}
                        onClick={() => togglePostStatus(post.id)}
                        type="button"
                      >
                        {post.status === "active" ? "Hide" : "Show"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

HomePage.statusTimer = null;

export default HomePage;
