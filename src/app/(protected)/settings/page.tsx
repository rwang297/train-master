"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("UTC");

  const [language, setLanguage] = useState("en");
  const [density, setDensity] = useState("comfortable");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? "bg-sky-600" : "bg-gray-200"}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${checked ? "translate-x-5" : "translate-x-1"}`} />
      </button>
    );
  }

  const handleSave = () => {
    // This would save via API; keeping UI-only per current scope
    console.log("Settings saved");
  };
  const handleReset = () => {
    setFullName("");
    setEmail("");
    setTimezone("UTC");
    setLanguage("en");
    setDensity("comfortable");
    setEmailNotifications(true);
    setSmsNotifications(false);
    setTwoFactor(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="settings-page p-8 bg-gray-50 min-h-screen">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black">Settings</h1>
          <p className="text-sm text-gray-700 mt-1">Manage your account, preferences, and security</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleSave} className="inline-flex items-center gap-2 h-10 px-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-600 transition">Save Changes</button>
          <button onClick={handleReset} className="h-10 px-3 rounded border border-gray-200 text-gray-800 hover:bg-gray-50 transition">Reset</button>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="section-card rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
          <h2 className="text-base font-medium text-black">Account</h2>
          <p className="text-sm text-gray-700 mt-1">Profile and account information</p>
          <div className="mt-4 space-y-4">
            <div className="form-row">
              <label className="form-label block text-sm text-gray-700 mb-1">Full Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-10 px-3 rounded border border-gray-200 w-full text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div className="form-row">
              <label className="form-label block text-sm text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 px-3 rounded border border-gray-200 w-full text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div className="form-row grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label block text-sm text-gray-700 mb-1">Timezone</label>
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="h-10 px-3 rounded border border-gray-200 w-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="UTC">UTC</option>
                  <option value="Africa/Lagos">Africa/Lagos</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
              <div>
                <label className="form-label block text-sm text-gray-700 mb-1">Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="h-10 px-3 rounded border border-gray-200 w-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="section-card rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
          <h2 className="text-base font-medium text-black">Preferences</h2>
          <p className="text-sm text-gray-700 mt-1">Customize your experience</p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-800">Compact Mode</div>
                <div className="text-xs text-gray-700">Reduce spacing for dense data tables</div>
              </div>
              <Toggle checked={density === "compact"} onChange={() => setDensity(density === "compact" ? "comfortable" : "compact")} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-800">Email Notifications</div>
                <div className="text-xs text-gray-700">Receive updates and alerts via email</div>
              </div>
              <Toggle checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-800">SMS Notifications</div>
                <div className="text-xs text-gray-700">Receive critical alerts via SMS</div>
              </div>
              <Toggle checked={smsNotifications} onChange={() => setSmsNotifications(!smsNotifications)} />
            </div>
          </div>
        </div>

        <div className="section-card rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
          <h2 className="text-base font-medium text-black">Security</h2>
          <p className="text-sm text-gray-700 mt-1">Protect your account</p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-800">Two-Factor Authentication</div>
                <div className="text-xs text-gray-700">Add an extra layer of security at sign-in</div>
              </div>
              <Toggle checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="h-10 px-3 rounded border border-gray-200 w-full text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-10 px-3 rounded border border-gray-200 w-full text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-10 px-3 rounded border border-gray-200 w-full text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="section-card rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
          <h2 className="text-base font-medium text-black">Data & Privacy</h2>
          <p className="text-sm text-gray-700 mt-1">Control your data</p>
          <div className="mt-4 space-y-3">
            <div className="text-sm text-gray-800">Download a copy of your data</div>
            <div className="flex items-center gap-2">
              <button className="h-10 px-3 rounded bg-blue-600 text-white hover:bg-blue-600 transition">Export</button>
              <button
               onClick={() => {
                    localStorage.removeItem("token");
                    sessionStorage.clear();
                    window.location.href = "/"; // redirect to login page
                  }}
                className="h-10 px-3 rounded border border-gray-200 text-gray-800 hover:bg-gray-50 transition"
              >
                Logout
              </button>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
