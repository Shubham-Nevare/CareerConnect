
import { useState } from "react";
import { toast } from "react-hot-toast";


export default function ChangePassword({ userId, token, onSuccess, onCancel }) {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");
    if (!currentPass || !newPass || !confirmPass) {
      setPassError("All fields are required.");
      return;
    }
    if (newPass.length < 6) {
      setPassError("New password must be at least 6 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setPassError("New passwords do not match.");
      return;
    }
    // console.log(currentPass, newPass, confirmPass);
    
    setPassLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          currentPassword: currentPass,
          newPassword: newPass
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setPassError(data.message || "Failed to change password.");
      } else {
        toast.success("Password changed successfully.");
        setPassSuccess("");
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setPassError("Server error. Please try again later.");
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <form className="space-y-3 max-w-md" onSubmit={handleChangePassword}>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Current Password</label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            className="w-full border rounded px-3 py-2 text-sm pr-10"
            value={currentPass}
            onChange={e => setCurrentPass(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 focus:outline-none"
            tabIndex={-1}
            onClick={() => setShowCurrent((v) => !v)}
            aria-label={showCurrent ? "Hide password" : "Show password"}
          >
            {showCurrent ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            className="w-full border rounded px-3 py-2 text-sm pr-10"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 focus:outline-none"
            tabIndex={-1}
            onClick={() => setShowNew((v) => !v)}
            aria-label={showNew ? "Hide password" : "Show password"}
          >
            {showNew ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Confirm New Password</label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            className="w-full border rounded px-3 py-2 text-sm pr-10"
            value={confirmPass}
            onChange={e => setConfirmPass(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 focus:outline-none"
            tabIndex={-1}
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {passError && <div className="text-red-600 text-xs">{passError}</div>}
      {/* Success toast is shown, no inline message needed */}
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm" disabled={passLoading}>
          {passLoading ? "Saving..." : "Save"}
        </button>
        <button type="button" className="text-gray-500 hover:text-gray-700 text-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
