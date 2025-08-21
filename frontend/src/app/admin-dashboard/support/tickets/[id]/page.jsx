"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function TicketDetail() {
  const params = useParams();
  const ticketId = params.id;

  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activePreReply, setActivePreReply] = useState(null);

  // Pre-written replies for common issues
  const preReplies = {
    accountIssues: [
        "Please try resetting your password using the 'Forgot Password' link.",
        "We've reset your password. Please check your email for temporary credentials.",
        "Your account appears to be locked. We've unlocked it - please try logging in again.",
    ],
    jobPostingHelp: [
        "To post a job, please ensure you've completed your company profile first.",
        "Your job posting is under review and should be approved within 24 hours.",
        "We've identified missing requirements in your job posting. Please check the email we sent for details.",
    ],
    candidateSearch: [
        "Try refining your search filters to find more relevant candidates.",
        "We're expanding our candidate pool in your industry - check back in 48 hours for more results.",
        "Your saved search criteria has been updated with the latest candidate matches.",
    ],
    billingQuestions: [
        "Your payment is being processed and should reflect within 24 hours.",
        "We've identified an issue with your payment method. Please update your card details.",
        "This billing question has been escalated to our finance team for resolution.",
    ],
    technicalSupport: [
        "We're aware of this technical issue and our engineers are working on a fix.",
        "Please try clearing your browser cache and cookies, then reload the page.",
        "For faster resolution, please provide screenshots of the error you're seeing.",
    ],
    general: [
        "Thank you for your patience while we investigate this issue.",
        "We're currently experiencing higher than normal ticket volumes but will address your concern shortly.",
        "For faster resolution, please provide more details about your issue.",
    ],
};

  useEffect(() => {
    const fetchTicket = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        const mockTicket = {
          id: ticketId,
          subject: "Login Issue",
          requester: "user@example.com",
          status: "open",
          category: "general", // Added category for pre-replies
          messages: [
            {
              sender: "user@example.com",
              text: "I can't login to my account",
              timestamp: "2023-05-15T10:30:00Z",
            },
          ],
        };
        setTicket(mockTicket);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const handleReply = () => {
    if (!newReply.trim()) return;

    const newMessage = {
      sender: "admin",
      text: newReply,
      timestamp: new Date().toISOString(),
    };

    setReplies([...replies, newMessage]);
    setNewReply("");
    setActivePreReply(null);

    // In a real app, you would call an API to save the reply
    console.log("Reply sent:", newMessage);
  };

  const handlePreReplySelect = (reply) => {
    setNewReply(reply);
    setActivePreReply(reply);
  };

  const getSuggestedReplies = () => {
    if (!ticket) return preReplies.general;
    return preReplies[ticket.category] || preReplies.general;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p>Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p>Ticket not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Ticket Content */}
        <div className="bg-white rounded-lg shadow p-6 flex-1">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold">{ticket.subject}</h2>

            <span
              className={`px-2 py-1 text-sm rounded-full ${getStatusBadge(
                ticket.status
              )}`}
            >
              {ticket.status}
            </span>
            <div className="text-sm text-gray-500">
              {new Date(ticket.messages[0].timestamp).toLocaleString()}
            </div>
          </div>
          <div className="mb-4">
            <span className="text-sm text-gray-600">
              From: {ticket.requester}
            </span>
          </div>
          {/* Ticket Messages */}
          <div className="space-y-4 mb-6">
            {[...ticket.messages, ...replies]
              .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
              .map((msg, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg ${
                    msg.sender === "admin"
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "bg-gray-50 border-l-4 border-gray-300"
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="font-medium">{msg.sender}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <p className="mt-2">{msg.text}</p>
                </div>
              ))}
          </div>

          {/* Reply Box */}
          <div className="border-t pt-4">
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              className="w-full p-3 border rounded-md mb-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Type your reply..."
              rows={4}
            />
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={handleReply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Send Reply
                </button>
                <button
                  onClick={() => setNewReply("")}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {newReply.length}/500 characters
              </span>
            </div>
          </div>
        </div>

        {/* Suggested Replies Sidebar */}
        <div className="bg-white rounded-lg shadow p-6 w-full lg:w-80">
          <h3 className="font-medium text-lg mb-4">Suggested Replies</h3>
          <div className="space-y-3">
            {getSuggestedReplies().map((reply, index) => (
              <button
                key={index}
                onClick={() => handlePreReplySelect(reply)}
                className={`w-full text-left p-3 rounded-md text-sm ${
                  activePreReply === reply
                    ? "bg-blue-100 border border-blue-300"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="font-medium text-lg mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200 cursor-pointer">
                Mark as Resolved
              </button>
              <button className="w-full px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200 cursor-pointer">
                Escalate to Manager
              </button>
              <button className="w-full px-3 py-2 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 cursor-pointer">
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusBadge(status) {
  const statusClasses = {
    open: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
}
