export const extractCode = (aiResponse) => {
  if (!aiResponse || typeof aiResponse !== 'string') return '';
  
  const fencedWithLang = /```(?:javascript|js|typescript|ts|python|py|java|go|rust|cpp|c\+\+)?\n([\s\S]*?)```/gi;
  const fencedMatches = [...aiResponse.matchAll(fencedWithLang)];
  
  if (fencedMatches.length > 0) {
    return fencedMatches
      .map(m => m[1].trim())
      .reduce((longest, current) => current.length > longest.length ? current : longest, '');
  }
  
  const fencedNoLang = /```\n?([\s\S]*?)```/g;
  const noLangMatches = [...aiResponse.matchAll(fencedNoLang)];
  if (noLangMatches.length > 0) {
    return noLangMatches[0][1].trim();
  }
  
  const lines = aiResponse.split('\n');
  const indentedLines = lines.filter(l => l.startsWith('    '));
  if (indentedLines.length > 5) {
    return indentedLines.map(l => l.slice(4)).join('\n');
  }
  
  return '';
};

export const detectLanguage = (code) => {
  if (/def\s+\w+\s*\(|import\s+\w+|print\(/.test(code)) return 'python';
  if (/function\s+\w+|const\s+\w+|let\s+\w+|=>/.test(code)) return 'javascript';
  if (/public\s+class|System\.out/.test(code)) return 'java';
  if (/func\s+\w+|fmt\.Println/.test(code)) return 'go';
  return 'javascript';
};