const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_CONFIG = {
  javascript: { language: 'javascript', version: '18.15.0', extension: 'js' },
  typescript: { language: 'typescript', version: '5.0.3', extension: 'ts' },
  python:     { language: 'python',     version: '3.10.0', extension: 'py' },
  java:       { language: 'java',       version: '15.0.2', extension: 'java' },
  go:         { language: 'go',         version: '1.16.2', extension: 'go' },
  rust:       { language: 'rust',       version: '1.50.0', extension: 'rs' },
};

export const executeCode = async (code, language = 'javascript', stdin = '') => {
  const config = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;
  
  const response = await fetch(PISTON_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: config.language,
      version: config.version,
      files: [{ name: `main.${config.extension}`, content: code }],
      stdin,
      args: [],
      compile_timeout: 10000,
      run_timeout: 3000,
      run_memory_limit: 128000000  // 128MB
    })
  });
  
  if (!response.ok) throw new Error(`Piston API error: ${response.status}`);
  
  const result = await response.json();
  
  return {
    stdout:       result.run?.stdout || '',
    stderr:       result.run?.stderr || '',
    exitCode:     result.run?.code ?? -1,
    compileError: result.compile?.stderr || '',
    timedOut:     result.run?.code === 1 && result.run.stderr?.includes('TLE'),
    success:      result.run?.code === 0 && !result.compile?.stderr
  };
};

const buildTestHarness = (code, language, testCase, challengeTitle) => {
  // For JavaScript: wrap in IIFE, call the main function with test input
  if (language === 'javascript') {
    return `
${code}

// Test harness
const input = ${JSON.stringify(testCase.input)};
try {
  // Normalize: find the main exported function by common naming conventions
  const fnName = Object.keys({ twoSum, longestSubstring, ...this }).find(k => typeof eval(k) === 'function');
  // Simple approach: just run the code with console.log at end
  process.stdout.write(String(result));
} catch(e) {
  process.stderr.write(e.message);
}
`;
  }
  // Add Python, Java harnesses similarly
  return code;
};

export const runTestCases = async (code, language, testCases) => {
  const results = [];
  
  for (const testCase of testCases) {
    const startTime = Date.now();
    const execResult = await executeCode(code, language, testCase.input);
    const executionTimeMs = Date.now() - startTime;
    
    const actualOutput = execResult.stdout.trim();
    const passed = actualOutput === testCase.expectedOutput.trim();
    
    results.push({
      testCaseId:      testCase.id,
      input:           testCase.input,
      expectedOutput:  testCase.expectedOutput,
      actualOutput,
      passed,
      executionTimeMs,
      error:           execResult.stderr || execResult.compileError || null,
      timedOut:        execResult.timedOut,
      points:          passed ? testCase.points : 0
    });
  }
  
  const totalPoints = results.reduce((sum, r) => sum + (r.passed ? r.points : 0), 0);
  const maxPoints   = testCases.reduce((sum, t) => sum + t.points, 0);
  
  return {
    testResults:    results,
    passedCount:    results.filter(r => r.passed).length,
    totalCount:     results.length,
    passRate:       results.filter(r => r.passed).length / results.length,
    scorePercent:   Math.round((totalPoints / maxPoints) * 100),
    allPassed:      results.every(r => r.passed),
    avgExecutionMs: results.reduce((sum, r) => sum + r.executionTimeMs, 0) / results.length
  };
};