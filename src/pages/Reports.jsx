import React, { useState } from 'react';
import { 
  FileText, Download, Copy, Printer, ChevronLeft, 
  ChevronDown, ChevronUp, Calendar, Check, Activity, Code2
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_SESSIONS = [
  {
    id: 'sess_1',
    challengeTitle: 'Two Sum',
    date: '2026-06-12T05:30:00Z',
    models: [
      { name: 'Gemini 1.5 Flash', score: 92, time: '0.8s' },
      { name: 'Llama 3 (70B)', score: 88, time: '1.2s' },
      { name: 'Mistral 7B', score: 65, time: '0.9s' }
    ],
    analystNotes: 'Gemini and Llama both successfully implemented the optimal O(n) hash map approach. Mistral failed the edge case with negative numbers and defaulted to a brute-force O(n^2) loop.',
    conclusion: 'For standard algorithmic tasks involving hash maps, smaller models like Mistral 7B may require more explicit prompting regarding edge cases. Gemini 1.5 Flash provides the best speed-to-correctness ratio here.',
    codeSnippets: [
      {
        model: 'Gemini 1.5 Flash',
        language: 'javascript',
        code: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`
      },
      {
        model: 'Mistral 7B',
        language: 'javascript',
        code: `function twoSum(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n  return [];\n}`
      }
    ]
  },
  {
    id: 'sess_2',
    challengeTitle: 'Token Bucket Rate Limiter',
    date: '2026-06-10T14:15:00Z',
    models: [
      { name: 'GPT-4o', score: 96, time: '1.4s' },
      { name: 'Llama 3 (70B)', score: 90, time: '2.1s' }
    ],
    analystNotes: 'Both models utilized lazy evaluation via timestamps, completely avoiding memory leaks associated with setInterval. GPT-4o\'s implementation was slightly more idiomatic.',
    conclusion: '',
    codeSnippets: []
  }
];

const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ring-1 ring-inset ${className}`}>
    {children}
  </span>
);

const CodeAccordion = ({ snippet }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl bg-white/[0.02] ring-1 ring-white/10 overflow-hidden print:ring-zinc-300 print:bg-white print:mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-zinc-950/50 hover:bg-zinc-900 transition-colors print:bg-zinc-100 print:text-black"
      >
        <div className="flex items-center gap-3">
          <Code2 className="w-4 h-4 text-zinc-500 print:text-zinc-800" />
          <span className="text-sm font-medium text-zinc-200 print:text-black">{snippet.model}</span>
          <Badge className="bg-zinc-800 text-zinc-400 ring-zinc-700 print:bg-zinc-200 print:text-zinc-600 print:ring-transparent">
            {snippet.language}
          </Badge>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
      </button>
      
      {/* 
        Using standard React conditional rendering, but adding print:block 
        so code is always visible when printing regardless of accordion state.
      */}
      <div className={`${isOpen ? 'block' : 'hidden'} print:block border-t border-white/5 print:border-zinc-200 p-4 bg-[#0c0c0e] print:bg-white`}>
        <pre className="text-xs font-mono text-zinc-300 print:text-black whitespace-pre-wrap overflow-x-auto">
          {snippet.code}
        </pre>
      </div>
    </div>
  );
};

export default function Reports() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [conclusions, setConclusions] = useState(
    MOCK_SESSIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.conclusion }), {})
  );
  const [copied, setCopied] = useState(false);

  // --- ACTIONS ---
  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = (session) => {
    const dataStr = JSON.stringify(session, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eval_report_${session.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = (session) => {
    let md = `# Evaluation Report: ${session.challengeTitle}\n`;
    md += `**Date:** ${new Date(session.date).toLocaleDateString()}\n\n`;
    
    md += `## Model Performance\n`;
    md += `| Model | Score | Time |\n|---|---|---|\n`;
    session.models.forEach(m => {
      md += `| ${m.name} | ${m.score} | ${m.time} |\n`;
    });
    
    md += `\n## Analyst Notes\n${session.analystNotes}\n`;
    
    const currentConclusion = conclusions[session.id];
    if (currentConclusion) {
      md += `\n## Conclusion\n${currentConclusion}\n`;
    }

    if (session.codeSnippets && session.codeSnippets.length > 0) {
      md += `\n## Code Extracts\n`;
      session.codeSnippets.forEach(snippet => {
        md += `\n### ${snippet.model}\n`;
        md += `\`\`\`${snippet.language}\n${snippet.code}\n\`\`\`\n`;
      });
    }

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleConclusionChange = (id, text) => {
    setConclusions(prev => ({ ...prev, [id]: text }));
  };

  if (selectedSession) {
    return (
      <div className="min-h-[100dvh] bg-[#09090b] text-zinc-100 print:bg-white print:text-black py-12 md:py-24">
        <div className="mx-auto max-w-[1000px] px-4 md:px-8">
          
          {/* Action Bar (Hidden when printing) */}
          <div className="mb-10 flex items-center justify-between print:hidden">
            <button 
              onClick={() => setSelectedSession(null)}
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Log
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-full bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-300 ring-1 ring-white/10 hover:bg-white/[0.08] transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button 
                onClick={() => handleCopyMarkdown(selectedSession)}
                className="flex items-center gap-2 rounded-full bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-300 ring-1 ring-white/10 hover:bg-white/[0.08] transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied MD' : 'Copy MD'}
              </button>
              <button 
                onClick={() => handleExportJSON(selectedSession)}
                className="flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-zinc-200 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Export JSON
              </button>
            </div>
          </div>

          {/* Document Header */}
          <header className="mb-12 pb-8 border-b border-white/10 print:border-zinc-300">
            <div className="flex items-center gap-3 mb-4 text-zinc-500 print:text-zinc-600">
              <FileText className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Evaluation Report</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-white print:text-black mb-4">
              {selectedSession.challengeTitle}
            </h1>
            <div className="flex items-center gap-2 text-sm text-zinc-400 print:text-zinc-600">
              <Calendar className="w-4 h-4" />
              <span>Conducted on {new Date(selectedSession.date).toLocaleDateString()}</span>
            </div>
          </header>

          {/* Document Content */}
          <div className="space-y-12">
            
            {/* Performance Table */}
            <section>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-6 print:text-zinc-800">
                Model Performance
              </h2>
              <div className="rounded-2xl ring-1 ring-white/10 overflow-hidden bg-white/[0.02] print:ring-zinc-300 print:bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/40 print:bg-zinc-100 text-[10px] font-medium uppercase tracking-wider text-zinc-500 print:text-zinc-600">
                    <tr>
                      <th className="px-6 py-4">Model Architecture</th>
                      <th className="px-6 py-4 text-right">Aggregate Score</th>
                      <th className="px-6 py-4 text-right">Avg Response Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 print:divide-zinc-200">
                    {selectedSession.models.map((model, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 font-medium text-zinc-200 print:text-black">{model.name}</td>
                        <td className="px-6 py-4 text-right font-mono text-emerald-400 print:text-emerald-700">{model.score}</td>
                        <td className="px-6 py-4 text-right font-mono text-zinc-500 print:text-zinc-600">{model.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Analyst Notes */}
            <section>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-4 print:text-zinc-800">
                Analyst Notes
              </h2>
              <div className="text-zinc-300 leading-relaxed print:text-black">
                {selectedSession.analystNotes || "No preliminary notes recorded."}
              </div>
            </section>

            {/* Editable Conclusions */}
            <section>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-4 print:text-zinc-800">
                Final Conclusion
              </h2>
              <div className="relative group">
                <textarea 
                  value={conclusions[selectedSession.id]}
                  onChange={(e) => handleConclusionChange(selectedSession.id, e.target.value)}
                  placeholder="Record your final observations and recommendations here..."
                  className="w-full min-h-[120px] rounded-xl bg-white/[0.02] p-4 text-sm text-zinc-300 leading-relaxed placeholder-zinc-600 ring-1 ring-white/10 transition-all focus:bg-white/[0.04] focus:outline-none focus:ring-white/20 resize-y print:bg-transparent print:ring-0 print:p-0 print:text-black print:resize-none"
                />
              </div>
            </section>

            {/* Code Extractions */}
            {selectedSession.codeSnippets && selectedSession.codeSnippets.length > 0 && (
              <section className="print:break-before-page">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-6 print:text-zinc-800">
                  Extracted Code Payloads
                </h2>
                <div className="space-y-4">
                  {selectedSession.codeSnippets.map((snippet, idx) => (
                    <CodeAccordion key={idx} snippet={snippet} />
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#09090b] text-zinc-100 py-12 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        
        <header className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tighter text-white md:text-5xl">
            Evaluation Reports
          </h1>
          <p className="mt-4 text-lg text-zinc-400 leading-relaxed max-w-[50ch]">
            Access, export, and distribute detailed teardowns of all completed AI benchmarking sessions.
          </p>
        </header>

        <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#0c0c0e] ring-1 ring-white/5 overflow-hidden">
            
            <table className="w-full text-left text-sm border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="py-4 px-6 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Date</th>
                  <th className="py-4 px-6 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Challenge</th>
                  <th className="py-4 px-6 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Models Evaluated</th>
                  <th className="py-4 px-6 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_SESSIONS.map((session) => (
                  <tr key={session.id} className="group transition-colors hover:bg-white/[0.02]">
                    <td className="py-4 px-6 whitespace-nowrap text-zinc-400 font-mono text-xs">
                      {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-zinc-200">{session.challengeTitle}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-2">
                        {session.models.map((m, idx) => (
                          <Badge key={idx} className="bg-white/[0.03] text-zinc-400 ring-white/10">
                            {m.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => setSelectedSession(session)}
                        className="inline-flex items-center gap-2 rounded-full bg-white/[0.03] px-4 py-2 text-xs font-semibold text-zinc-300 ring-1 ring-white/10 transition-all group-hover:bg-white/[0.08] active:scale-[0.98]"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>

      </div>
    </div>
  );
}