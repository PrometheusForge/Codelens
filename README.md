# 🔎 Codelens: AI Model Evaluation & Benchmarking Matrix

### Live Page: https://codelens-pink.vercel.app/

![Status](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=flat&logo=supabase&logoColor=3ECF8E)

Built as a response to the AI annotation job market — instead of rating model outputs inside someone else's closed platform, I built my own. CodeLens runs coding challenges against multiple AI models, routes the outputs to a separate judge LLM for blind scoring, and tracks every result in Supabase. The dashboard visualizes real evaluation data, not placeholder numbers.

## What It Does

* **Challenge library:** Evaluate models without copy-pasting. Clicking any challenge in the library opens the evaluation page with the prompt pre-loaded. One click to start a run.
* **Arena mode:** Pick a challenge, select multiple models, and run them in parallel. Results come back side-by-side using the same challenge and same rubric for direct, comparable scores.
* **LLM-as-judge:** The model solving the challenge is not the model scoring it. A separate judge receives the output cold—with no system context about which model produced it—and grades it across four dimensions. This prevents models from inflating their own correctness scores.
* **Live Supabase Dashboard:** Every evaluation writes to a Postgres database. The five dashboard components (stats row, leaderboard, radar chart, heatmap, and trend line) all pull live from these records. No mock data.

## Tech Stack

| Layer | Tool / Framework |
| :--- | :--- |
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS |
| **Charts** | Recharts |
| **Database** | Supabase (Postgres) |
| **Solver LLM** | Claude 3.5 Sonnet (Anthropic) |
| **Judge LLM** | Qwen-3-32B (Separate provider) |

## Dashboard

All five components read live from Supabase evaluation records:

* **Stats row:** Headline numbers across all sessions (total evaluations, models evaluated, challenges covered, overall average weighted score).
* **Model leaderboard:** Ranked table of every evaluated model. Includes rank, name, average total score, per-dimension averages, and session count. Sortable by any column.
* **Radar chart:** Visualizes a model's performance profile across the four scoring dimensions to easily identify weaknesses (e.g., correctness vs. explanation quality).
* **Heatmap:** A challenge-by-model grid displaying the weighted score. Color-coded: green (80+), amber (60–79), red (<60), and grey (no data). Highlights which challenge categories a model struggles with most.
* **Trend line:** Average score per model over time, binned by session date, to track if a model is improving or degrading over multiple runs.

## Scoring Rubric

All four dimensions are scored by Qwen-3-32B on a 0–100 scale. The judge prompt includes the challenge spec, constraints, and full solver output, but excludes the model name and provider. 

The weighted total is computed as follows:

| Dimension | Weight | What the judge looks for |
| :--- | :--- | :--- |
| **Correctness** | 35% | Does the solution handle all inputs and edge cases? |
| **Efficiency** | 25% | Is the time/space complexity optimal for this problem class? |
| **Readability** | 20% | Is the code clean, well-named, and idiomatic? |
| **Explanation** | 20% | Does the model explain approach, complexity, and trade-offs clearly? |

## Challenge Library

The app includes 50+ challenges across 6 categories. Each challenge has a difficulty label (easy/medium/hard/expert), optimal time/space complexity, and tags.

###Why this project

A DataAnnotation job posting for frontend engineers described the work as: send coding challenges to AI models, evaluate the outputs, $40–75/hr. The problem is you're building someone else's training dataset with no artifact to show for it.

This is the version where the evaluation infrastructure is yours, the data is yours, and the findings are publishable. The scoring methodology, the LLM-as-judge approach, and the arena comparison model are all things I'd want to talk through in an interview, not just list on a resume.


## 🚀 Quick Start Guide
### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* `npm`

### Installation & Local Setup

1. **Clone the repository:**
```bash
   git clone [https://github.com/prometheusforge/Codelens.git](https://github.com/prometheusforge/Codelens.git)
   cd Codelens
