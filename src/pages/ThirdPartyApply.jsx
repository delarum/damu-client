import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { thirdPartyApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";

export default function ThirdPartyApply() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    // Organization Details
    org_name: "",
    org_type: "",
    country: "Kenya",
    website: "",
    registration_no: "",
    
    // Access Details
    purpose: "",
    data_requested: "",
    duration_months: "6",
    
    // Legal Compliance
    dpa_signed: false,
    nda_signed: false,
    ethics_approved: false,
    
    // Primary Contact
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    
    // Data Protection Officer
    dpo_name: "",
    dpo_email: "",
    
    // Additional Details from Mayo Clinic template
    requester_address: "",
    requester_city: "",
    requester_state: "",
    requester_zip: "",
    requester_fax: "",
    
    // Data Delivery Preferences
    delivery_method: "written",
    date_needed: "",
    special_instructions: "",
    
    // Specific Data Categories
    data_categories: [],
    timeframe_start: "",
    timeframe_end: "",
  });

  const orgTypes = [
    { value: "academic", label: "Academic / Research Institution" },
    { value: "ngo", label: "Non-Governmental Organization (NGO)" },
    { value: "government", label: "Government Agency" },
    { value: "insurance", label: "Insurance Company" },
    { value: "pharmaceutical", label: "Pharmaceutical Company" },
    { value: "legal", label: "Legal/Law Firm" },
    { value: "other", label: "Other" },
  ];

  const purposeOptions = [
    "Research",
    "Public Health",
    "Policy Development",
    "Insurance Claims",
    "Legal Proceedings",
    "Quality Improvement",
    "Education",
    "Other",
  ];

  const dataCategoryOptions = [
    "Demographic Information",
    "Medical History",
    "Blood Donation Records",
    "Organ Donation Preferences",
    "Laboratory Results",
    "Contact Information",
    "Geographic Data",
    "Aggregate Statistics",
  ];

  const deliveryMethods = [
    { value: "written", label: "Written Copy (mailed)" },
    { value: "portal", label: "Patient Portal" },
    { value: "fax", label: "Fax" },
    { value: "email", label: "Secure Email" },
    { value: "pickup", label: "Pick-up" },
    { value: "cd", label: "CD/DVD" },
    { value: "usb", label: "USB Drive" },
  ];

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleDataCategory(category) {
    setForm((f) => ({
      ...f,
      data_categories: f.data_categories.includes(category)
        ? f.data_categories.filter((c) => c !== category)
        : [...f.data_categories, category],
    }));
  }

  function nextStep() {
    setCurrentStep((s) => s + 1);
  }

  function prevStep() {
    setCurrentStep((s) => s - 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await thirdPartyApi.apply(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Application failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-clay px-6">
        <div className="text-center">
          <p className="font-body text-sm text-ink/60 mb-4">Please log in to apply for data access.</p>
          <Link to="/login" className="font-body text-sm font-semibold text-ruby-warm">Log in</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-clay">
        <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
          <Link to="/dashboard" className="font-display text-lg tracking-tight text-cream">DamuLink</Link>
          <Link to="/dashboard" className="font-body text-sm text-cream/60 hover:text-cream">Back</Link>
        </header>
        <main className="px-6 md:px-12 py-10 max-w-2xl mx-auto">
          <div className="rounded-3xl bg-white p-8 border border-ink/8 text-center">
            <div className="w-16 h-16 rounded-full bg-sage-soft flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#5C7A5E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-display text-2xl text-ink mb-2">Application Submitted</h2>
            <p className="font-body text-sm text-ink/55 mb-6">Your third-party data access application has been received.</p>
            <div className="rounded-2xl bg-mist/5 p-6 text-left mb-6">
              <h3 className="font-body text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">What happens next?</h3>
              <ul className="space-y-2 font-body text-sm text-ink/70">
                <li>• Our legal team will review your application within 5-10 business days</li>
                <li>• You will receive an email confirmation at {form.contact_email}</li>
                <li>• If approved, you will receive a data access agreement</li>
                <li>• Access will be granted for the requested duration</li>
              </ul>
            </div>
            <Link to="/dashboard" className="inline-block px-6 py-3 rounded-full bg-ruby text-cream font-body text-sm font-semibold hover:bg-ruby-deep transition-colors">
              Return to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/dashboard" className="font-display text-lg tracking-tight text-cream">DamuLink</Link>
        <Link to="/dashboard" className="font-body text-sm text-cream/60 hover:text-cream">Back</Link>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-medium text-3xl text-ink mb-2">Third-Party Data Access Application</h1>
          <p className="font-body text-sm text-ink/55">
            Complete all sections to request access to anonymized donor data for research, analysis, or other authorized purposes.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-sm font-semibold ${
                    currentStep >= step
                      ? "bg-ruby text-cream"
                      : "bg-ink/10 text-ink/40"
                  }`}
                >
                  {step}
                </div>
                <span className={`ml-2 font-body text-sm ${currentStep >= step ? "text-ink" : "text-ink/40"}`}>
                  {step === 1 && "Organization"}
                  {step === 2 && "Purpose"}
                  {step === 3 && "Contact"}
                  {step === 4 && "Review"}
                </span>
              </div>
              {step < 4 && <div className={`flex-1 h-0.5 mx-4 ${currentStep > step ? "bg-ruby" : "bg-ink/10"}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="rounded-2xl bg-ruby-50 border border-ruby/15 px-5 py-4 mb-6">
            <p className="font-body text-sm text-ruby-warm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Organization Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 md:p-8 border border-ink/8">
                <h2 className="font-display text-xl font-semibold text-ink mb-1">Organization Information</h2>
                <p className="font-body text-xs text-ink/55 mb-6">Provide details about your organization</p>

                <div className="space-y-5">
                  <label className="block">
                    <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Organization Name *</span>
                    <input
                      type="text"
                      required
                      value={form.org_name}
                      onChange={(e) => update("org_name", e.target.value)}
                      className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                      placeholder="Full legal name of organization"
                    />
                  </label>

                  <label className="block">
                    <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Organization Type *</span>
                    <select
                      required
                      value={form.org_type}
                      onChange={(e) => update("org_type", e.target.value)}
                      className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                    >
                      <option value="">Select type</option>
                      {orgTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Country *</span>
                      <input
                        type="text"
                        required
                        value={form.country}
                        onChange={(e) => update("country", e.target.value)}
                        className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                      />
                    </label>
                    <label className="block">
                      <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Registration Number</span>
                      <input
                        type="text"
                        value={form.registration_no}
                        onChange={(e) => update("registration_no", e.target.value)}
                        className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                        placeholder="Official registration ID"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Website</span>
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
                      className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                      placeholder="https://example.com"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 rounded-full bg-ruby text-cream font-body text-sm font-semibold hover:bg-ruby-deep transition-colors"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Purpose and Data Request */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 md:p-8 border border-ink/8">
                <h2 className="font-display text-xl font-semibold text-ink mb-1">Purpose & Data Request</h2>
                <p className="font-body text-xs text-ink/55 mb-6">Describe why you need access and what data you require</p>

                <div className="space-y-5">
                  <label className="block">
                    <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Primary Purpose *</span>
                    <select
                      required
                      value={form.purpose}
                      onChange={(e) => update("purpose", e.target.value)}
                      className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                    >
                      <option value="">Select primary purpose</option>
                      {purposeOptions.map((purpose) => (
                        <option key={purpose} value={purpose}>{purpose}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Detailed Purpose Description *</span>
                    <textarea
                      required
                      value={form.data_requested}
                      onChange={(e) => update("data_requested", e.target.value)}
                      rows={6}
                      className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                      placeholder="Provide a detailed description of your research or analysis purpose, including methodology and expected outcomes..."
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Access Duration (months) *</span>
                      <input
                        type="number"
                        required
                        min="1"
                        max="24"
                        value={form.duration_months}
                        onChange={(e) => update("duration_months", e.target.value)}
                        className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                      />
                    </label>
                    <label className="block">
                      <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Date Needed By</span>
                      <input
                        type="date"
                        value={form.date_needed}
                        onChange={(e) => update("date_needed", e.target.value)}
                        className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                      />
                    </label>
                  </div>

                  <div className="rounded-2xl bg-mist/5 p-5">
                    <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide block mb-3">Data Categories Requested *</span>
                    <div className="grid grid-cols-2 gap-3">
                      {dataCategoryOptions.map((category) => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.data_categories.includes(category)}
                            onChange={() => toggleDataCategory(category)}
                            className="w-4 h-4 rounded border-ink/20 text-ruby focus:ring-ruby"
                          />
                          <span className="font-body text-sm text-ink">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Timeframe Start</span>
                      <input
                        type="date"
                        value={form.timeframe_start}
                        onChange={(e) => update("timeframe_start", e.target.value)}
                        className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                      />
                    </label>
                    <label className="block">
                      <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Timeframe End</span>
                      <input
                        type="date"
                        value={form.timeframe_end}
                        onChange={(e) => update("timeframe_end", e.target.value)}
                        className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 rounded-full bg-ink/10 text-ink font-body text-sm font-semibold hover:bg-ink/20 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 rounded-full bg-ruby text-cream font-body text-sm font-semibold hover:bg-ruby-deep transition-colors"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 md:p-8 border border-ink/8">
                <h2 className="font-display text-xl font-semibold text-ink mb-1">Contact Information</h2>
                <p className="font-body text-xs text-ink/55 mb-6">Provide details for primary contact and data protection officer</p>

                <div className="space-y-5">
                  <div className="rounded-2xl bg-ruby-soft/10 p-5 border border-ruby/10">
                    <h3 className="font-body text-sm font-semibold text-ink mb-4">Primary Contact Person</h3>
                    <div className="space-y-4">
                      <label className="block">
                        <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Full Name *</span>
                        <input
                          type="text"
                          required
                          value={form.contact_name}
                          onChange={(e) => update("contact_name", e.target.value)}
                          className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                          <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Email *</span>
                          <input
                            type="email"
                            required
                            value={form.contact_email}
                            onChange={(e) => update("contact_email", e.target.value)}
                            className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                          />
                        </label>
                        <label className="block">
                          <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Phone *</span>
                          <input
                            type="tel"
                            required
                            value={form.contact_phone}
                            onChange={(e) => update("contact_phone", e.target.value)}
                            className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-sage-soft/20 p-5 border border-sage/20">
                    <h3 className="font-body text-sm font-semibold text-ink mb-4">Data Protection Officer (DPO)</h3>
                    <div className="space-y-4">
                      <label className="block">
                        <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">DPO Full Name</span>
                        <input
                          type="text"
                          value={form.dpo_name}
                          onChange={(e) => update("dpo_name", e.target.value)}
                          className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                        />
                      </label>
                      <label className="block">
                        <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">DPO Email</span>
                        <input
                          type="email"
                          value={form.dpo_email}
                          onChange={(e) => update("dpo_email", e.target.value)}
                          className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">City</span>
                      <input
                        type="text"
                        value={form.requester_city}
                        onChange={(e) => update("requester_city", e.target.value)}
                        className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                      />
                    </label>
                    <label className="block">
                      <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">State/Province</span>
                      <input
                        type="text"
                        value={form.requester_state}
                        onChange={(e) => update("requester_state", e.target.value)}
                        className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Delivery Method *</span>
                    <select
                      required
                      value={form.delivery_method}
                      onChange={(e) => update("delivery_method", e.target.value)}
                      className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                    >
                      {deliveryMethods.map((method) => (
                        <option key={method.value} value={method.value}>{method.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Special Instructions</span>
                    <textarea
                      value={form.special_instructions}
                      onChange={(e) => update("special_instructions", e.target.value)}
                      rows={3}
                      className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                      placeholder="Any special delivery instructions or notes..."
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 rounded-full bg-ink/10 text-ink font-body text-sm font-semibold hover:bg-ink/20 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 rounded-full bg-ruby text-cream font-body text-sm font-semibold hover:bg-ruby-deep transition-colors"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 md:p-8 border border-ink/8">
                <h2 className="font-display text-xl font-semibold text-ink mb-1">Review & Submit</h2>
                <p className="font-body text-xs text-ink/55 mb-6">Please review all information before submitting</p>

                <div className="space-y-6">
                  <div className="rounded-2xl bg-mist/5 p-5">
                    <h3 className="font-body text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">Organization</h3>
                    <div className="grid grid-cols-2 gap-3 font-body text-sm">
                      <div><span className="text-ink/50">Name:</span> <span className="text-ink font-medium">{form.org_name}</span></div>
                      <div><span className="text-ink/50">Type:</span> <span className="text-ink font-medium">{form.org_type}</span></div>
                      <div><span className="text-ink/50">Country:</span> <span className="text-ink font-medium">{form.country}</span></div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-mist/5 p-5">
                    <h3 className="font-body text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">Purpose & Data</h3>
                    <div className="space-y-2 font-body text-sm">
                      <div><span className="text-ink/50">Purpose:</span> <span className="text-ink font-medium">{form.purpose}</span></div>
                      <div><span className="text-ink/50">Duration:</span> <span className="text-ink font-medium">{form.duration_months} months</span></div>
                      <div>
                        <span className="text-ink/50">Data Categories:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {form.data_categories.map((cat) => (
                            <span key={cat} className="px-3 py-1 rounded-full bg-ruby/10 text-ruby text-xs font-semibold">{cat}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-mist/5 p-5">
                    <h3 className="font-body text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">Contact</h3>
                    <div className="grid grid-cols-2 gap-3 font-body text-sm">
                      <div><span className="text-ink/50">Name:</span> <span className="text-ink font-medium">{form.contact_name}</span></div>
                      <div><span className="text-ink/50">Email:</span> <span className="text-ink font-medium">{form.contact_email}</span></div>
                      <div><span className="text-ink/50">Phone:</span> <span className="text-ink font-medium">{form.contact_phone}</span></div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-clementine-soft/30 p-5 border border-clementine/20">
                    <h3 className="font-body text-xs font-semibold text-ink/60 uppercase tracking-wide mb-2">Legal Agreement</h3>
                    <p className="font-body text-xs text-ink/65 leading-relaxed">
                      By submitting this application, I confirm that:
                    </p>
                    <ul className="mt-2 space-y-1 font-body text-xs text-ink/65">
                      <li>• The information provided is accurate and complete</li>
                      <li>• Data will be used only for the stated purpose</li>
                      <li>• Appropriate security measures will be implemented</li>
                      <li>• Data will be destroyed after the access period ends</li>
                      <li>• All applicable data protection laws will be complied with</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 rounded-full bg-ink/10 text-ink font-body text-sm font-semibold hover:bg-ink/20 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-full bg-ruby text-cream font-body text-sm font-semibold hover:bg-ruby-deep transition-colors disabled:opacity-50 shadow-[0_10px_24px_-10px_rgba(87,3,0,0.5)]"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
