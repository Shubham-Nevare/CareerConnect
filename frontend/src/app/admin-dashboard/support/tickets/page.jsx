"use client";
import { useState } from "react";
import Link from "next/link";
import { FiEye, FiMessageSquare, FiSearch, FiX, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
};

export default function SupportTickets() {

const router = useRouter();

  useEffect(() => {
    router.replace("/admin-dashboard/support"); // redirect immediately
  }, [router]);

  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    dateRange: "all",
    search: "",
  });

  const [tickets, setTickets] = useState([
    {
      id: "TCK-001",
      subject: "Login issues",
      requester: "john@example.com",
      status: "open",
      priority: "high",
      createdAt: "2023-05-15T10:30:00Z",
      createdBy: "user",
    },
    {
      id: "TCK-002",
      subject: "Payment problem",
      requester: "sarah@example.com",
      status: "in-progress",
      priority: "medium",
      createdAt: "2023-05-18T14:45:00Z",
      updatedAt: "2023-05-18T16:20:00Z",
      createdBy: "user",
    },
    {
      id: "TCK-003",
      subject: "Profile update request",
      requester: "mike@example.com",
      status: "resolved",
      priority: "low",
      createdAt: "2023-05-20T11:20:00Z",
      updatedAt: "2023-05-21T10:45:00Z",
      createdBy: "admin",
    },
  ]);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    requester: "",
    priority: "medium",
    message: "",
    createdBy: "admin", // Default to admin when creating
  });

  // Update ticket status
  const updateStatus = (ticketId, newStatus) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  // Handle sending a reply
  const handleSendReply = () => {
    if (!replyingTo || !replyText.trim()) return;

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === replyingTo.id
        ? {
            ...ticket,
            status: "in-progress",
            updatedAt: new Date().toISOString(),
          }
        : ticket
    );

    setTickets(updatedTickets);
    setReplyingTo(null);
    setReplyText("");
  };

  // Handle creating a new ticket
  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.requester) return;

    const ticket = {
      id: `TCK-${(tickets.length + 1).toString().padStart(3, "0")}`,
      subject: newTicket.subject,
      requester: newTicket.requester,
      status: "open",
      priority: newTicket.priority,
      createdAt: new Date().toISOString(),
      createdBy: newTicket.createdBy,
    };

    setTickets([ticket, ...tickets]);
    setShowCreateModal(false);
    setNewTicket({
      subject: "",
      requester: "",
      priority: "medium",
      message: "",
      createdBy: "admin",
    });
  };

  // Filter tickets based on current filters
  const filteredTickets = tickets.filter((ticket) => {
    return (
      (filters.status === "all" || ticket.status === filters.status) &&
      (filters.priority === "all" || ticket.priority === filters.priority) &&
      (filters.search === "" ||
        ticket.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.requester.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  // Helper functions for styling
  const getStatusBadge = (status) => {
    const statusClasses = {
      open: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return statusClasses[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      low: "bg-green-100 text-green-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-yellow-100 text-yellow-800",
      critical: "bg-red-100 text-red-800",
    };
    return priorityClasses[priority] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 mt-8">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
        >
          <FiPlus /> Create New Ticket
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tickets..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticket ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requester
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {ticket.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.requester}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={ticket.status}
                    onChange={(e) => updateStatus(ticket.id, e.target.value)}
                    className={`text-xs rounded px-2 py-1 ${getStatusBadge(ticket.status)}`}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadge(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      ticket.createdBy === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {ticket.createdBy}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/admin-dashboard/support/tickets/${ticket.id}`}>
                    <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer">
                      <FiEye className="inline mr-1" /> View
                    </button>
                  </Link>
                  <button
                    onClick={() => setReplyingTo(ticket)}
                    className="text-green-600 hover:text-green-900 cursor-pointer"
                  >
                    <FiMessageSquare className="inline mr-1" /> Reply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-transparent bg-opacity-30 backdrop-blur-xs border-2 border-blue-50"
            onClick={() => {
              setReplyingTo(null);
              setReplyText("");
            }}
          />
          
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Reply to {replyingTo.requester}
              </h3>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">
                Subject: {replyingTo.subject}
              </p>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Type your reply..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-transparent backdrop-blur-xs bg-opacity-30"
            onClick={() => setShowCreateModal(false)}
          />
          
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Create New Ticket</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Ticket subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requester Email
                </label>
                <input
                  type="email"
                  value={newTicket.requester}
                  onChange={(e) => setNewTicket({...newTicket, requester: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="user@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={2}
                  placeholder="Describe the issue..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created By
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={newTicket.createdBy === "admin"}
                      onChange={() => setNewTicket({...newTicket, createdBy: "admin"})}
                      className="text-blue-600"
                    />
                    <span className="ml-2">Admin (on behalf of user)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={newTicket.createdBy === "user"}
                      onChange={() => setNewTicket({...newTicket, createdBy: "user"})}
                      className="text-blue-600"
                    />
                    <span className="ml-2">User</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
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