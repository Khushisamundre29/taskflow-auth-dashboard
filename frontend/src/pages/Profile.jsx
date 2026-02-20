import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfileAPI } from "../services/auth";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (form.password && form.password.length < 6) e.password = "Min. 6 characters";
    if (form.password && form.confirm !== form.password) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setServerError("");
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      const res = await updateProfileAPI(payload);
      updateUser(res.data);
      setSuccess(true);
      setForm((f) => ({ ...f, password: "", confirm: "" }));
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-semibold">Profile</h1>
        <p className="text-white/40 text-sm mt-1">Manage your account information</p>
      </div>

      {/* Avatar card */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1368EC] to-[#0a4bbd] flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-[#1368EC]/20 flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-semibold text-lg">{user?.name}</p>
          <p className="text-white/40 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            <span className="text-emerald-400 text-xs">Active account</span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-5">Edit Information</h2>

        {success && (
          <div className="mb-5 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-4 py-3 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Profile updated successfully!
          </div>
        )}

        {serverError && (
          <div className="mb-5 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-[#1368EC]/50 transition-all ${errors.name ? "border-red-500/50" : "border-white/10"}`}
              />
              {errors.name && <p className="mt-1 text-red-400 text-xs">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-[#1368EC]/50 transition-all ${errors.email ? "border-red-500/50" : "border-white/10"}`}
              />
              {errors.email && <p className="mt-1 text-red-400 text-xs">{errors.email}</p>}
            </div>
          </div>

          <div className="border-t border-white/5 pt-5">
            <p className="text-white/40 text-xs mb-4">Leave password fields empty to keep your current password</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-white/60 text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:ring-2 focus:ring-[#1368EC]/50 transition-all ${errors.password ? "border-red-500/50" : "border-white/10"}`}
                />
                {errors.password && <p className="mt-1 text-red-400 text-xs">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-white/60 text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:ring-2 focus:ring-[#1368EC]/50 transition-all ${errors.confirm ? "border-red-500/50" : "border-white/10"}`}
                />
                {errors.confirm && <p className="mt-1 text-red-400 text-xs">{errors.confirm}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#1368EC] hover:bg-[#0f57c8] disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-[#1368EC]/20"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;