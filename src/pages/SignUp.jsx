import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi, ApiError } from "../lib/api";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const STEPS = ["Account", "Verify", "Done"];

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    national_id: "",
    date_of_birth: "",
  });
  const [otp, setOtp] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSubmitting(true);
    try {
      await authApi.registerDonor(form);
      setStep(1);
    } catch (err) {
      if (err instanceof ApiError && err.details) {
        setFieldErrors(err.details);
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await authApi.verifyOtp({ phone: form.phone, otp });
      setStep(2);
    } catch (err) {
      setError(err.message || "That code didn't work. Check it and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    try {
      await authApi.resendOtp({ phone: form.phone });
    } catch (err) {
      setError(err.message || "Couldn't resend the code. Try again shortly.");
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 md:px-12 py-6">
        <Link to="/" className="font-display text-lg tracking-tight text-ruby">
          DamuLink
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-10">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i <= step ? "bg-ruby" : "bg-ink/10"
                  }`}
                />
              </div>
            ))}
          </div>

          {step === 0 && (
            <form onSubmit={handleRegister}>
              <h1 className="font-display text-2xl text-ink mb-2">CREATE YOUR ACCOUNT</h1>
              <p className="font-body text-sm text-ink/60 mb-8">
                Takes about two minutes. You'll verify your phone next.
              </p>

              {error && (
                <p className="font-body text-sm text-ruby bg-ruby-50 border border-ruby/20 rounded-lg px-4 py-3 mb-5">
                  {error}
                </p>
              )}

              <div className="space-y-4">
                <Field
                  label="Full legal name"
                  value={form.full_name}
                  onChange={(v) => update("full_name", v)}
                  error={fieldErrors.full_name}
                  required
                />
                <Field
                  label="Phone number"
                  type="tel"
                  placeholder="+254712345678"
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                  error={fieldErrors.phone}
                  required
                />
                <Field
                  label="Email (optional)"
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  error={fieldErrors.email}
                />
                <Field
                  label="National ID number"
                  value={form.national_id}
                  onChange={(v) => update("national_id", v)}
                  error={fieldErrors.national_id}
                  required
                />
                <Field
                  label="Date of birth"
                  type="date"
                  value={form.date_of_birth}
                  onChange={(v) => update("date_of_birth", v)}
                  error={fieldErrors.date_of_birth}
                  required
                />
                <Field
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(v) => update("password", v)}
                  error={fieldErrors.password}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-8 font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-white hover:bg-ruby-deep transition-colors disabled:opacity-50"
              >
                {submitting ? "Creating account…" : "Continue"}
              </button>

              <p className="font-body text-sm text-ink/60 text-center mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-ruby font-medium">
                  Log in
                </Link>
              </p>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={handleVerify}>
              <h1 className="font-display text-2xl text-ink mb-2">VERIFY YOUR PHONE</h1>
              <p className="font-body text-sm text-ink/60 mb-8">
                We sent a code to {form.phone || "your phone"}. Enter it below.
              </p>

              {error && (
                <p className="font-body text-sm text-ruby bg-ruby-50 border border-ruby/20 rounded-lg px-4 py-3 mb-5">
                  {error}
                </p>
              )}

              <Field
                label="Verification code"
                value={otp}
                onChange={setOtp}
                required
                inputMode="numeric"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-8 font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-white hover:bg-ruby-deep transition-colors disabled:opacity-50"
              >
                {submitting ? "Verifying…" : "Verify and continue"}
              </button>

              <button
                type="button"
                onClick={handleResend}
                className="w-full mt-3 font-body text-sm text-ink/60 hover:text-ruby py-2"
              >
                Resend code
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-mist flex items-center justify-center mx-auto mb-6">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#570300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="font-display text-2xl text-ink mb-2">YOU'RE VERIFIED</h1>
              <p className="font-body text-sm text-ink/60 mb-8">
                Log in with the password you just set, then we'll get your blood type
                and location so hospitals near you can find a match.
              </p>
              <Link
                to="/login"
                className="block w-full font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-white hover:bg-ruby-deep transition-colors"
              >
                Log in to continue
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, error, required, placeholder, inputMode }) {
  return (
    <label className="block">
      <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 w-full px-4 py-3 rounded-xl border font-body text-sm text-ink bg-white
          focus:outline-none focus:ring-2 focus:ring-ruby/30 focus:border-ruby
          ${error ? "border-ruby" : "border-ink/15"}`}
      />
      {error && (
        <span className="font-body text-xs text-ruby mt-1 block">
          {Array.isArray(error) ? error[0] : error}
        </span>
      )}
    </label>
  );
}