// File: src/components/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { FiSend, FiPlus } from "react-icons/fi";
import { createClient } from "@supabase/supabase-js";
import "../styles/Chat.css";
import { supabase } from "../supabase";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState({
    id: "user123",
    name: "Aurora",
  });
  const messagesEndRef = useRef(null);

  // Generate placeholder for user avatar
  const getInitials = (userId) => {
    return userId.substring(0, 2).toUpperCase();
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Initial fetch of messages
    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel("messages")
      .on("INSERT", { event: "messages", schema: "public" }, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages from Supabase
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (data) setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      user_id: currentUser.id,
      content: newMessage,
      created_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from("messages").insert([newMsg]);

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Delete a message
  const deleteMessage = async (messageId) => {
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;
      setMessages(messages.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Reply to a message
  const replyToMessage = (messageId) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      setNewMessage(`Reply: ${message.content.substring(0, 20)}... `);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <h1>{currentUser.name}</h1>
      </div>

      <div className="message-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-wrapper ${
              message.user_id === currentUser.id ? "own" : ""
            }`}
          >
            {message.user_id !== currentUser.id && (
              <div className="message-avatar">
                {getInitials(message.user_id)}
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
              >
                {message.content}
              </div>

              <div className="message-footer">
                <span className="message-time">
                  {formatTime(message.created_at)}
                </span>
                <button
                  className="reply-button"
                  onClick={() => replyToMessage(message.id)}
                >
                  Reply: {message.content.substring(0, 20)}
                  {message.content.length > 20 ? "..." : ""}
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input" onSubmit={sendMessage}>
        <input
          type="text"
          className="input-field"
          placeholder="Message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="button" className="input-button plus-button">
          <FiPlus />
        </button>
        <button type="submit" className="input-button send-button">
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default Chat;
