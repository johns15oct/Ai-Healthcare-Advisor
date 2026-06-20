import { useState } from "react";
import {
  Weight,
  Activity,
  Droplets,
  Heart,
  Plus,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useHealth } from "../context/HealthContext";
import { VitalReading } from "../data/mockData";

function bmi(weight: number, height: number) {
  return weight / Math.pow(height / 100, 2);
}

type Status = "green" | "yellow" | "red";

function bmiStatus(b: number): Status {
  if (b >= 18.5 && b <= 24.9) return "green";
  if ((b >= 17 && b < 18.5) || (b > 24.9 && b <= 29.9)) return "yellow";
  return "red";
}

function bpStatus(sys: number, dia: number): Status {
  if (sys < 120 && dia < 80) return "green";
  if (sys < 140 && dia < 90) return "yellow";
  return "red";
}

function sugarStatus(s: number): Status {
  if (s < 100) return "green";
  if (s < 126) return "yellow";
  return "red";
}

const statusStyles: Record<Status, { card: string; badge: string; dot: string }> = {
  green: {
    card: "border-green-200 bg-white",
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  yellow: {
    card: "border-amber-200 bg-white",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  red: {
    card: "border-red-200 bg-white",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
};

const statusLabel: Record<Status, string> = {
  green: "Normal",
  yellow: "Borderline",
  red: "Concerning",
};

function MetricCard({
  icon,
  label,
  value,
  unit,
  status,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  status: Status;
  sub?: string;
}) {
  const s = statusStyles[status];
  return (
    <div className={`rounded-xl border ${s.card} p-4 flex flex-col gap-2.5 transition-all hover:shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">{icon}</div>
        <span className={`text-[9px] font-semibold px-2 py-1 rounded-full ${s.badge} flex items-center gap-1`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {statusLabel[status]}
        </span>
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground font-medium mb-0.5">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-foreground">{value}</span>
          <span className="text-[10px] text-muted-foreground">{unit}</span>
        </div>
        {sub && <p className="text-[9px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const LINE_COLORS = {
  weight: "#0b766e",
  systolic: "#ef4444",
  diastolic: "#f97316",
  sugar: "#8b5cf6",
};

const LINES = [
  { key: "weight", label: "Weight (kg)", color: LINE_COLORS.weight },
  { key: "systolic", label: "Systolic (mmHg)", color: LINE_COLORS.systolic },
  { key: "diastolic", label: "Diastolic (mmHg)", color: LINE_COLORS.diastolic },
  { key: "sugar", label: "Sugar (mg/dL)", color: LINE_COLORS.sugar },
] as const;

type LineKey = (typeof LINES)[number]["key"];

const emptyForm: Omit<VitalReading, "id"> = {
  date: new Date().toISOString().split("T")[0],
  weight: Number.NaN,
  height: Number.NaN,
  bpSystolic: Number.NaN,
  bpDiastolic: Number.NaN,
  sugar: Number.NaN,
};

export default function Dashboard() {
  const { readings, addReading, loading, error } = useHealth();
  const [visible, setVisible] = useState<Record<LineKey, boolean>>({
    weight: true,
    systolic: true,
    diastolic: true,
    sugar: true,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const latest = readings[readings.length - 1];
  const b = latest ? bmi(latest.weight, latest.height) : 0;

  const chartData = readings.map((r) => ({
    date: r.date.slice(5),
    weight: r.weight,
    systolic: r.bpSystolic,
    diastolic: r.bpDiastolic,
    sugar: r.sugar,
  }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = [form.weight, form.height, form.bpSystolic, form.bpDiastolic, form.sugar];
    if (values.some((value) => !Number.isFinite(value) || value <= 0)) return;
    setSaving(true);
    try {
      await addReading(form);
      setModalOpen(false);
      setForm(emptyForm);
    } finally {
      setSaving(false);
    }
  };

  const trend = readings.length > 1 ? (
    readings[readings.length - 1].weight - readings[readings.length - 2].weight
  ) : 0;

  return (
    <div className="mx-auto max-w-[1180px] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[15px] font-semibold text-foreground">Patient health overview</h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {latest ? `Your latest clinical summary, updated ${latest.date}` : "Add a reading to build your personal dashboard"}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-[#075d57] text-white px-3.5 py-2 rounded-lg text-[11px] font-semibold transition-all"
        >
          <Plus size={16} />
          Add Reading
        </button>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[10px] text-red-700">{error}</div>}

      {loading ? (
        <div className="grid min-h-64 place-items-center rounded-xl border border-border bg-white text-xs text-muted-foreground">Loading your Firebase readings...</div>
      ) : !latest ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-primary/30 bg-white px-6 text-center">
          <Activity size={28} className="mb-3 text-primary" />
          <h3 className="text-sm font-semibold">No health readings yet</h3>
          <p className="mt-1 max-w-sm text-[10px] leading-relaxed text-muted-foreground">Add your weight, height, blood pressure and blood sugar. The dashboard and graph will use only your saved Firebase data.</p>
          <button onClick={() => setModalOpen(true)} className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-[11px] font-semibold text-white"><Plus size={14} />Add first reading</button>
        </div>
      ) : (<>
      {/* Metric cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard
          icon={<Weight size={18} />}
          label="Weight"
          value={latest.weight.toString()}
          unit="kg"
          status={bmiStatus(b)}
          sub={`↕ ${trend > 0 ? "+" : ""}${trend.toFixed(1)} kg`}
        />
        <MetricCard
          icon={<Activity size={18} />}
          label="BMI"
          value={b.toFixed(1)}
          unit="kg/m²"
          status={bmiStatus(b)}
          sub={`Height: ${latest.height} cm`}
        />
        <MetricCard
          icon={<Heart size={18} />}
          label="Blood Pressure"
          value={`${latest.bpSystolic}/${latest.bpDiastolic}`}
          unit="mmHg"
          status={bpStatus(latest.bpSystolic, latest.bpDiastolic)}
          sub="Systolic / Diastolic"
        />
        <MetricCard
          icon={<Droplets size={18} />}
          label="Blood Sugar"
          value={latest.sugar.toString()}
          unit="mg/dL"
          status={sugarStatus(latest.sugar)}
          sub="Fasting glucose"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(250px,0.8fr)]">
        <div className="rounded-xl border border-border bg-white">
          <div className="flex flex-col justify-between gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-[12px] font-semibold text-foreground">Vital signs trend</h3>
              <p className="text-[9px] text-muted-foreground">Last {readings.length} readings</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {LINES.map((line) => (
                <button
                  key={line.key}
                  onClick={() => setVisible((current) => ({ ...current, [line.key]: !current[line.key] }))}
                  className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[9px] font-medium ${visible[line.key] ? "border-border bg-white" : "border-transparent bg-muted text-muted-foreground"}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: visible[line.key] ? line.color : "#cbd5d1" }} />
                  {line.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
          <div className="px-3 pb-2 pt-4">
            <ResponsiveContainer width="100%" height={275}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#edf2f1" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#71807e" }} axisLine={false} tickLine={false} />
                <YAxis domain={[55, 180]} tick={{ fontSize: 9, fill: "#71807e" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e3eae9", fontSize: "10px", boxShadow: "0 8px 24px rgba(23,32,31,.08)" }} />
                {LINES.map((line) => visible[line.key] ? (
                  <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2} dot={{ r: 3, fill: line.color, strokeWidth: 0 }} activeDot={{ r: 5 }} name={line.label} />
                ) : null)}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-[12px] font-semibold">Cardiovascular summary</h3>
            <p className="text-[9px] text-muted-foreground">Based on your latest reading</p>
          </div>
          <div className="flex flex-col items-center px-4 py-5 text-center">
            <div className="relative mb-3 grid h-24 w-24 place-items-center rounded-full bg-[radial-gradient(circle,#dff5f2_0%,#f6fbfa_68%)]">
              <Heart size={45} className="text-primary drop-shadow-sm" fill="#71c9bf" strokeWidth={1.5} />
              <span className="absolute right-1 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400" />
            </div>
            <p className="text-[11px] font-semibold">Heart health</p>
            <p className="mt-1 max-w-[220px] text-[9px] leading-relaxed text-muted-foreground">Your latest blood pressure is categorized as {statusLabel[bpStatus(latest.bpSystolic, latest.bpDiastolic)].toLowerCase()}.</p>
            <div className="mt-5 grid w-full grid-cols-3 divide-x divide-border border-y border-border py-3">
              <div><p className="text-[8px] text-muted-foreground">Systolic</p><p className="mt-1 text-lg font-semibold">{latest.bpSystolic}</p><span className="text-[8px] text-muted-foreground">mmHg</span></div>
              <div><p className="text-[8px] text-muted-foreground">Diastolic</p><p className="mt-1 text-lg font-semibold">{latest.bpDiastolic}</p><span className="text-[8px] text-muted-foreground">mmHg</span></div>
              <div><p className="text-[8px] text-muted-foreground">Glucose</p><p className="mt-1 text-lg font-semibold">{latest.sugar}</p><span className="text-[8px] text-muted-foreground">mg/dL</span></div>
            </div>
            <div className="mt-4 w-full rounded-lg bg-secondary/70 px-3 py-2.5 text-left">
              <p className="text-[9px] font-semibold text-primary">Clinical note</p>
              <p className="mt-1 text-[9px] leading-relaxed text-muted-foreground">Continue logging readings regularly to improve trend accuracy.</p>
            </div>
          </div>
        </div>
      </div>
      </>)}

      {/* Add Reading Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-foreground text-lg">Add New Reading</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Date</label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Weight (kg)</label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    min="1"
                    value={Number.isFinite(form.weight) ? form.weight : ""}
                    onChange={(e) => setForm({ ...form, weight: +e.target.value })}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Height (cm)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={Number.isFinite(form.height) ? form.height : ""}
                    onChange={(e) => setForm({ ...form, height: +e.target.value })}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">BP Systolic</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={Number.isFinite(form.bpSystolic) ? form.bpSystolic : ""}
                    onChange={(e) => setForm({ ...form, bpSystolic: +e.target.value })}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">BP Diastolic</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={Number.isFinite(form.bpDiastolic) ? form.bpDiastolic : ""}
                    onChange={(e) => setForm({ ...form, bpDiastolic: +e.target.value })}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Sugar (mg/dL)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={Number.isFinite(form.sugar) ? form.sugar : ""}
                    onChange={(e) => setForm({ ...form, sugar: +e.target.value })}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border border-border py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-green-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  {saving ? "Saving to Firebase..." : "Save Reading"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
