# 🔎 Codelens: AI Model Evaluation & Benchmarking Matrix

![Status](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=flat&logo=supabase&logoColor=3ECF8E)

## 🎯 The Problem
As Large Language Models proliferate, organizations lack standardized, internal tooling to empirically measure model correctness and efficiency for specific coding challenges. Relying on subjective testing leads to inconsistent deployments.

## 💡 The Solution: Codelens
Codelens is a high-performance, React-based dashboard engineered to administer automated coding challenges to leading LLMs (Llama 3, Cohere, etc.) and rigorously track their outputs. It provides an empirical, data-driven arena for comparing AI performance over longitudinal timeframes. 

---

## 🏗️ System Architecture & Technical Highlights

This project demonstrates proficiency in modern full-stack development, API integration, and automated deployments:

* **State Management & Routing:** Utilizes React 18 hooks and `react-router-dom` (configured with `HashRouter` fallbacks) for seamless, client-side Single Page Application (SPA) navigation.
* **Data Visualization:** Aggregates timestamped Supabase data into calculated time buckets (2H, 4H, Daily) to render dynamic trajectory charts using **Recharts**.
* **Asynchronous API Integration:** Robust handling of multiple AI API endpoints to evaluate code snippets, complete with error handling and loading states.
* **CI/CD Pipeline:** Configured GitHub Actions workflows for automated dependency installation, strict ESLint validation, environment variable injection, and continuous deployment to GitHub Pages.

---

## 🚧 Challenges Solved

Building this platform required navigating complex technical hurdles with extreme dedication and focus:
1. **CI/CD Build Failures:** Overcame pipeline blockers by meticulously debugging strict ESLint configurations and resolving unused variable dependency loops to achieve a 100% clean automated build process.
2. **Static Hosting Routing:** Engineered a `404.html` fallback system within the GitHub Actions workflow to allow clean URLs on a static file server without breaking direct page reloads.
3. **API Data Normalization:** Standardized varying JSON response structures from different AI model providers into a single, unified database schema in Supabase for consistent frontend rendering.

---

## 🚀 Quick Start Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* `npm`

### Installation & Local Setup

1. **Clone the repository:**
```bash
   git clone [https://github.com/prometheusforge/Codelens.git](https://github.com/prometheusforge/Codelens.git)
   cd Codelens