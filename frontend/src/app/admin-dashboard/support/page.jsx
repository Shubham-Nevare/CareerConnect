"use client";
import { useAuth } from "@/app/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiMessageSquare,
  FiUser,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiPaperclip,
  FiSend,
  FiChevronDown,
  FiX,
} from "react-icons/fi";

// Mock data
const mockTickets = [
  {
    id: "TCK-2023-001",
    subject: "Can't reset password",
    requester: "john@example.com",
    status: "open",
    priority: "high",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: null,
    assignedTo: null,
    messages: [
      {
        id: 1,
        sender: "john@example.com",
        text: "I keep getting an error when trying to reset my password.",
        timestamp: "2023-05-15T10:30:00Z",
        attachments: [],
      },
    ],
  },
  {
    id: "TCK-2023-002",
    subject: "Payment not processed",
    requester: "sarah@example.com",
    status: "in-progress",
    priority: "medium",
    createdAt: "2023-05-18T14:45:00Z",
    updatedAt: "2023-05-18T16:20:00Z",
    assignedTo: "support_agent_1",
    messages: [
      {
        id: 1,
        sender: "sarah@example.com",
        text: "My payment shows as pending but the amount was deducted.",
        timestamp: "2023-05-18T14:45:00Z",
        attachments: [],
      },
      {
        id: 2,
        sender: "support_agent_1",
        text: "We're checking with our payment provider. Will update you shortly.",
        timestamp: "2023-05-18T16:20:00Z",
        attachments: [],
      },
    ],
  },
];

const supportTeam = [
  { id: "support_agent_1", name: "Alex Johnson" },
  { id: "support_agent_2", name: "Maria Garcia" },
];

const quickReplies = {
  login: [
    "Please try resetting your password using the 'Forgot Password' link.",
    "We've reset your password. Please check your email for temporary credentials.",
  ],
  payment: [
    "Your payment is being processed and should reflect within 24 hours.",
    "We've identified an issue with your payment method. Please update your card details.",
  ],
};

export default function SupportPage() {
  const { user, token } = useAuth();

  const [tickets, setTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
  });
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    requester: "",
    priority: "medium",
    message: "",
  });

  const router = useRouter();

  useEffect(() => {
    // If no valid user or token, redirect to login
    if (!user || !token || user.role !== "admin") {
      router.replace("/login");
    }
  }, [user, token, router]);

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    return (
      (filters.status === "all" || ticket.status === filters.status) &&
      (filters.priority === "all" || ticket.priority === filters.priority) &&
      (filters.search === "" ||
        ticket.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.requester.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  // Handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const updatedTickets = tickets.map((ticket) => {
      if (ticket.id === selectedTicket.id) {
        const newMsg = {
          id: ticket.messages.length + 1,
          sender: "support_agent_1",
          text: newMessage,
          timestamp: new Date().toISOString(),
          attachments: [],
        };

        return {
          ...ticket,
          status: "in-progress",
          updatedAt: new Date().toISOString(),
          messages: [...ticket.messages, newMsg],
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    setSelectedTicket(updatedTickets.find((t) => t.id === selectedTicket.id));
    setNewMessage("");
  };

  // Handle creating a new ticket
  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.requester || !newTicket.message)
      return;

    const ticket = {
      id: `TCK-${new Date().getFullYear()}-${(tickets.length + 1)
        .toString()
        .padStart(3, "0")}`,
      subject: newTicket.subject,
      requester: newTicket.requester,
      status: "open",
      priority: newTicket.priority,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      assignedTo: null,
      messages: [
        {
          id: 1,
          sender: newTicket.requester,
          text: newTicket.message,
          timestamp: new Date().toISOString(),
          attachments: [],
        },
      ],
    };

    setTickets([ticket, ...tickets]);
    setIsCreatingTicket(false);
    setNewTicket({
      subject: "",
      requester: "",
      priority: "medium",
      message: "",
    });
  };

  // Update ticket status
  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : ticket
      )
    );

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Assign ticket to agent
  const assignTicket = (ticketId, agentId) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, assignedTo: agentId } : ticket
      )
    );

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        assignedTo: agentId,
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 mt-8">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Support Dashboard</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          onClick={() => setIsCreatingTicket(true)}
        >
          <FiPlus className="text-lg" /> New Ticket
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Ticket List Sidebar */}
        <aside className="w-100 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 space-y-4 border-b border-gray-200">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="close">Close</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={filters.priority}
                  onChange={(e) =>
                    setFilters({ ...filters, priority: e.target.value })
                  }
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ticket List */}
          <div className="flex-1 overflow-y-auto">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedTicket?.id === ticket.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-500">
                      #{ticket.id}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        ticket.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : ticket.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mt-1">
                    {ticket.subject}
                  </h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiUser className="text-xs" />
                      <span>{ticket.requester}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          ticket.status === "open"
                            ? "bg-yellow-500"
                            : ticket.status === "in-progress"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      ></span>
                      <span>{ticket.status.replace("-", " ")}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                <FiMessageSquare className="text-3xl mb-2" />
                <p>No tickets match your filters</p>
              </div>
            )}
          </div>
        </aside>

        {/* Ticket Detail View */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Ticket Header */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedTicket.subject}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiUser className="text-sm" />
                        <span>{selectedTicket.requester}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock className="text-sm" />
                        <span>
                          {new Date(selectedTicket.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <select
                      className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedTicket.status}
                      onChange={(e) =>
                        updateTicketStatus(selectedTicket.id, e.target.value)
                      }
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="close">Close</option>
                    </select>

                    <select
                      className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
                      value={selectedTicket.assignedTo || ""}
                      onChange={(e) =>
                        assignTicket(selectedTicket.id, e.target.value)
                      }
                    >
                      <option value="">Unassigned</option>
                      {supportTeam.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Conversation */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {selectedTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === selectedTicket.requester
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-3/4 rounded-lg p-3 ${
                        message.sender === selectedTicket.requester
                          ? "bg-white border border-gray-200"
                          : "bg-blue-100 border border-blue-200"
                      }`}
                    >
                      <div className="flex justify-between items-baseline gap-2 mb-1">
                        <span
                          className={`text-sm font-medium ${
                            message.sender === selectedTicket.requester
                              ? "text-gray-700"
                              : "text-blue-700"
                          }`}
                        >
                          {message.sender === selectedTicket.requester
                            ? selectedTicket.requester
                            : supportTeam.find((a) => a.id === message.sender)
                                ?.name || "Support Agent"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-gray-800">{message.text}</p>
                      {message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((att, i) => (
                            <a
                              key={i}
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <FiPaperclip /> {att.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="relative mb-2">
                  <button
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => setShowQuickReplies(!showQuickReplies)}
                  >
                    Quick Replies{" "}
                    <FiChevronDown
                      className={`transition-transform ${
                        showQuickReplies ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showQuickReplies && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div className="p-2">
                        <h4 className="font-medium text-gray-700 px-2 py-1">
                          Login Issues
                        </h4>
                        {quickReplies.login.map((reply, i) => (
                          <button
                            key={`login-${i}`}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => {
                              setNewMessage(reply);
                              setShowQuickReplies(false);
                            }}
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                      <div className="p-2 border-t border-gray-200">
                        <h4 className="font-medium text-gray-700 px-2 py-1">
                          Payment Issues
                        </h4>
                        {quickReplies.payment.map((reply, i) => (
                          <button
                            key={`payment-${i}`}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => {
                              setNewMessage(reply);
                              setShowQuickReplies(false);
                            }}
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <textarea
                    placeholder="Type your reply..."
                    className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
                      <FiPaperclip />
                    </button>
                    <button
                      className={`p-2 rounded ${
                        newMessage.trim()
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <FiSend />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <FiMessageSquare className="text-4xl mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-400 mb-1">
                No ticket selected
              </h3>
              <p className="text-gray-400">
                Select a ticket from the list to view details
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Create Ticket Modal */}
      {isCreatingTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h2 className="text-lg font-bold text-gray-900">
                Create New Ticket
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsCreatingTicket(false)}
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the issue"
                  value={newTicket.subject}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, subject: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requester Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="customer@example.com"
                  value={newTicket.requester}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, requester: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newTicket.priority}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, priority: e.target.value })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed description of the issue"
                  rows={5}
                  value={newTicket.message}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, message: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-200 p-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setIsCreatingTicket(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-md text-white ${
                  newTicket.subject && newTicket.requester && newTicket.message
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-400 cursor-not-allowed"
                }`}
                onClick={handleCreateTicket}
                disabled={
                  !newTicket.subject ||
                  !newTicket.requester ||
                  !newTicket.message
                }
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
