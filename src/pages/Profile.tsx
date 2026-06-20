import { useEffect, useState } from "react";
import { Save, User, Check, AlertCircle } from "lucide-react";
import { useHealth } from "../context/HealthContext";
import { useAuth } from "../context/AuthContext";

const GENDER_OPTIONS = ["Prefer not to say", "Male", "Female", "Non-binary", "Other"];

export default function Profile() {
  const { profile, setProfile } = useHealth();
  const { user } = useAuth();
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => setForm(profile), [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await setProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const field = (
    label: string,
    key: keyof typeof form,
    type: string = "text",
    placeholder?: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Your health profile helps personalize your experience
        </p>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-primary text-2xl font-bold">{user?.name[0]}</span>
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-lg">{user?.name}</h3>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {user?.isGuest && (
            <span className="inline-block mt-1.5 bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Guest Account
            </span>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <User size={16} className="text-primary" />
          <h4 className="font-semibold text-foreground">Health Information</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {field("Full Name", "name", "text", "Alex Johnson")}
          {field("Age", "age", "number", "32")}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full px-4 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors appearance-none"
            >
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          {field("Height (cm)", "height", "number", "175")}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Known Allergies</label>
          <textarea
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            placeholder="e.g. Penicillin, shellfish, latex (leave blank if none)"
            rows={2}
            className="w-full px-4 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Existing Conditions</label>
          <textarea
            value={form.conditions}
            onChange={(e) => setForm({ ...form, conditions: e.target.value })}
            placeholder="e.g. Type 2 diabetes, mild hypertension, asthma (leave blank if none)"
            rows={2}
            className="w-full px-4 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-green-200 transition-all"
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium animate-fade-in flex items-center gap-1.5">
              <Check size={14} />
              Profile updated successfully
            </span>
          )}
        </div>
      </form>

      {/* Privacy note */}
      <div className="bg-secondary rounded-2xl border border-border p-4 flex gap-3">
        <AlertCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your health profile is stored in your private Firebase user document. Configure and deploy the included
          Firestore rules before using this app with real patient information.
        </p>
      </div>
    </div>
  );
}
