import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaTimes, FaPaperPlane, FaUser } from "react-icons/fa";
import axios from "axios";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: inputMessage,
        context: messages.slice(-5),
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply || "I'm here to help!",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      // Fallback response
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${isOpen ? "scale-0" : "scale-100"}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaRobot size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-dark-100 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaRobot className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Assistant</h3>
                  <p className="text-white/80 text-xs">
                    Online • Ready to help
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === "user"
                          ? "bg-accent-500"
                          : "bg-primary-500"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <FaUser size={14} />
                      ) : (
                        <FaRobot size={14} />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-accent-500/20 border border-accent-500/30"
                          : "bg-primary-500/20 border border-primary-500/30"
                      }`}
                    >
                      <p className="text-white text-sm">{message.text}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-2 bg-primary-500/20 rounded-lg p-3">
                    <div
                      className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    />
                    <div
                      className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-700/50"
            >
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-dark-200 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
