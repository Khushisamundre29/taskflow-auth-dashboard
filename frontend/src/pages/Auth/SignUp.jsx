import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerAPI } from "../../services/auth";

// ✅ Field is OUTSIDE SignUp — prevents re-creation on every keystroke
const Field = ({ label, name, type = "text", placeholder, value, onChange, error }) => (
  <div>
    <label className="block text-white/60 text-sm font-medium mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none transition-all focus:ring-2 focus:ring-[#1368EC]/50 focus:border-[#1368EC]/50 ${
        error ? "border-red-500/50" : "border-white/10"
      }`}
    />
    {error && <p className="mt-1.5 text-red-400 text-xs">{error}</p>}
  </div>
);

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Must be at least 6 characters";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      await registerAPI({ name: form.name, email: form.email, password: form.password });
      navigate("/login", { state: { message: "Account created! Please sign in." } });
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#1368EC]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#1368EC] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#1368EC]/30">
              T
            </div>
            <span className="text-white font-semibold text-2xl tracking-tight">
              Task<span className="text-[#1368EC]">Flow</span>
            </span>
          </div>
          <h1 className="text-white text-2xl font-semibold">Create your account</h1>
          <p className="text-white/40 mt-1 text-sm">Start managing your tasks today</p>
        </div>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {serverError && (
            <div className="mb-5 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field
              label="Full name"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange("name")}
              error={errors.name}
            />
            <Field
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange("email")}
              error={errors.email}
            />
            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange("password")}
              error={errors.password}
            />
            <Field
              label="Confirm password"
              name="confirm"
              type="password"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={handleChange("confirm")}
              error={errors.confirm}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1368EC] hover:bg-[#0f57c8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-[#1368EC]/20 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#1368EC] hover:text-[#4a90e2] transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;