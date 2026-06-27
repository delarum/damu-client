import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi, ApiError } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";
import AuthSidePanel from "../components/AuthSidePanel";

export default function SignUp() {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
        setError(err.message || t("auth.signup.error"));
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
      setError(err.message || t("auth.signup.verifyError"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    try {
      await authApi.resendOtp({ phone: form.phone });
    } catch (err) {
      setError(err.message || t("auth.signup.resendError"));
    }
  }

  const stepCopy = [
    {
      eyebrow: t("auth.signup.step0.eyebrow"),
      heading: t("auth.signup.step0.heading"),
      body: t("auth.signup.step0.body"),
    },
    {
      eyebrow: t("auth.signup.step1.eyebrow"),
      heading: t("auth.signup.step1.heading"),
      body: t("auth.signup.step1.body"),
    },
    {
      eyebrow: t("auth.signup.step2.eyebrow"),
      heading: t("auth.signup.step2.heading"),
      body: t("auth.signup.step2.body"),
    },
  ][step];

  return (
    <div className="min-h-screen flex bg-clay">
      <AuthSidePanel
        eyebrow={stepCopy.eyebrow}
        heading={stepCopy.heading}
        body={stepCopy.body}
      />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="font-display text-xl tracking-tight text-ruby">
              {t("common.brand")}
            </Link>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-9">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
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
              <h1 className="font-display font-medium text-3xl text-ink mb-2">
                {t("auth.signup.title")}
              </h1>
              <p className="font-body text-sm text-ink/55 mb-8">
                {t("auth.signup.body")}
              </p>

              {error && (
                <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-5">
                  {error}
                </p>
              )}

              <div className="space-y-4">
                <Field
                  label={t("field.fullName")}
                  value={form.full_name}
                  onChange={(v) => update("full_name", v)}
                  error={fieldErrors.full_name}
                  required
                />
                <Field
                  label={t("field.phone")}
                  type="tel"
                  placeholder="+254712345678"
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                  error={fieldErrors.phone}
                  required
                />
                <Field
                  label={t("field.emailOptional")}
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  error={fieldErrors.email}
                />
                <Field
                  label={t("field.nationalId")}
                  value={form.national_id}
                  onChange={(v) => update("national_id", v)}
                  error={fieldErrors.national_id}
                  required
                />
                <Field
                  label={t("field.birthDate")}
                  type="date"
                  value={form.date_of_birth}
                  onChange={(v) => update("date_of_birth", v)}
                  error={fieldErrors.date_of_birth}
                  required
                />
                <Field
                  label={t("field.password")}
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
                className="w-full mt-8 font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors disabled:opacity-50 shadow-[0_10px_24px_-10px_rgba(87,3,0,0.5)]"
              >
                {submitting ? t("common.creatingAccount") : t("common.continue")}
              </button>

              <p className="font-body text-sm text-ink/55 text-center mt-6">
                {t("auth.signup.already")}{" "}
                <Link to="/login" className="text-ruby-warm font-semibold">
                  {t("common.logIn")}
                </Link>
              </p>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={handleVerify}>
              <h1 className="font-display font-medium text-3xl text-ink mb-2">
                {t("auth.signup.verifyTitle")}
              </h1>
              <p className="font-body text-sm text-ink/55 mb-8">
                {t("auth.signup.verifyBody", { phone: form.phone || t("auth.signup.verifyFallback") })}
              </p>

              {error && (
                <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-5">
                  {error}
                </p>
              )}

              <Field
                label={t("field.verificationCode")}
                value={otp}
                onChange={setOtp}
                required
                inputMode="numeric"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-8 font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors disabled:opacity-50 shadow-[0_10px_24px_-10px_rgba(87,3,0,0.5)]"
              >
                {submitting ? t("common.verifying") : t("auth.signup.verifyAction")}
              </button>

              <button
                type="button"
                onClick={handleResend}
                className="w-full mt-3 font-body text-sm text-ink/55 hover:text-ruby-warm py-2"
              >
                {t("auth.signup.resend")}
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
              <h1 className="font-display font-medium text-3xl text-ink mb-2">
                {t("auth.signup.doneTitle")}
              </h1>
              <p className="font-body text-sm text-ink/55 mb-8">
                {t("auth.signup.doneBody")}
              </p>
              <Link
                to="/login"
                className="block w-full font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors"
              >
                {t("auth.signup.doneAction")}
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
        className={`mt-1.5 w-full px-4 py-3.5 rounded-2xl border font-body text-sm text-ink bg-white placeholder:text-ink/35
          focus:outline-none focus:ring-2 focus:ring-ruby-warm/35 transition-shadow
          ${error ? "border-ruby" : "border-transparent"}`}
      />
      {error && (
        <span className="font-body text-xs text-ruby-warm mt-1 block">
          {Array.isArray(error) ? error[0] : error}
        </span>
      )}
    </label>
  );
}