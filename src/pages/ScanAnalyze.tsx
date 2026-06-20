import { useState, useCallback, useRef } from "react";
import { Upload, ImageIcon, ScanLine, AlertTriangle, X, Loader2, CheckCircle, Zap } from "lucide-react";

interface AnalysisResult {
  category: string;
  description: string;
  confidence: number;
  notes: string[];
}

const MOCK_RESULTS: AnalysisResult[] = [
  {
    category: "Skin Condition — Possible Eczema (Dermatitis)",
    description:
      "The uploaded image shows areas of dry, reddened skin with visible scaling patterns consistent with eczematous dermatitis. Localized inflammation and texture changes are present.",
    confidence: 64,
    notes: [
      "Eczema affects approximately 10–20% of children and 1–3% of adults worldwide.",
      "Common triggers include allergens, stress, dry air, and certain soaps or fabrics.",
      "A dermatologist can confirm the diagnosis and recommend appropriate topical treatments.",
    ],
  },
  {
    category: "Wound Assessment — Minor Laceration",
    description:
      "Image appears to show a superficial laceration with clean wound edges. No obvious signs of deep tissue involvement detected in this view.",
    confidence: 71,
    notes: [
      "Clean cuts under 1 cm with controlled bleeding typically heal well with proper first aid.",
      "Watch for signs of infection: increased redness, warmth, swelling, pus, or fever.",
      "Seek medical care for wounds that are deep, gaping, contaminated, or on the face/joints.",
    ],
  },
  {
    category: "Skin Lesion — Pigmentation Pattern",
    description:
      "The image shows areas of uneven pigmentation. While many pigmentation changes are benign (sun spots, post-inflammatory marks), irregular borders or color variation warrant professional evaluation.",
    confidence: 58,
    notes: [
      "Most moles and skin spots are benign, but any changes in size, shape, or color should be checked.",
      "Apply the ABCDE rule: Asymmetry, Border, Color, Diameter, Evolution.",
      "Annual skin screenings with a dermatologist are recommended, especially for fair-skinned individuals.",
    ],
  },
];

export default function ScanAnalyze() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = (f: File) => {
    // Validate file type
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, WEBP, etc.)");
      return;
    }
    
    // Validate file size (10 MB max)
    if (f.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB");
      return;
    }

    setError(null);
    setFile(f);
    setResult(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setPreview(result);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsDataURL(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadFile(f);
  }, []);

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setAnalyzing(true);
    setError(null);
    
    try {
      // TODO: connect to real AI vision API
      // Example: const formData = new FormData(); formData.append('image', file);
      // const response = await fetch('/api/analyze-image', { method: 'POST', body: formData });
      // const data = await response.json();
      // setResult(data);
      
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 2200));
      
      const mock = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
      setResult(mock);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">Scan & Analyze</h1>
        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
          <Zap size={16} className="text-primary" />
          Upload a health-related image for AI-assisted general information
        </p>
      </div>

      {/* Disclaimer banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 flex gap-3 animate-fade-in">
        <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Important Disclaimer</p>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
            This tool provides mock illustrative output only. It is <strong>not a diagnostic tool</strong> and cannot
            replace examination by a qualified healthcare professional. Always consult a doctor or dermatologist for
            any skin, wound, or health concern.
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-4 flex gap-3 animate-fade-in">
          <AlertTriangle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Upload area */}
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 transform ${
            dragging
              ? "border-primary bg-gradient-to-br from-primary/10 to-emerald-500/10 scale-[1.02] shadow-xl shadow-primary/20"
              : "border-border bg-gradient-to-br from-white to-secondary dark:from-slate-900 dark:to-slate-800 hover:border-primary/50 hover:shadow-lg"
          }`}
        >
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 ${
              dragging 
                ? "bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg scale-110" 
                : "bg-gradient-to-br from-primary/10 to-emerald-500/10 text-primary"
            }`}>
              <Upload size={28} />
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">Drop image here or click to browse</p>
              <p className="text-sm text-muted-foreground mt-2">PNG, JPG, WEBP — max 10 MB</p>
            </div>
            <span className="text-xs text-muted-foreground bg-gradient-to-r from-primary/10 to-emerald-500/10 px-4 py-1.5 rounded-full font-medium border border-primary/20">
              Skin conditions, wounds, rashes, etc.
            </span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { 
              const selectedFile = e.target.files?.[0];
              if (selectedFile) loadFile(selectedFile); 
            }}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in">
          <div className="relative bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <img
              src={preview}
              alt="Uploaded health image"
              className="w-full max-h-96 object-contain p-4"
              loading="lazy"
            />
            <button
              onClick={reset}
              disabled={analyzing}
              className="absolute top-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-border rounded-full p-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 hover:text-destructive shadow-lg disabled:opacity-50"
              title="Clear image"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground min-w-0">
              <ImageIcon size={16} className="flex-shrink-0" />
              <span className="truncate font-medium">{file?.name}</span>
              <span className="text-xs whitespace-nowrap">({((file?.size ?? 0) / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !!result}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:shadow-none transition-all duration-300 transform hover:scale-105 active:scale-95 flex-shrink-0"
            >
              {analyzing ? (
                <><Loader2 size={16} className="animate-spin" /> Analyzing…</>
              ) : result ? (
                <><CheckCircle size={16} /> Done</>
              ) : (
                <><ScanLine size={16} /> Analyze Image</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Analyzing skeleton */}
      {analyzing && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-border shadow-lg p-8 space-y-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded-lg w-2/3" />
              <div className="h-3 bg-muted rounded-lg w-1/3" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded-lg w-full" />
            <div className="h-3 bg-muted rounded-lg w-5/6" />
            <div className="h-3 bg-muted rounded-lg w-4/6" />
          </div>
        </div>
      )}

      {/* Result card */}
      {result && !analyzing && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-border shadow-lg p-8 space-y-6 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-2xl text-primary flex-shrink-0">
              <ScanLine size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-foreground text-lg">{result.category}</h4>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-emerald-600 h-2 transition-all duration-1000"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-semibold whitespace-nowrap">{result.confidence}% match</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            {result.description}
          </p>

          <div className="bg-gradient-to-br from-primary/5 to-emerald-500/5 dark:from-primary/10 dark:to-emerald-500/10 rounded-2xl p-5 space-y-3 border border-primary/10 dark:border-primary/20">
            <p className="text-xs font-semibold text-primary/80 dark:text-primary/90 mb-3 flex items-center gap-2">
              <Zap size={14} /> Key Information
            </p>
            {result.notes.map((n, i) => (
              <div key={i} className="flex gap-3 text-sm text-foreground/80">
                <span className="text-primary font-bold flex-shrink-0 mt-0.5">•</span>
                <span>{n}</span>
              </div>
            ))}
          </div>

          {/* Strong disclaimer */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-5 flex gap-4 animate-pulse-subtle">
            <AlertTriangle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
              <strong>⚠️ This is NOT a medical diagnosis.</strong> This output is a simulated demonstration only. Please consult a qualified dermatologist or medical doctor for any skin condition, wound, or health concern. Do not make treatment decisions based on this result. Seek immediate medical attention for severe injuries or health emergencies.
            </p>
          </div>

          <button
            onClick={reset}
            className="w-full bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 hover:from-slate-300 hover:to-slate-200 dark:hover:from-slate-600 dark:hover:to-slate-700 text-foreground px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Analyze Another Image
          </button>
        </div>
      )}
    </div>
  );
}
