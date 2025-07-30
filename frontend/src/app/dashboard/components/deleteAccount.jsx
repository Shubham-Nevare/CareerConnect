
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function DeleteAccount({ userId, token, onDeleted, onCancel }) {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const confirmationPhrase = "delete my account";

  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");
    if (confirmText !== confirmationPhrase) {
      setError("Confirmation phrase does not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to delete account.");
      } else {
        toast.success("Account deleted successfully.");
        if (onDeleted) onDeleted();
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 max-w-md" onSubmit={handleDelete}>
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-700 font-semibold mb-2">This action is irreversible!</p>
        <p className="text-sm text-red-600 mb-2">
          To confirm, please type <span className="font-mono bg-red-100 px-1">{confirmationPhrase}</span> below and submit. Your account and all data will be permanently deleted.
        </p>
      </div>
      <input
        type="text"
        className="w-full border rounded px-3 py-2 text-sm"
        placeholder={confirmationPhrase}
        value={confirmText}
        onChange={e => setConfirmText(e.target.value)}
        autoFocus
      />
      {error && <div className="text-red-600 text-xs">{error}</div>}
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm disabled:opacity-50"
          disabled={loading || confirmText !== confirmationPhrase}
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>
        <button type="button" className="text-gray-500 hover:text-gray-700 text-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
