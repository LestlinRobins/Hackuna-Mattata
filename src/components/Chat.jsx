import { useState, useEffect, useRef } from "react";
import {
  FiPlus,
  FiArrowLeft,
  FiSend,
  FiCornerUpLeft,
  FiX,
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

  // Setup realtime subscription
  const setupRealtimeSubscription = async () => {
    try {
      // Clean up any existing subscription first
      if (subscriptionRef.current) {
        await supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }

      setDebugInfo({ status: "Setting up channel", lastEvent: null });

      // Create a unique channel name for this conversation
      const channelName = `messages_${Date.now()}`;

      // Create a new subscription with specific filters
      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `user_id=eq.${currentUser.id},recipient_id=eq.${chatPartnerId}`,
          },
          (payload) => {
            console.log("Received message from current user:", payload);
            setDebugInfo((prev) => ({
              status: "Received message from current user",
              lastEvent: new Date().toISOString(),
            }));
            setMessages((prev) => [...prev, payload.new]);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `user_id=eq.${chatPartnerId},recipient_id=eq.${currentUser.id}`,
          },
          (payload) => {
            console.log("Received message from chat partner:", payload);
            setDebugInfo((prev) => ({
              status: "Received message from chat partner",
              lastEvent: new Date().toISOString(),
            }));
            setMessages((prev) => [...prev, payload.new]);
          }
        );

      // Subscribe to the channel
      const { error } = await channel.subscribe((status) => {
        console.log("Subscription status:", status);
        setDebugInfo((prev) => ({
          ...prev,
          status: `Subscription: ${status}`,
        }));
      });

      if (error) {
        console.error("Subscription error:", error);
        setDebugInfo((prev) => ({
          ...prev,
          status: `Subscription error: ${error.message}`,
        }));
        return;
      }

      subscriptionRef.current = channel;

      console.log(
        "Subscription set up successfully for chat between",
        currentUser.id,
        "and",
        chatPartnerId
      );
      setDebugInfo((prev) => ({ ...prev, status: "Subscription active" }));
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

      // Set up real-time subscription
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
      const { data, error } = await supabase
        .from("messages")
        .insert([messageData])
        .select();

      if (error) throw error;

      setNewMessage("");
      setActiveReply(null);
      setReplyPreview(null);
    } catch (error) {
      console.error("Reply error:", error);
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
          const { error } = await supabase
            .from("messages")
            .delete()
            .eq("id", messageId);
          if (error) throw error;
          setMessages(messages.filter((msg) => msg.id !== messageId));
        }, 800); // Match this timeout to the animation duration
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  useEffect(() => {
    if (inChatMode && chatPartnerId) {
      fetchMessages(); // Initial fetch

      const interval = setInterval(() => {
        refreshMessages();
      }, 1000); // Adjust the interval time as needed

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [inChatMode, chatPartnerId]);

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Manually refresh messages
  const refreshMessages = () => {
    fetchMessages();
  };

  // Render ID selection screen
  if (!inChatMode) {
    return (
      <div className="chat">
        <div className="chat-header">
          <h1>Start a New Chat</h1>
        </div>
        <div className="id-selection-container">
          <p>Enter the ID of the user you want to chat with:</p>
          <form onSubmit={enterChat} className="id-input-form">
            <input
              type="text"
              className="input-field"
              placeholder="User ID..."
              value={chatPartnerInput}
              onChange={(e) => setChatPartnerInput(e.target.value)}
            />
            <p>Enter your ID</p>
            <input
              type="text"
              className="input-field"
              placeholder="User ID..."
              value={currentUser.id}
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
              id={`message-${message.id}`} // Add this ID
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
              <div className="message-content">
                <div
                  className={`message ${
                    message.user_id === currentUser.id ? "sent" : "received"
                  }`}
                  onDoubleClick={() =>
                    message.user_id === currentUser.id &&
                    deleteMessage(message.id)
                  }
                  onClick={() => startReply(message)}
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
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default Chat;
