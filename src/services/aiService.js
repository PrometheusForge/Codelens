export const CODING_SYSTEM_PROMPT = `You are an expert software engineer solving coding challenges.

When given a coding challenge, respond EXACTLY in this format with no deviations:

## Solution
\`\`\`[language]
// Your complete, working solution here
\`\`\`

## Approach
[2-3 sentences explaining your strategy and why you chose it]

## Complexity
- Time: O(...) — [one-sentence explanation]
- Space: O(...) — [one-sentence explanation]

## Edge Cases Handled
- [list each edge case you explicitly handled]

## Notes
[Any trade-offs, alternative approaches, or important observations — omit if none]

Rules:
- The code block MUST be complete and runnable as-is
- NEVER use code from external libraries unless the problem explicitly requires it
- If the problem has no optimal solution, explain the best you can achieve and why`;

// ----- GROQ (Llama 3, Mixtral) -----
export const queryGroq = async (prompt, modelId = 'llama-3.3-70b-versatile') => {
  const startTime = Date.now();
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: CODING_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2048,
      temperature: 0.1
    })
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Groq API error: ${JSON.stringify(err.error)}`);
  }
  
  const data = await response.json();
  return {
    provider: 'Groq',
    model: modelId,
    content: data.choices[0].message.content,
    responseTimeMs: Date.now() - startTime,
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
  };
};

// ----- GOOGLE GEMINI -----
export const queryGemini = async (prompt, modelId = 'gemini-2.5-flash') => {
  const startTime = Date.now();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: CODING_SYSTEM_PROMPT + '\n\nChallenge:\n' + prompt }] }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
          stopSequences: []
        }
      })
    }
  );
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Gemini API error: ${JSON.stringify(err)}`);
  }
  
  const data = await response.json();
  return {
    provider: 'Google',
    model: modelId,
    content: data.candidates[0].content.parts[0].text,
    responseTimeMs: Date.now() - startTime,
    inputTokens: data.usageMetadata?.promptTokenCount || 0,
    outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
  };
};

// ----- HUGGING FACE -----
export const queryHuggingFace = async (prompt, modelId = 'codellama/CodeLlama-7b-hf') => {
  const startTime = Date.now();
  const fullPrompt = `${CODING_SYSTEM_PROMPT}\n\nChallenge:\n${prompt}`;

  const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: 2048,
        temperature: 0.1,
        return_full_text: false
      }
    })
  });
  
  if (!response.ok) throw new Error(`Hugging Face API error: ${response.status}`);
  
  const data = await response.json();
  const content = Array.isArray(data) ? data[0].generated_text : data.generated_text;

  return {
    provider: 'Hugging Face',
    model: modelId,
    content: content ? content.trim() : "No code generated.",
    responseTimeMs: Date.now() - startTime,
    inputTokens: 0,
    outputTokens: 0,
  };
};

// ----- COHERE -----
export const queryCohere = async (prompt, modelId = 'command-r-08-2024') => {
  const startTime = Date.now();
  const response = await fetch('https://api.cohere.com/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({
      model: modelId,
      message: `${CODING_SYSTEM_PROMPT}\n\nChallenge:\n${prompt}`,
      temperature: 0.1
    })
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Cohere API error: ${JSON.stringify(err)}`);
  }
  
  const data = await response.json();
  return {
    provider: 'Cohere',
    model: modelId,
    content: data.text,
    responseTimeMs: Date.now() - startTime,
    inputTokens: data.meta?.billed_units?.input_tokens || 0,
    outputTokens: data.meta?.billed_units?.output_tokens || 0,
  };
};

// ----- DEEPSEEK OFFICIAL -----
export const queryDeepSeek = async (prompt, modelId = 'deepseek-v4-flash') => {
  const startTime = Date.now();
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: CODING_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      thinking: { type: "enabled" },
      temperature: 0.1
    })
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`DeepSeek API error: ${JSON.stringify(err)}`);
  }
  
  const data = await response.json();
  return {
    provider: 'DeepSeek',
    model: modelId,
    content: data.choices[0].message.content,
    responseTimeMs: Date.now() - startTime,
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
  };
};

// ----- MISTRAL OFFICIAL -----
export const queryMistral = async (prompt, modelId = 'open-mistral-nemo') => {
  const startTime = Date.now();
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: "You are an expert software engineer. Provide clean, efficient code." },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1
    })
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Mistral API error: ${JSON.stringify(err)}`);
  }
  
  const data = await response.json();
  return {
    provider: 'Mistral',
    model: modelId,
    content: data.choices[0].message.content,
    responseTimeMs: Date.now() - startTime,
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
    success: true
  };
};


// REGISTRY WITH ACTIVE GROQ MODELS
export const MODEL_REGISTRY = [
  { 
    id: 'llama-3-70b',      
    label: 'Llama 3 70B',      
    provider: 'Groq',       
    fn: (p) => queryGroq(p, 'llama-3.3-70b-versatile'), 
    color: '#4f46e5' 
  },
  { 
    id: 'gemini-2.5-flash',     
    label: 'Gemini 2.5 Flash', 
    provider: 'Google',     
    fn: (p) => queryGemini(p),                  
    color: '#4796E3' 
  },
  { 
    id: 'gemini-2.5-pro',     
    label: 'Gemini 2.5 Pro', 
    provider: 'Google',     
    fn: (p) => queryGemini(p, 'gemini-2.5-pro'),                  
    color: '#15803d'
  },
  { 
    id: 'command-r-08-2024',
    label: 'Cohere Command R',  
    provider: 'Cohere', 
    fn: (p) => queryCohere(p, 'command-r-08-2024'), 
    color: '#f43f5e' 
  },
  { 
    id: 'open-mistral-nemo',      
    label: 'Mistral Nemo',      
    provider: 'Mistral',       
    fn: (p) => queryMistral(p, 'open-mistral-nemo'), 
    color: '#3ce9c2' 
  },
];

export const queryAllModels = async (formattedPrompt, selectedModelIds) => {
  const selectedModels = MODEL_REGISTRY.filter(m => selectedModelIds.includes(m.id));
  
  const results = await Promise.allSettled(
    selectedModels.map(model =>
      model.fn(formattedPrompt).then(result => ({ ...result, modelId: model.id }))
    )
  );
  
  return results.map((result, index) => {
    const model = selectedModels[index];
    if (result.status === 'fulfilled') {
      return { ...result.value, modelId: model.id, success: true };
    } else {
      return { 
        modelId: model.id, 
        model: model.label, 
        provider: model.provider,
        error: result.reason?.message || 'Unknown error', 
        success: false 
      };
    }
  });
};

export const formatChallengePrompt = (challenge) => {
  return `# ${challenge.title}
**Difficulty:** ${challenge.difficulty} | **Category:** ${challenge.category}

## Problem Statement
${challenge.prompt}

## Examples
${challenge.examples.map(e => `- Input: \`${e.input}\` → Output: \`${e.output}\`${e.explanation ? ` (${e.explanation})` : ''}`).join('\n')}

## Constraints
${challenge.constraints.map(c => `- ${c}`).join('\n')}

**Write your solution in ${challenge.language}.**`;
};

// ----- THE ENTERPRISE SIMULATED SANDBOX JUDGE (AEGIS V2) -----
export const evaluateCodeSubmission = async (challengePrompt, submittedCode, modelId = 'qwen-3-32b') => {
  const systemPrompt = `You are **Aegis**, a strict, deterministic code execution sandbox and Principal Staff Software Engineer.  
    You **never** run real code, but you mentally compile, simulate, and rigorously evaluate any submitted code against a given coding challenge.  
    You **cannot** guess, hallucinate execution traces, or produce conversational output.  

    Your sole output is a **single, raw JSON object** following the exact schema below.  

    ---

    ## ⚠️ STRICT OUTPUT RULES (will be enforced)

    - **First character of your response MUST be \`{\`**  
    - **No markdown** — no \`\`\`json, no backticks, no explanatory text.  
    - **No reasoning traces** — perform all passes silently.  
    - **No extra fields** — follow the schema exactly.  
    - **Violation** → the calling system will reject your response as invalid.

    ---

    ## 🧠 Multi‑Pass Mental Evaluation (execute in order, never output)

    ### PASS 1 – Compilation & Static Analysis
    - Check syntax, imports, undefined variables, type mismatches.  
    - If **any compile error exists** → \`correctness = 0\`, \`passedCount = 0\`, \`score ≤ 15\`.

    ### PASS 2 – Simulated Test Execution (4 predefined cases)
    Mentally execute the code against **exactly these 4 test cases** (do not substitute):

    | # | Test Case Name | Input example (if applicable) | Expected behavior |
    |---|----------------|-------------------------------|--------------------|
    | 1 | **Baseline**   | Normal valid input (provided in challenge) | Correct output |
    | 2 | **Null/Empty** | \`null\`, \`[]\`, \`""\`, \`0\` as appropriate | Graceful handling, no crash |
    | 3 | **Performance** | Max constraints (e.g., 10^5 array length) | Completes in reasonable time (O(n) or O(n log n)) |
    | 4 | **Malformed**   | Wrong type (e.g., string instead of number) | Throws or returns error; does not corrupt state |

    Record how many pass (\`passedCount\`).  
    If code cannot be mentally executed (e.g., external API calls, random, I/O) → \`passedCount = 0\` and \`security ≤ 20\`.

    ### PASS 3 – Complexity & Readability
    - **Time & space complexity (Big O)** – compare to optimal for this problem.  
      - If code is O(n²) but O(n) exists → \`efficiency ≤ 50\`.  
    - **Readability** – naming, modularity, DRY, indentation.  
      - No comments/docstrings → \`explanation ≤ 30\`.  
    - **Memory** – unnecessary copies or leaks (mental model) penalize efficiency.

    ### PASS 4 – Security & Robustness
    - Input validation, type checking, boundary guards, exception handling.  
    - **No validation** → \`security ≤ 40\`.  
    - Unsafe \`eval()\`, \`exec()\`, or injection patterns → \`security = 0\`.

    ---

    ## 📐 Scoring Schema (output exactly this JSON)

    {
      "score": <Integer 0-100>,
      "feedback": "<String: one highly technical sentence, no period at end>",
      "metrics": {
        "correctness": <Integer 0-100>,
        "efficiency": <Integer 0-100>,
        "readability": <Integer 0-100>,
        "security": <Integer 0-100>,
        "explanation": <Integer 0-100>
      },
      "simulatedExecution": {
        "passedCount": <Integer 0-4>,
        "totalCount": 4,
        "estimatedTimeMs": <Integer: 1–500, realistic for standard input>
      }
    }

    ### Weighted score formula (apply internally):
    \`score = (correctness * 0.6) + (efficiency * 0.2) + (readability * 0.05) + (security * 0.1) + (explanation * 0.05)\`

    - **If \`correctness == 0\` → \`score = min(score, 15)\`** (massive penalty for broken code).  
    - All metrics **must be 0–100 integers**.

    ---

    ## ✅ Example of correct output (for a perfect solution)

    {"score": 96, "feedback": "O(n) time, O(1) space, clean validation, all 4 tests pass", "metrics": {"correctness": 100, "efficiency": 95, "readability": 92, "security": 100, "explanation": 80}, "simulatedExecution": {"passedCount": 4, "totalCount": 4, "estimatedTimeMs": 12}}

    ## ❌ Example of WRONG output (do NOT do this)

    \`\`\`json
    {
      "score": 85
    }
    \`\`\`

    ---

    ## 🔁 Final self‑check before output

    - Is the first character \`{\` ?  
    - Are there any backticks or markdown? → if yes, restart.  
    - Is \`passedCount\` ≤ \`totalCount\`?  
    - Are all metrics between 0 and 100?  
    - Is \`estimatedTimeMs\` ≥ 1 and ≤ 500?  

    If any check fails, **correct silently** before outputting.
  `;

  const userPrompt = `--- CHALLENGE PROMPT ---
${challengePrompt}

--- SUBMITTED CODE ---
${submittedCode}

Execute the multi-pass evaluation and return the JSON payload.`;

  try {
    const groqModelMap = {
      'llama-3-70b': 'llama-3.3-70b-versatile',
      'gemma-2-9b': 'llama-3.1-8b-instant',
      'qwen-3-32b': 'qwen/qwen3-32b' 
    };
    
    const targetModel = groqModelMap[modelId] || 'llama-3.3-70b-versatile';

    const requestBody = {
      model: targetModel,
      response_format: { type: "json_object" }, 
      messages: [
        { 
          role: 'system', 
          // Force the word JSON into the system prompt (required by Groq)
          content: systemPrompt + '\n\nYou must respond in pure JSON format.' 
        },
        { 
          role: 'user', 
          content: userPrompt + '\n\nCRITICAL SYSTEM INSTRUCTION: Output ONLY a raw, valid JSON object. Do NOT wrap your response in ```json markdown blocks. Do not include conversational text. Start your response immediately with the { character.' 
        }
      ],
      temperature: 0.1,
      max_tokens: 1200 // Bumped up slightly from 800 so long feedback doesn't get cut off and break the JSON format
    };

    if (targetModel.includes('qwen')) {
      requestBody.reasoning_format = 'hidden';
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Groq Judge failed: ${JSON.stringify(err.error)}`);
    }
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
    
  } catch (error) {
    console.error("Judge routing error:", error);
    // Bulletproof fallback so the UI never crashes if the API throttles
    return { 
      score: 0, 
      feedback: `API Error: ${error.message}. Please retry evaluation.`,
      metrics: { correctness: 0, efficiency: 0, readability: 0, security: 0, explanation: 0 },
      simulatedExecution: { passedCount: 0, totalCount: 4, estimatedTimeMs: 0 }
    };
  }
};