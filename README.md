# 🏥 Web4 Clinic: Full-Stack Decentralized AI Medical Dashboard

A futuristic, full-stack digital clinic workspace optimized for **Apple Silicon (M2 Unified Memory Architecture)**. 

The frontend leverages **Next.js (App Router) + TailwindCSS + Framer Motion** to deliver a high-fidelity, cyberpunk-inspired health dashboard. The backend utilizes a **distributed FastAPI gateway** to orchestrate multimodal visual reasoning (**Qwen2.5-VL**) and clinical RAG pipelines (**Gemma 3 + LlamaIndex**).

---

## ⚡️ Core Clinical Matrix (10 Autonomous Modules)

The frontend features a fluid, responsive grid that routes into 10 highly specialized clinical environments:

* **Mod // 01 RAG Medical Consultation**: Continuous 24/7 clinical Q&A leveraging Gemma 3 and LlamaIndex with incremental vector embeddings from local medical PDFs.
* **Mod // 02 Dietary Calorie Recognition**: Real-time molecular-level nutritional breakdown and calorie calculation using Qwen2.5-VL vision streams.
* **Mod // 03 AI Dermatology Lab**: Deep facial imaging and surface scans providing structured dermis reports and personalized skincare regimens.
* **Mod // 04 Orthodontic Multimodal Analysis**: Intelligent classification of malocclusions and precise cephalometric tracing (SNA/SNB skeletal landmark calculations) via lateral radiographs.
* **Mod // 05 AI Radiology Diagnostic**: Advanced multimodal visual analysis of CT, MRI, and X-ray scans with autonomous anomaly mapping.
* **Mod // 06 Intelligent Pathology Review**: High-resolution processing of H&E stained tissue sections or aspiration cytology for automated grading.
* **Mod // 07 Men's Health Clinic**: A highly confidential portal tracking androgen levels, prostate health screening, and customized lifestyle adjustments.
* **Mod // 08 Gynecology & Cycles Guardian**: Endocrine tracking, ovarian health assessments, and gentle holistic cycle-care recommendations.
* **Mod // 09 TCM AI Syndrome Differentiation**: Traditional Chinese Medicine diagnostics via vision-based tongue/complexion analysis coupled with classic interactive inquiries.
* **Mod // 10 Behavior & Mental Intervention**: Real-time behavioral modification, psychological counseling, and tokenomic incentives via the **$HC (Health Coin)** utility token.

---

## 🛠️ Apple Silicon Hardware Optimization

Running local 7B visual models along with embeddings on a **MacBook Pro M2 (16GB)** can easily trigger thermal throttling or OOM (Out Of Memory) crashes. This codebase implements three core guardrails to keep your hardware running cool and silent:

1.  **Global Sequential Vision Lock (`asyncio.Lock()`)**: Multi-modal visual inferences are strictly queued to prevent concurrent image processing from overloading the unified memory.
2.  **Ultra-Aggressive Memory Offloading (`keep_alive: "1m"`)**: Ollama models are automatically pruned from the GPU/VRAM after 1 minute of inactivity, dropping idle power usage to zero.
3.  **Incremental Ingestion & Token Capping**: Implements LlamaIndex `IngestionPipeline` paired with a strict `SentenceSplitter(chunk_size=512)` to eliminate context window clipping (400 errors) and prevent redundant database recalculations.

---

## 🚀 Getting Started

### 1. Prerequisites (Local Model Orchestration via Ollama)
Ensure you have [Ollama](https://ollama.com) installed and the required models pulled locally:
```bash
ollama run qwen2.5-vl:7b
ollama run gemma3:latest
ollama run nomic-embed-text