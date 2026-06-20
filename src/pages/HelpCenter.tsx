import { useState } from "react";
import { ChevronDown, MessageCircle, FileText, Zap, Shield, Mail } from "lucide-react";
import { Card } from "../app/components/ui/card";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I add my health readings?",
    answer: "Go to the Health Tracker section and click 'Add Reading'. You can record your weight, blood pressure, blood sugar, and other vital signs. Your data is securely stored in Firebase.",
  },
  {
    question: "Can I get medical advice from the AI?",
    answer: "The AI Health Chat provides general health information only. It is NOT a substitute for professional medical advice. Always consult with a licensed healthcare provider for diagnosis and treatment.",
  },
  {
    question: "How secure is my data?",
    answer: "Your health data is encrypted and stored securely in Firebase. Only you can access your personal health information. You can manage privacy settings in Settings.",
  },
  {
    question: "How do I find doctors near me?",
    answer: "Use the 'Find Doctors' section to search for healthcare providers by specialty and location. You can view their profiles and ratings.",
  },
  {
    question: "Can I export my health data?",
    answer: "Currently, you can view and manage all your health readings in the dashboard. Contact support for bulk data export options.",
  },
  {
    question: "Is there an offline mode?",
    answer: "The app requires an internet connection to sync your data. You can view previously loaded data offline, but new changes won't be saved.",
  },
  {
    question: "How often should I update my profile?",
    answer: "Update your profile whenever your health information changes (age, allergies, medical conditions). This helps the AI provide more relevant suggestions.",
  },
  {
    question: "What does 'Continue as Guest' mean?",
    answer: "Guest mode allows you to explore the app without creating an account. However, your data won't be saved. Create an account to persist your health records.",
  },
];

export default function HelpCenter() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Find answers and get support</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 hover:border-primary/50 cursor-pointer transition-colors">
          <div className="flex items-start gap-3">
            <Zap className="text-primary mt-1 shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-foreground">Getting Started</h3>
              <p className="text-sm text-muted-foreground">Learn the basics of using the app</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:border-primary/50 cursor-pointer transition-colors">
          <div className="flex items-start gap-3">
            <Shield className="text-primary mt-1 shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-foreground">Privacy & Security</h3>
              <p className="text-sm text-muted-foreground">How we protect your health data</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:border-primary/50 cursor-pointer transition-colors">
          <div className="flex items-start gap-3">
            <FileText className="text-primary mt-1 shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-foreground">Documentation</h3>
              <p className="text-sm text-muted-foreground">Feature guides and tutorials</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:border-primary/50 cursor-pointer transition-colors">
          <div className="flex items-start gap-3">
            <MessageCircle className="text-primary mt-1 shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-foreground">Contact Us</h3>
              <p className="text-sm text-muted-foreground">Get in touch with our support team</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Frequently Asked Questions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
              >
                <span className="text-left font-medium text-foreground text-sm">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-muted-foreground shrink-0 transition-transform ${
                    expandedIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedIndex === index && (
                <div className="px-4 py-3 border-t border-border bg-secondary/30">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Support Contact */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <Mail className="text-primary mt-1 shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-foreground">Still need help?</h3>
            <p className="text-sm text-muted-foreground mt-1">Contact our support team at support@evercareai.com</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
