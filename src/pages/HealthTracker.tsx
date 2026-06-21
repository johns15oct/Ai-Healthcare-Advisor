import { useState } from "react";
import { Pencil, Trash2, Save, X, Plus, AlertCircle, Leaf } from "lucide-react";
import { useHealth } from "../context/HealthContext";
import { VitalReading } from "../data/mockData";

function bmi(w: number, h: number) {
  return w / Math.pow(h / 100, 2);
}

interface Suggestion {
  icon: React.ReactNode;
  title: string;
  trigger: string;
  tips: string[];
  color: string;
}

function buildSuggestions(latest: VitalReading): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const b = bmi(latest.weight, latest.height);

  if (latest.bpSystolic >= 140 || latest.bpDiastolic >= 90) {
    suggestions.push({
      icon: <Leaf size={16} />,
      title: "Dietary Tips for High Blood Pressure",
      trigger: `BP ${latest.bpSystolic}/${latest.bpDiastolic} mmHg — Stage 1 hypertension range`,
      color: "red",
      tips: [
        "Follow the DASH diet: rich in fruits, vegetables, whole grains, and low-fat dairy.",
        "Limit sodium intake to under 2,300 mg/day; ideally 1,500 mg for further reduction.",
        "Eat potassium-rich foods: bananas, sweet potatoes, spinach, avocado, and beans.",
        "Reduce processed foods, deli meats, canned soups, and fast food.",
        "Limit alcohol to no more than 1 drink/day (women) or 2 drinks/day (men).",
        "Increase magnesium through nuts, seeds, whole grains, and leafy greens.",
      ],
    });
  }

  if (latest.sugar >= 100) {
    suggestions.push({
      icon: <Leaf size={16} />,
      title: `${latest.sugar >= 126 ? "Elevated" : "Borderline"} Blood Sugar — Food Guidance`,
      trigger: `Fasting glucose ${latest.sugar} mg/dL — ${latest.sugar >= 126 ? "diabetic" : "prediabetic"} range`,
      color: latest.sugar >= 126 ? "red" : "amber",
      tips: [
        "Choose low-glycemic foods: non-starchy vegetables, legumes, lentils, and berries.",
        "Replace refined carbohydrates (white rice, bread) with whole grains like oats, quinoa, barley.",
        "Include fiber with every meal — it slows glucose absorption significantly.",
        "Limit sugary beverages, juices, and desserts; opt for water or unsweetened herbal tea.",
        "Eat smaller, more frequent meals to prevent blood sugar spikes.",
        "Include protein and healthy fats at meals to blunt post-meal glucose rises.",
      ],
    });
  }

  if (b >= 25) {
    suggestions.push({
      icon: <Leaf size={16} />,
      title: "Weight Management — Lifestyle Suggestions",
      trigger: `BMI ${b.toFixed(1)} kg/m² — ${b >= 30 ? "obese" : "overweight"} range`,
      color: b >= 30 ? "red" : "amber",
      tips: [
        "Aim for a moderate caloric deficit (300–500 kcal/day) rather than extreme restriction.",
        "Prioritize protein and fiber at each meal to increase satiety and reduce overeating.",
        "Increase non-exercise activity: walk more, take stairs, stand at your desk.",
        "Aim for at least 150 minutes of moderate aerobic activity per week.",
        "Reduce ultra-processed snacks; replace with whole-food alternatives like nuts or fruit.",
        "Track meals mindfully — awareness alone often leads to better food choices.",
      ],
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      icon: <Leaf size={16} />,
      title: "All Vitals in Normal Range — Maintenance Tips",
      trigger: "Great work! Your latest readings look healthy.",
      color: "green",
      tips: [
        "Keep up balanced nutrition: vegetables, lean protein, whole grains, and healthy fats daily.",
        "Maintain regular physical activity: 150 min/week cardio + 2× strength training.",
        "Stay hydrated: 8–10 cups of water per day supports all body systems.",
        "Get 7–9 hours of quality sleep nightly for metabolic and cardiovascular health.",
        "Schedule annual check-ups with your doctor even when you feel well.",
      ],
    });
  }

  return suggestions;
}

const COLOR_STYLES: Record<string, { border: string; bg: string; icon: string; badge: string }> = {
  green: { border: "border-green-200", bg: "bg-emerald-500/10", icon: "text-green-600", badge: "bg-green-100 text-green-700" },
  amber: { border: "border-amber-200", bg: "bg-amber-500/10", icon: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
  red: { border: "border-red-200", bg: "bg-red-500/10", icon: "text-red-600", badge: "bg-red-100 text-red-700" },
};

const BLANK: Omit<VitalReading, "id"> = {
  date: new Date().toISOString().split("T")[0],
  weight: Number.NaN,
  height: Number.NaN,
  bpSystolic: Number.NaN,
  bpDiastolic: Number.NaN,
  sugar: Number.NaN,
};

export default function HealthTracker() {
  const { readings, addReading, updateReading, deleteReading, loading, error } = useHealth();
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<VitalReading, "id">>(BLANK);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<Omit<VitalReading, "id">>(BLANK);

  const latest = readings[readings.length - 1];
  const suggestions = latest ? buildSuggestions(latest) : [];

  const startEdit = (r: VitalReading) => {
    setEditId(r.id);
    setEditForm({ date: r.date, weight: r.weight, height: r.height, bpSystolic: r.bpSystolic, bpDiastolic: r.bpDiastolic, sugar: r.sugar });
  };

  const saveEdit = async (id: string) => {
    await updateReading(id, editForm);
    setEditId(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addReading(addForm);
    setAddOpen(false);
    setAddForm(BLANK);
  };

  const sorted = [...readings].sort((a, b) => b.date.localeCompare(a.date));

  return (
  <div className="space-y-8 max-w-6xl mx-auto min-h-screen bg-slate-950 p-6 rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Health Tracker</h1>
          <p className="text-sm text-slate-400 mt-2">{readings.length} readings logged</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl font-semibold shadow-xl transition-all hover:scale-105"
        >
          <Plus size={16} />
          Log Reading
        </button>
      </div>

      {/* Table */}
      {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
      <div className="">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800">
                {["Date", "Weight (kg)", "Height (cm)", "BP (mmHg)", "Sugar (mg/dL)", "BMI", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && sorted.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400 uppercase tracking-wider">No readings saved. Log your first reading to create health trends.</td></tr>
              )}
              {loading && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400 uppercase tracking-wider">Loading Firebase readings...</td></tr>
              )}
              {sorted.map((r) =>
                editId === r.id ? (
                  <tr key={r.id} className="bg-secondary/50 border-b border-border">
                    <td className="px-4 py-2">
                      <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg text-xs" />
                    </td>
                    {(["weight", "height", "bpSystolic", "bpDiastolic", "sugar"] as const).map((field) => (
                      <td key={field} className="px-4 py-2">
                        <input
                          type="number"
                          step={field === "weight" ? "0.1" : "1"}
                          value={editForm[field]}
                          onChange={(e) => setEditForm({ ...editForm, [field]: +e.target.value })}
                          className="w-20 px-2 py-1.5 bg-slate-900 border border-slate-700 bg-slate-800 text-slate-300 rounded-lg text-xs"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-2 text-xs text-slate-400 uppercase tracking-wider">
                      {bmi(editForm.weight, editForm.height).toFixed(1)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1.5">
                        <button onClick={() => saveEdit(r.id)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Save">
                          <Save size={14} />
                        </button>
                        <button onClick={() => setEditId(null)} className="p-1.5 text-slate-400 uppercase tracking-wider hover:bg-muted rounded-lg transition-colors" title="Cancel">
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={r.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-all">
                    <td className="px-4 py-3 text-xs font-medium text-white">{r.date}</td>
                    <td className="px-4 py-3 text-white">{r.weight}</td>
                    <td className="px-4 py-3 text-white">{r.height}</td>
                    <td className="px-4 py-3 text-white">{r.bpSystolic}/{r.bpDiastolic}</td>
                    <td className="px-4 py-3 text-white">{r.sugar}</td>
                    <td className="px-4 py-3 text-white">{bmi(r.weight, r.height).toFixed(1)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => startEdit(r)} className="p-1.5 text-slate-400 uppercase tracking-wider hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => deleteReading(r.id)} className="p-1.5 text-slate-400 uppercase tracking-wider hover:text-destructive hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={15} className="text-amber-600" />
          <p className="text-xs text-amber-700 font-medium">
            These are general lifestyle suggestions only — not prescriptions. Always consult your doctor before making health changes.
          </p>
        </div>
        <div className="space-y-4">
          {suggestions.map((s, i) => {
            const cs = COLOR_STYLES[s.color] ?? COLOR_STYLES.green;
            return (
              <div key={i} className={`rounded-2xl border ${cs.border} ${cs.bg} p-5`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 bg-slate-900 rounded-xl ${cs.icon} flex-shrink-0 shadow-sm`}>{s.icon}</div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{s.title}</h4>
                    <p className={`text-xs mt-0.5 ${cs.badge.split(" ")[1]} font-medium`}>{s.trigger}</p>
                  </div>
                </div>
                <ul className="space-y-1.5 ml-11">
                  {s.tips.map((tip, j) => (
                    <li key={j} className="flex gap-2 text-sm text-white/80">
                      <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-3 ml-11 italic">
                  ⚕️ Consult your doctor before making significant dietary or lifestyle changes.
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Log New Reading</h3>
              <button onClick={() => setAddOpen(false)} className="text-slate-400 uppercase tracking-wider hover:text-white p-1 rounded-lg hover:bg-muted">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                  <input required type="date" value={addForm.date} onChange={(e) => setAddForm({ ...addForm, date: e.target.value })} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Weight (kg)</label>
                  <input required min="1" type="number" step="0.1" value={Number.isFinite(addForm.weight) ? addForm.weight : ""} onChange={(e) => setAddForm({ ...addForm, weight: +e.target.value })} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Height (cm)</label>
                  <input required min="1" type="number" value={Number.isFinite(addForm.height) ? addForm.height : ""} onChange={(e) => setAddForm({ ...addForm, height: +e.target.value })} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Systolic (mmHg)</label>
                  <input required min="1" type="number" value={Number.isFinite(addForm.bpSystolic) ? addForm.bpSystolic : ""} onChange={(e) => setAddForm({ ...addForm, bpSystolic: +e.target.value })} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Diastolic (mmHg)</label>
                  <input required min="1" type="number" value={Number.isFinite(addForm.bpDiastolic) ? addForm.bpDiastolic : ""} onChange={(e) => setAddForm({ ...addForm, bpDiastolic: +e.target.value })} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Sugar (mg/dL)</label>
                  <input required min="1" type="number" value={Number.isFinite(addForm.sugar) ? addForm.sugar : ""} onChange={(e) => setAddForm({ ...addForm, sugar: +e.target.value })} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setAddOpen(false)} className="flex-1 border border-slate-700 py-2.5 rounded-xl text-sm font-medium text-slate-400 uppercase tracking-wider hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600 shadow-xl text-white py-2.5 rounded-xl text-sm font-semibold transition-all">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
