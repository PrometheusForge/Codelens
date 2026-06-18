import { extractCode } from '../utils/codeExtractor';

export const autoScoreCorrectness = (testRunResult) => {
  if (!testRunResult) return 0;
  return testRunResult.scorePercent || 0;
};

export const autoScoreEfficiency = (aiResponse, testRunResult, challenge) => {
  let score = testRunResult?.scorePercent || 50;
  
  const timeMatch = aiResponse.match(/time[^:]*:\s*O\(([^)]+)\)/i);
  const claimedTime = timeMatch ? `O(${timeMatch[1]})`.toLowerCase() : null;
  const optimalTime = challenge.optimalComplexity?.time?.toLowerCase() || null;
  
  if (!claimedTime) {
    score -= 15;
  } 
  else if (optimalTime && claimedTime === optimalTime) {
    score = Math.min(score + 10, 100); 
  }
  else if (score < 50 && (claimedTime.includes('1)') || claimedTime.includes('n)'))) {
    score -= 30; 
  }

  return Math.max(0, Math.min(score, 100));
};

export const autoScoreExplanation = (aiResponse) => {
  const hasApproachSection = /##\s*approach/i.test(aiResponse);
  const hasComplexitySection = /##\s*complexity/i.test(aiResponse);
  const hasEdgeCaseSection = /##\s*edge\s*cases/i.test(aiResponse);
  const wordCount = aiResponse.split(/\s+/).length;
  
  let score = 0;
  if (hasApproachSection) score += 30;
  if (hasComplexitySection) score += 30;
  if (hasEdgeCaseSection) score += 20;
  
  if (wordCount > 150) score += 10;
  if (wordCount > 300) score += 10;
  
  return Math.min(score, 90);
};

export const autoScoreReadability = (code) => {
  if (!code || code.length < 10) return 0;
  
  const lines = code.split('\n').filter(l => l.trim());
  const avgLineLength = lines.reduce((sum, l) => sum + l.length, 0) / lines.length;
  
  const hasComments = /(\/\/.*|\/\*[\s\S]*?\*\/|#.*)/.test(code); 
  
  const hasEgregiousMagicNumbers = /\s+[=<>]\s*(?!0|1|2|10|100)\d{2,}\s*[;,\n]/.test(code);
  
  const singleLetterVars = (code.match(/\b[a-hl-z]\b(?!\s*[:=(])/g) || []).length;
  
  let score = 70;
  if (hasComments) score += 15;
  if (avgLineLength < 80) score += 10;
  if (!hasEgregiousMagicNumbers) score += 5;
  
  if (singleLetterVars > 5) score -= 20;
  
  return Math.max(0, Math.min(score, 90)); 
};

export const autoScoreSecurity = (code, language) => {
  let score = 100;
  
  const dangerousPatterns = {
    javascript: [
      { regex: /\beval\s*\(/, penalty: 50 },
      { regex: /\bFunction\s*\(/, penalty: 40 },
      { regex: /child_process/, penalty: 50 },
      { regex: /setTimeout\s*\(\s*['"`]/, penalty: 20 }
    ],
    python: [
      { regex: /\beval\s*\(/, penalty: 50 },
      { regex: /\bexec\s*\(/, penalty: 50 },
      { regex: /\bos\.system/, penalty: 50 },
      { regex: /\bsubprocess/, penalty: 40 },
      { regex: /__import__/, penalty: 30 }
    ],
    default: [
      { regex: /\beval\s*\(/, penalty: 50 },
      { regex: /\bexec\s*\(/, penalty: 50 }
    ]
  };

  const activeRules = dangerousPatterns[language?.toLowerCase()] || dangerousPatterns.default;
  
  activeRules.forEach(rule => {
    if (rule.regex.test(code)) {
      score -= rule.penalty;
    }
  });

  return Math.max(0, score);
};

export const generatePrefilledScores = (aiResponse, testRunResult, challenge) => {
  const code = extractCode(aiResponse, challenge.language);
  
  return {
    correctness: autoScoreCorrectness(testRunResult),
    efficiency:  autoScoreEfficiency(aiResponse, testRunResult, challenge),
    readability: autoScoreReadability(code),
    explanation: autoScoreExplanation(aiResponse),
    security:    autoScoreSecurity(code, challenge.language), 
    _isAutoScored: true
  };
};