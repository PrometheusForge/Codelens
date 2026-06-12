export const DIMENSIONS = {
  correctness: {
    label: 'Correctness',
    weight: 0.35,
    description: 'Does the code pass all test cases and handle edge cases?',
    levels: {
      100: 'All test cases pass; all edge cases explicitly handled',
      80:  'Core tests pass; 1–2 edge case failures',
      60:  'Majority of tests pass; some logic errors present',
      40:  'Partial solution; significant incorrect logic',
      20:  'Wrong answer but demonstrates domain understanding',
      0:   'Does not compile or completely wrong approach'
    }
  },
  efficiency: {
    label: 'Time & Space Efficiency',
    weight: 0.25,
    description: 'Is the complexity optimal or near-optimal for this problem?',
    levels: {
      100: 'Optimal time AND space complexity for this problem class',
      80:  'Near-optimal; one dimension has room to improve',
      60:  'Acceptable complexity; brute force in one dimension',
      40:  'Naive/brute force solution; O(n²) or worse when better exists',
      20:  'Highly inefficient but complexity is acknowledged',
      0:   'No complexity consideration; exponential time on polynomial problem'
    }
  },
  readability: {
    label: 'Code Quality & Readability',
    weight: 0.20,
    description: 'Is the code clean, well-named, and idiomatic?',
    levels: {
      100: 'Clean, idiomatic, self-documenting; variable names are precise',
      80:  'Mostly readable; minor naming or style inconsistencies',
      60:  'Functional but hard to follow in places',
      40:  'Poor naming, no comments where needed, confusing structure',
      20:  'Very difficult to understand even for domain experts',
      0:   'Completely unreadable or obfuscated'
    }
  },
  explanation: {
    label: 'Explanation Quality',
    weight: 0.15,
    description: 'Does the model explain its approach, complexity, and trade-offs clearly?',
    levels: {
      100: 'Precise explanation + correct complexity analysis + meaningful trade-off discussion',
      80:  'Good explanation; complexity stated; minor gaps',
      60:  'Basic explanation present; complexity mentioned but vague',
      40:  'Vague or incomplete explanation; no complexity',
      20:  'Minimal explanation that adds little value',
      0:   'No explanation at all'
    }
  },
  security: {
    label: 'Security & Safety',
    weight: 0.05,
    description: 'Does the code avoid security pitfalls and handle untrusted input?',
    levels: {
      100: 'Explicitly validates input; handles adversarial cases; no injection risks',
      80:  'Minor security consideration gaps; generally safe',
      60:  'Some security awareness; not all inputs validated',
      40:  'Ignores security considerations for input that warrants them',
      20:  'Uses demonstrably insecure patterns',
      0:   'Major security vulnerabilities (SQL injection, eval on input, etc.)'
    }
  }
};

export const calculateWeightedScore = (scores) => {
  return Object.entries(scores).reduce((total, [dim, score]) => {
    const weight = DIMENSIONS[dim]?.weight || 0;
    return total + (score * weight);
  }, 0);
};

export const getLetterGrade = (score) => {
  if (score >= 90) return { grade: 'A', label: 'Excellent', color: '#22c55e' };
  if (score >= 80) return { grade: 'B', label: 'Good',      color: '#84cc16' };
  if (score >= 70) return { grade: 'C', label: 'Adequate',  color: '#eab308' };
  if (score >= 60) return { grade: 'D', label: 'Poor',      color: '#f97316' };
  return              { grade: 'F', label: 'Failing',    color: '#ef4444' };
};