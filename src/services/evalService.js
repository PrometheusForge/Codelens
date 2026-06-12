import { extractCode } from '../utils/codeExtractor'

// Correctness: fully automated from test results
export const autoScoreCorrectness = (testRunResult) => {
  if (!testRunResult) return 0;
  return testRunResult.scorePercent;
};

// Efficiency: parse AI's complexity claims; validate against the challenge's optimal
export const autoScoreEfficiency = (aiResponse, challenge) => {
  const timeMatch  = aiResponse.match(/time[^:]*:\s*O\(([^)]+)\)/i);
  const spaceMatch = aiResponse.match(/space[^:]*:\s*O\(([^)]+)\)/i);
  
  const claimedTime  = timeMatch  ? `O(${timeMatch[1]})`.toLowerCase()  : null;
  const optimalTime  = challenge.optimalComplexity?.time?.toLowerCase()  || null;
  
  if (!claimedTime) return 40; // No complexity mentioned → penalty
  if (optimalTime && claimedTime === optimalTime) return 90; // Claimed optimal
  if (claimedTime?.includes('n)') || claimedTime?.includes('n log')) return 70; // Linear or linearithmic
  if (claimedTime?.includes('n²') || claimedTime?.includes('n^2')) return 40; // Quadratic
  return 50; // Default mid-range if we can't parse
};

// Explanation: heuristic based on section presence and word count
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
  
  return Math.min(score, 90); // Cap at 90; human review needed for 90-100
};

// Readability: heuristic based on line length, variable naming, comment presence
export const autoScoreReadability = (code) => {
  if (!code || code.length < 10) return 0;
  
  const lines = code.split('\n').filter(l => l.trim());
  const avgLineLength = lines.reduce((sum, l) => sum + l.length, 0) / lines.length;
  const hasComments = /\/\/|#|\/\*/.test(code);
  const hasMagicNumbers = /[^0-9][2-9]\d{1,3}[^0-9]/.test(code);
  const singleLetterVars = (code.match(/\b[a-z]\b(?!\s*[=<>])/g) || []).length;
  
  let score = 70; // Start with 70 (adequate)
  if (hasComments) score += 10;
  if (avgLineLength < 80) score += 10;
  if (!hasMagicNumbers) score += 5;
  if (singleLetterVars < 3) score += 5;
  else if (singleLetterVars > 8) score -= 20;
  
  return Math.min(score, 85); // Cap; human review for 85-100
};

// Bundle: generate all pre-filled scores from a model response
export const generatePrefilledScores = (aiResponse, testRunResult, challenge) => {
  const code = extractCode(aiResponse, challenge.language);
  
  return {
    correctness: autoScoreCorrectness(testRunResult),
    efficiency:  autoScoreEfficiency(aiResponse, challenge),
    readability: autoScoreReadability(code),
    explanation: autoScoreExplanation(aiResponse),
    security:    60, // Security always needs human review — default to "acceptable"
    _isAutoScored: true
  };
};