const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_CONFIG = {
  javascript: { language: 'javascript', version: '18.15.0', extension: 'js' },
  python:     { language: 'python',     version: '3.10.0', extension: 'py' }
};

export const executeCode = async (code, language = 'javascript') => {
  const config = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.javascript;
  
  const response = await fetch(PISTON_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: config.language,
      version: config.version,
      files: [{ name: `main.${config.extension}`, content: code }],
      stdin: "",
      args: [],
      compile_timeout: 10000,
      run_timeout: 3000,
      run_memory_limit: 128000000
    })
  });
  
  if (!response.ok) throw new Error(`Piston API error: ${response.status}`);
  
  const result = await response.json();
  
  return {
    stdout:       result.run?.stdout || '',
    stderr:       result.run?.stderr || '',
    exitCode:     result.run?.code ?? -1,
    compileError: result.compile?.stderr || '',
    timedOut:     result.run?.signal === 'SIGKILL',
    success:      result.run?.code === 0 && !result.compile?.stderr
  };
};

const buildTestHarness = (code, language, testCase) => {
  const formattedInput = testCase.input.replace(/\n/g, ', ');
  if (language === 'javascript') {
    return `
${code}

// --- AUTOMATED EVALUATION HARNESS ---
try {
  // Regex to dynamically find the name of the function the AI generated
  const codeStr = \`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
  const match = codeStr.match(/(?:function\\s+([a-zA-Z0-9_]+))|(?:(?:const|let|var)\\s+([a-zA-Z0-9_]+)\\s*=\\s*(?:async\\s*)?(?:function|\\([^)]*\\)\\s*=>|[a-zA-Z0-9_]+\\s*=>))/);
  
  if (match && (match[1] || match[2])) {
    const fnName = match[1] || match[2];
    
    // Execute the AI's function with our test case inputs
    const result = eval(fnName + '(' + ${JSON.stringify(formattedInput)} + ')');
    
    // Format the output specifically for strict comparison
    if (Array.isArray(result)) {
       console.log(result.join(' ')); // e.g., transforms [0,1] into "0 1"
    } else {
       console.log(result);
    }
  } else {
    console.error("EVAL_ERROR: Could not locate a valid function declaration.");
  }
} catch(e) {
  console.error(e.message);
}
`;
  }

  if (language === 'python') {
    return `
${code}

# --- AUTOMATED EVALUATION HARNESS ---
import inspect
import sys

try:
    # Dynamically find the first function defined in the AI's script
    funcs = [f for f in globals().values() if inspect.isfunction(f)]
    if len(funcs) > 0:
        target_fn = funcs[0]
        
        # Parse the string arguments into actual Python tuples/lists
        args = eval(f"({${JSON.stringify(formattedInput)}})")
        if not isinstance(args, tuple):
            args = (args,)
        
        # Execute the AI's function
        result = target_fn(*args)
        
        if isinstance(result, list):
            print(" ".join(map(str, result)))
        else:
            print(result)
    else:
        print("EVAL_ERROR: No function found.", file=sys.stderr)
except Exception as e:
    print(f"{str(e)}", file=sys.stderr)
`;
  }

  return code; 
};

export const runTestCases = async (code, language, testCases) => {
  const results = [];
  
  for (const testCase of testCases) {
    const startTime = Date.now();
    
    const harnessedCode = buildTestHarness(code, language, testCase);
    
    const execResult = await executeCode(harnessedCode, language);
    const executionTimeMs = Date.now() - startTime;
    
    const actualOutput = execResult.stdout.trim();
    const expectedOutput = String(testCase.expectedOutput).trim();
    
    const passed = execResult.success && actualOutput === expectedOutput;
    
    results.push({
      testCaseId:      testCase.id || Date.now(),
      input:           testCase.input,
      expectedOutput:  expectedOutput,
      actualOutput:    actualOutput,
      passed:          passed,
      executionTimeMs: executionTimeMs,
      error:           execResult.stderr || execResult.compileError || null,
      timedOut:        execResult.timedOut,
      points:          passed ? (testCase.points || 10) : 0
    });
  }
  
  const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
  const maxPoints   = testCases.reduce((sum, t) => sum + (t.points || 10), 0);
  const passedCount = results.filter(r => r.passed).length;
  
  return {
    testResults:    results,
    passedCount:    passedCount,
    totalCount:     results.length,
    scorePercent:   maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0,
    allPassed:      passedCount === results.length,
    avgExecutionMs: results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.executionTimeMs, 0) / results.length) : 0
  };
};