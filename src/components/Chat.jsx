import { useState, useEffect, useRef } from "react";
import {
  FiPlus,
  FiArrowLeft,
  FiSend,
  FiCornerUpLeft,
  FiX,
  FiArrowUp,
  FiTrash,
} from "react-icons/fi";
import "../styles/Chat.css";
import { supabase } from "../supabase";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState({
    id: "user123",
    name: "Aurora",
  });
  const [chatPartnerId, setChatPartnerId] = useState("");
  const [chatPartnerInput, setChatPartnerInput] = useState("");
  const [inChatMode, setInChatMode] = useState(false);
  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);

  const [activeReply, setActiveReply] = useState(null);
  const [replyPreview, setReplyPreview] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [debugInfo, setDebugInfo] = useState({
    status: "Idle",
    lastEvent: null,
  });

  // Generate placeholder for user avatar
  const getInitials = (userId) => {
    return userId.substring(0, 2).toUpperCase();
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Setup realtime subscription - simplified approach
  const setupRealtimeSubscription = async () => {
    try {
      // Clean up any existing subscription first
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }

      setDebugInfo({ status: "Setting up channel", lastEvent: null });

      // Single subscription for all message changes
      const channel = supabase
        .channel("public:messages")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            console.log("Received database change:", payload);
            setDebugInfo({
              status: `DB change: ${payload.eventType}`,
              lastEvent: new Date().toISOString(),
            });

            // Refresh messages completely after any database change
            fetchMessages();
          }
        )
        .subscribe((status) => {
          console.log("Subscription status:", status);
          setDebugInfo((prev) => ({
            ...prev,
            status: `Subscription: ${status}`,
          }));
        });

      subscriptionRef.current = channel;
      console.log("Simple subscription set up successfully");
    } catch (err) {
      console.error("Error setting up subscription:", err);
      setDebugInfo((prev) => ({
        ...prev,
        status: `Setup error: ${err.message}`,
      }));
    }
  };

  useEffect(() => {
    if (inChatMode && chatPartnerId) {
      // Initial fetch of messages
      fetchMessages();

      // Set up real-time subscription - simpler approach
      setupRealtimeSubscription();

      // Cleanup function
      return () => {
        if (subscriptionRef.current) {
          console.log("Cleaning up subscription");
          supabase.removeChannel(subscriptionRef.current);
          subscriptionRef.current = null;
        }
      };
    }
  }, [inChatMode, chatPartnerId, currentUser.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages between current user and selected chat partner
  const fetchMessages = async () => {
    try {
      console.log(
        "Fetching messages between",
        currentUser.id,
        "and",
        chatPartnerId
      );
      setDebugInfo((prev) => ({ ...prev, status: "Fetching messages" }));

      // Properly formatted query with parameter binding
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`user_id.eq.${currentUser.id},user_id.eq.${chatPartnerId}`)
        .or(
          `recipient_id.eq.${currentUser.id},recipient_id.eq.${chatPartnerId}`
        )
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      // Filter messages to only include those in this conversation
      const conversationMessages = data.filter(
        (msg) =>
          (msg.user_id === currentUser.id &&
            msg.recipient_id === chatPartnerId) ||
          (msg.user_id === chatPartnerId && msg.recipient_id === currentUser.id)
      );

      console.log("Fetched messages:", conversationMessages.length);
      setDebugInfo((prev) => ({
        ...prev,
        status: `Fetched ${conversationMessages.length} messages`,
      }));

      setMessages(conversationMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setDebugInfo((prev) => ({
        ...prev,
        status: `Fetch error: ${error.message}`,
      }));
      setMessages([]);
    }
  };

  // Enter chat with specific user ID
  const enterChat = (e) => {
    e.preventDefault();
    if (!chatPartnerInput.trim()) return;

    setChatPartnerId(chatPartnerInput);
    setInChatMode(true);
    setMessages([]);
    setDebugInfo({
      status: "Entering chat",
      lastEvent: new Date().toISOString(),
    });
  };

  // Exit chat and return to ID input
  const exitChat = () => {
    // Clean up subscription before exiting
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    setInChatMode(false);
    setChatPartnerId("");
    setMessages([]);
    setDebugInfo({ status: "Exited chat", lastEvent: null });
  };

  const startReply = (message) => {
    setActiveReply(message.id);
    setReplyPreview(message);
  };

  const cancelReply = () => {
    setActiveReply(null);
    setReplyPreview(null);
  };

  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      id: Date.now(),
      user_id: currentUser.id,
      recipient_id: chatPartnerId,
      content: newMessage,
      reply_to: activeReply, // Add reply reference
      created_at: new Date().toISOString(),
    };

    try {
      setDebugInfo((prev) => ({ ...prev, status: "Sending message" }));
      const { data, error } = await supabase
        .from("messages")
        .insert([messageData])
        .select();

      if (error) throw error;

      setNewMessage("");
      setActiveReply(null);
      setReplyPreview(null);

      // For immediate feedback, add the message to state directly
      // The subscription should refresh everything shortly after
      setMessages((prevMessages) => [...prevMessages, messageData]);

      setDebugInfo((prev) => ({
        ...prev,
        status: "Message sent, waiting for refresh",
      }));
    } catch (error) {
      console.error("Send error:", error);
      setDebugInfo((prev) => ({
        ...prev,
        status: `Send error: ${error.message}`,
      }));
    }
  };

  // Delete a message
  const deleteMessage = async (messageId) => {
    try {
      // First, find the message element and add the dissolving class
      const messageElement = document.getElementById(`message-${messageId}`);
      if (messageElement) {
        messageElement.classList.add("dissolving");

        // Wait for animation to complete before removing from database and state
        setTimeout(async () => {
          setDebugInfo((prev) => ({ ...prev, status: "Deleting message" }));
          const { error } = await supabase
            .from("messages")
            .delete()
            .eq("id", messageId);

          if (error) throw error;

          // For immediate feedback, remove message from state
          setMessages(messages.filter((msg) => msg.id !== messageId));

          setDebugInfo((prev) => ({
            ...prev,
            status: "Message deleted, waiting for refresh",
          }));
        }, 800); // Match this timeout to the animation duration
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      setDebugInfo((prev) => ({
        ...prev,
        status: `Delete error: ${error.message}`,
      }));
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Manually refresh messages
  const refreshMessages = () => {
    fetchMessages();
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".message")) {
        setActiveMessageId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  // Render ID selection screen
  if (!inChatMode) {
    return (
      <div className="chat">
        <div className="chat-header">
          <h1>Start a New Chat</h1>
        </div>
        <div className="id-selection-container">
          <form onSubmit={enterChat} className="id-input-form">
            <p>Enter the ID of the user you want to chat with:</p>
            <input
              type="text"
              className="input-field"
              placeholder="User ID..."
              value={chatPartnerInput}
              required={true}
              onChange={(e) => setChatPartnerInput(e.target.value)}
            />
            <p>Enter your ID</p>
            <input
              type="text"
              className="input-field"
              placeholder="User ID..."
              value={currentUser.id}
              required={true}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, id: e.target.value })
              }
            />
            <button type="submit" className="start-button">
              Start Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render chat interface
  return (
    <div className="chat">
      <div className="chat-header">
        <button className="back-button" onClick={exitChat}>
          <FiArrowLeft />
        </button>
        <h1>Chat with {chatPartnerId}</h1>
        <div className="debug-info" style={{ fontSize: "10px", color: "#888" }}>
          Status: {debugInfo.status}{" "}
          {debugInfo.lastEvent
            ? `| Last event: ${new Date(
                debugInfo.lastEvent
              ).toLocaleTimeString()}`
            : ""}
          <button
            onClick={refreshMessages}
            style={{ marginLeft: "10px", padding: "2px 5px", fontSize: "10px" }}
          >
            Refresh
          </button>
        </div>
      </div>
      {replyPreview && (
        <div className="reply-preview">
          <div className="reply-preview-content">
            Replying to: {replyPreview.content}
            <button className="cancel-reply" onClick={cancelReply}>
              <FiX />
            </button>
          </div>
        </div>
      )}
      <div className="message-container">
        {messages.length === 0 ? (
          <div className="empty-chat-message">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              id={`message-${message.id}`} // Unique ID for each message
              className={`message-wrapper ${
                message.user_id === currentUser.id ? "own" : ""
              }`}
              dataText={message.content}
            >
              {message.user_id !== currentUser.id && (
                <div className="message-avatar">
                  {getInitials(message.user_id)}
                </div>
              )}

              {message.reply_to && (
                <div className="reply-indicator">
                  Replying to:{" "}
                  {messages.find((m) => m.id === message.reply_to)?.content ||
                    "Original message deleted"}
                </div>
              )}

              {/* Show menu only for the clicked message */}
              {activeMessageId === message.id && (
                <div className="message-menu">
                  {activeMessageId === message.id &&
                    message.user_id === currentUser.id && (
                      <button
                        className="message-menu-button"
                        onClick={() => deleteMessage(message.id)}
                      >
                        <FiTrash />
                      </button>
                    )}
                  <button
                    className="message-menu-button"
                    onClick={() => startReply(message)}
                  >
                    <FiCornerUpLeft />
                  </button>
                </div>
              )}

              <div className="message-content">
                <div
                  className={`message ${
                    message.user_id === currentUser.id ? "sent" : "received"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click bubbling
                    setActiveMessageId(
                      activeMessageId === message.id ? null : message.id
                    ); // Toggle menu
                  }}
                >
                  {message.content}
                </div>
                <div className="message-footer">
                  <span className="message-time">
                    {formatTime(message.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input" onSubmit={sendMessage}>
        <input
          type="text"
          className="input-field"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="input-button send-button">
          <FiArrowUp className="send-icon" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
