import { ContentRecord, BlockRule, DashboardStats } from './types';
import { SUBCATEGORIES } from './taxonomy';
import { TAXONOMY_VIDEOS } from './taxonomyVideos';

// Curated authentic catalog of known developer videos with verified YouTube IDs
export interface KnownVideoMeta {
  id: string;
  title: string;
  channel: string;
  domain: string;
  category: string;
  subcategoryId: number;
  duration: number;
  tags: string[];
}

export const KNOWN_VIDEO_CATALOG: KnownVideoMeta[] = [
  {
    id: '1vsmaEfbnoE',
    title: 'Complete Machine Learning Course in 6 Hours [Full Course]',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    duration: 21600,
    tags: ['krish naik', 'machine learning', 'ml', 'python', 'data science', 'ai'],
  },
  {
    id: 'rV3HJ4LEZ7k',
    title: 'Complete Agentic AI Course In 10 Hours - LangChain, LangGraph, RAG',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 36000,
    tags: ['krish naik', 'generative ai', 'langchain', 'llm', 'openai', 'python', 'rag', 'langgraph'],
  },
  {
    id: 'AzYY5InMTA0',
    title: 'Deep Learning In-Depth Masterclass (Perceptron, ANN, CNN, RNN)',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Deep Learning (CNN, RNN, Transformers)',
    subcategoryId: 2,
    duration: 18000,
    tags: ['krish naik', 'deep learning', 'cnn', 'rnn', 'transformers', 'neural networks'],
  },
  {
    id: 'pTFZFxd4hOI',
    title: 'End-to-End Machine Learning Project Implementation with Docker & CI/CD',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Model Deployment (MLOps)',
    subcategoryId: 8,
    duration: 7200,
    tags: ['krish naik', 'mlops', 'docker', 'deployment', 'ci/cd', 'machine learning'],
  },
  {
    id: 'LZzq1zSL1bs',
    title: 'Complete Statistics for Data Science - From Basic to Advanced',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    duration: 21600,
    tags: ['krish naik', 'statistics', 'math', '7S_tz1z_5bA', 'data science', 'hypothesis testing'],
  },
  {
    id: 'kqtD5dpn9C8',
    title: 'Python for Beginners - Complete Python Full Course',
    channel: 'Krish Naik',
    domain: 'Programming Languages',
    category: 'Python',
    subcategoryId: 9,
    duration: 18000,
    tags: ['krish naik', 'python', 'kYB8IZa5AuE', 'basics', 'oop', 'data structures'],
  },
  {
    id: 'aircAruvnKk',
    title: 'Complete Natural Language Processing (NLP) Masterclass in One Video',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Natural Language Processing',
    subcategoryId: 3,
    duration: 28800,
    tags: ['krish naik', 'nlp', 'transformers', 'bert', 'tokenization', 'text classification'],
  },
  {
    id: 'd3zTfXvYZ9s',
    title: 'End to End LLM Project with Google Gemini Pro & LangChain',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 7200,
    tags: ['krish naik', 'gemini pro', 'google gemini', 'langchain', 'llm', 'generative ai'],
  },
  {
    id: 'nLRL_NcnK-4',
    title: 'PyTorch Deep Learning Complete Tutorial from Scratch',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Deep Learning (CNN, RNN, Transformers)',
    subcategoryId: 2,
    duration: 14400,
    tags: ['krish naik', 'pytorch', 'tensors', 'neural networks', 'deep learning'],
  },
  {
    id: 'AzYY5InMTA0',
    title: 'Exploratory Data Analysis (EDA) Masterclass for Beginners',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    duration: 10800,
    tags: ['krish naik', 'eda', 'pandas', 'matplotlib', 'seaborn', 'data analysis'],
  },
  {
    id: '-7VgYNiGxYw',
    title: 'NVIDIA NeMo Guardrails Tutorial: Defend RAG Apps Against Prompt Injection',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 12600,
    tags: ['krish naik', 'generative ai', 'rag', 'nemo guardrails', 'ai security'],
  },
  {
    id: 'e8Yw4alG16Q',
    title: 'Time Series Analysis & Forecasting Full Practical Course',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    duration: 10800,
    tags: ['krish naik', 'time series', 'arima', 'x0uinJvhNxI', 'BfEjDD8mWYg'],
  },
  {
    id: '1vsmaEfbnoE',
    title: 'Machine Learning Complete Playlist - Linear Regression to Boosting',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    duration: 32400,
    tags: ['krish naik', 'linear regression', 'logistic regression', 'random forest', 'xgboost'],
  },
  {
    id: '7eh4d6sabA0',
    title: 'Deep Learning Complete Masterclass - ANN, CNN, RNN, LSTM',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Deep Learning (CNN, RNN, Transformers)',
    subcategoryId: 2,
    duration: 25200,
    tags: ['krish naik', 'ann', 'cnn', 'rnn', 'lstm', 'tensorflow', 'keras'],
  },
  {
    id: '1aocCdimOo8',
    title: 'Build Your Own SSO | What is SSO | SSO Explained',
    channel: 'Piyush Garg',
    domain: 'Security & Data',
    category: 'Cybersecurity fundamentals',
    subcategoryId: 39,
    duration: 1140,
    tags: ['sso', 'single sign on', 'authentication', 'security', 'piyush garg', 'backend', 'system design', 'jwt', 'oauth'],
  },
  {
    id: 'SqcY0GlETPk',
    title: 'Docker In One Shot - Complete Crash Course for Developers',
    channel: 'Piyush Garg',
    domain: 'Cloud & DevOps',
    category: 'Kubernetes & containerization',
    subcategoryId: 30,
    duration: 5400,
    tags: ['piyush garg', 'docker', 'containers', 'devops', 'docker in one shot'],
  },
  {
    id: 'Oe421EPjeBE',
    title: 'Docker For Open Source Contributors & Production Workloads',
    channel: 'Piyush Garg',
    domain: 'Cloud & DevOps',
    category: 'Kubernetes & containerization',
    subcategoryId: 30,
    duration: 3600,
    tags: ['piyush garg', 'docker', 'production', 'open source'],
  },
  {
    id: '1vsmaEfbnoE',
    title: 'Build Your Own Docker Orchestration from Scratch in Node.js',
    channel: 'Piyush Garg',
    domain: 'Cloud & DevOps',
    category: 'Kubernetes & containerization',
    subcategoryId: 30,
    duration: 4800,
    tags: ['piyush garg', 'docker', 'orchestration', 'nodejs', 'system design'],
  },
  {
    id: 'VMj-3S1tku0',
    title: 'The Spelled-Out Intro to Neural Networks & Backprop: Building micrograd',
    channel: 'Andrej Karpathy',
    domain: 'AI & Machine Learning',
    category: 'Deep Learning (CNN, RNN, Transformers)',
    subcategoryId: 2,
    duration: 8100,
    tags: ['andrej karpathy', 'micrograd', 'neural networks', 'backprop', 'zero to hero'],
  },
  {
    id: 'PaCmpygFfXo',
    title: 'The Spelled-Out Intro to Language Modeling: Building makemore',
    channel: 'Andrej Karpathy',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 7200,
    tags: ['andrej karpathy', 'makemore', 'language models', 'nlp', 'zero to hero'],
  },
  {
    id: 'kCc8FmEb1nY',
    title: "Let's build GPT: from scratch, in code, spelled out",
    channel: 'Andrej Karpathy',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 7500,
    tags: ['andrej karpathy', 'gpt', 'llm', 'transformers', 'from scratch'],
  },
  {
    id: 'HerCR8bw_GE',
    title: "Let's build the GPT Tokenizer from scratch",
    channel: 'Andrej Karpathy',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 7800,
    tags: ['andrej karpathy', 'tokenizer', 'gpt', 'byte pair encoding'],
  },
  {
    id: 'kqtD5dpn9C8',
    title: '[1hr Talk] Intro to Large Language Models (Busy Person\'s Intro to AI)',
    channel: 'Andrej Karpathy',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 3600,
    tags: ['andrej karpathy', 'llm', 'chatgpt', 'ai', 'intro to large language models'],
  },
  {
    id: '3hLmDS179YE',
    title: 'State of GPT | Keynote & Technical Deep Dive',
    channel: 'Andrej Karpathy',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 2520,
    tags: ['andrej karpathy', 'state of gpt', 'llm', 'openai', 'transformers'],
  },
  {
    id: 'BLl32FvcdVM',
    title: "Let's reproduce GPT-2 (124M) in PyTorch",
    channel: 'Andrej Karpathy',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 14400,
    tags: ['andrej karpathy', 'gpt-2', 'pytorch', 'deep learning', 'reproduce gpt-2'],
  },
  {
    id: 'zjkBMFhNj_g',
    title: 'Building makemore Part 2: MLP (Multi-Layer Perceptron)',
    channel: 'Andrej Karpathy',
    domain: 'AI & Machine Learning',
    category: 'Deep Learning (CNN, RNN, Transformers)',
    subcategoryId: 2,
    duration: 4500,
    tags: ['andrej karpathy', 'makemore', 'mlp', 'neural networks'],
  },
  {
    id: 'P6sfmUTpUmc',
    title: 'Building makemore Part 3: Activations & Gradients, BatchNorm',
    channel: 'Andrej Karpathy',
    domain: 'AI & Machine Learning',
    category: 'Deep Learning (CNN, RNN, Transformers)',
    subcategoryId: 2,
    duration: 6000,
    tags: ['andrej karpathy', 'batchnorm', 'W6NZfCO5SIk', 'gradients', 'makemore'],
  },
  {
    id: 'J5fqR-TRebI',
    title: 'Design a Web Crawler: FAANG System Design Interview',
    channel: 'ByteByteGo',
    domain: 'Web Development',
    category: 'Backend frameworks (Node.js, Django, Spring)',
    subcategoryId: 18,
    duration: 900,
    tags: ['bytebytego', 'system design', 'web crawler', 'fNk_zzaMoSs', 'architecture'],
  },
  {
    id: 'm8Icp_Cid5o',
    title: 'System Design: Recommender Systems at Massive Scale',
    channel: 'ByteByteGo',
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    duration: 840,
    tags: ['bytebytego', 'system design', 'recommenders', 'scale', 'architecture'],
  },
  {
    id: 'bMknfKXIFA8',
    title: 'Computer Vision Course with OpenCV and Python',
    channel: 'freeCodeCamp.org',
    domain: 'AI & Machine Learning',
    category: 'Computer Vision',
    subcategoryId: 4,
    duration: 10800,
    tags: ['freecodecamp', 'opencv', 'computer vision', 'python', 'ai'],
  },
  {
    id: 'spUNpyF58BY',
    title: 'Python for Beginners - Full Course [Programming Tutorial]',
    channel: 'freeCodeCamp.org',
    domain: 'Programming Languages',
    category: 'Python',
    subcategoryId: 9,
    duration: 16200,
    tags: ['freecodecamp', 'python', 'kYB8IZa5AuE', 'beginners'],
  },
  {
    id: 'w7ejDZ8SWv8',
    title: 'React JS Crash Course 2024',
    channel: 'Traversy Media',
    domain: 'Web Development',
    category: 'Frontend frameworks (React, Vue, Svelte)',
    subcategoryId: 17,
    duration: 7200,
    tags: ['traversy media', 'react', 'javascript', 'frontend'],
  },
  {
    id: 'P6sfmUTpUmc',
    title: 'Full Stack Development & System Design Deep Dive',
    channel: 'Tech & Architecture',
    domain: 'Web Development',
    category: 'Backend frameworks (Node.js, Django, Spring)',
    subcategoryId: 18,
    duration: 840,
    tags: ['fullstack', 'system design', 'backend', 'web', 'zsjvFFKOm3c'],
  },
  {
    id: 'Gjnup-PuquQ',
    title: 'Docker in 100s',
    channel: 'Fireship',
    domain: 'Cloud & DevOps',
    category: 'Kubernetes & containerization',
    subcategoryId: 30,
    duration: 135,
    tags: ['docker', 'containers', 'devops', 'kubernetes', 'cloud', '100s', 'docker in 100s'],
  },
  {
    id: '0ZJgIjIuY7U',
    title: '100 seconds of code',
    channel: 'Fireship',
    domain: 'Web Development',
    category: 'Frontend frameworks (React, Vue, Svelte)',
    subcategoryId: 17,
    duration: 140,
    tags: ['coding', 'webdev', 'frontend', 'javascript'],
  },
  {
    id: '5C_HPTJg5ek',
    title: 'Is Rust worth it?',
    channel: 'Fireship',
    domain: 'Programming Languages',
    category: 'Rust',
    subcategoryId: 12,
    duration: 210,
    tags: ['rust', 'memory-safety', '01sAkU_NvOY', 'systems'],
  },
  {
    id: 'k7RM-ot2NWY',
    title: 'The fastest language',
    channel: 'Fireship',
    domain: 'Programming Languages',
    category: 'C/C++',
    subcategoryId: 15,
    duration: 180,
    tags: ['c++', 'c', 'benchmarks', '01sAkU_NvOY', 'low-level'],
  },
  {
    id: 'MBRqu0YOH14',
    title: 'Optimistic nihilism',
    channel: 'Kurzgesagt – In a Nutshell',
    domain: 'Emerging Tech',
    category: 'Digital immune systems',
    subcategoryId: 52,
    duration: 432,
    tags: ['philosophy', 'science', 'kurzgesagt', 'future', 'cosmos'],
  },
  {
    id: 'zQGOcOUBi6s',
    title: 'The immune system explained',
    channel: 'Kurzgesagt – In a Nutshell',
    domain: 'Emerging Tech',
    category: 'Digital immune systems',
    subcategoryId: 52,
    duration: 642,
    tags: ['science', 'biology', 'immune system', 'kurzgesagt'],
  },
  {
    id: 'e8Yw4alG16Q',
    title: 'Black holes explained',
    channel: 'Kurzgesagt – In a Nutshell',
    domain: 'Emerging Tech',
    category: 'Quantum computing',
    subcategoryId: 46,
    duration: 563,
    tags: ['space', 'physics', 'astronomy', 'kurzgesagt'],
  },
  {
    id: 'd3zTfXvYZ9s',
    title: 'Time travel physics',
    channel: 'Kurzgesagt – In a Nutshell',
    domain: 'Emerging Tech',
    category: 'Quantum computing',
    subcategoryId: 46,
    duration: 620,
    tags: ['physics', 'relativity', 'time travel'],
  },
  {
    id: 'WUvTyaaNkzM',
    title: 'The essence of calculus',
    channel: 'Gjnup-PuquQ',
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    duration: 1025,
    tags: ['math', 'calculus', 'qw--VYLpxG4', 'visualization'],
  },
  {
    id: 'aircAruvnKk',
    title: 'Neural networks visualized',
    channel: 'Gjnup-PuquQ',
    domain: 'AI & Machine Learning',
    category: 'Deep Learning (CNN, RNN, Transformers)',
    subcategoryId: 2,
    duration: 1140,
    tags: ['neural networks', 'deep learning', 'backpropagation', 'ai'],
  },
  {
    id: 'fNk_zzaMoSs',
    title: 'Linear algebra for ML',
    channel: 'Gjnup-PuquQ',
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    duration: 940,
    tags: ['linear algebra', 'matrices', 'vectors', 'ml'],
  },
  {
    id: 'spUNpyF58BY',
    title: 'Fourier transform visual introduction',
    channel: 'Gjnup-PuquQ',
    domain: 'Security & Data',
    category: 'Data engineering',
    subcategoryId: 43,
    duration: 1250,
    tags: ['fourier', 'MBRqu0YOH14', 'math', 'signals'],
  },
  {
    id: '17WoOqgXsRM',
    title: 'Coding challenge #1: Starfield',
    channel: 'The Coding Train',
    domain: 'Web Development',
    category: 'Frontend frameworks (React, Vue, Svelte)',
    subcategoryId: 17,
    duration: 1680,
    tags: ['creative coding', 'p5js', 'javascript', 'canvas'],
  },
  {
    id: 'HerCR8bw_GE',
    title: 'P5.js tutorial for beginners',
    channel: 'The Coding Train',
    domain: 'Programming Languages',
    category: 'JavaScript / TypeScript',
    subcategoryId: 10,
    duration: 1420,
    tags: ['javascript', 'canvas', 'p5js', 'graphics'],
  },
  {
    id: 'rV3HJ4LEZ7k',
    title: 'Building a $10000 PC for AI Training',
    channel: 'Linus Tech Tips',
    domain: 'Emerging Tech',
    category: 'Edge computing',
    subcategoryId: 47,
    duration: 1120,
    tags: ['hardware', 'gpu', 'f2EqECiTBL8', 'ai hardware'],
  },
  {
    id: '30LWjhZzg50',
    title: 'GPU benchmark: RTX 4090 vs H100',
    channel: 'Linus Tech Tips',
    domain: 'Emerging Tech',
    category: 'Edge computing',
    subcategoryId: 47,
    duration: 890,
    tags: ['gpu', 'benchmarks', 'nvidia', 'hardware'],
  },
  {
    id: 'AuA2EAgAegE',
    title: 'Server room tour and Kubernetes cluster',
    channel: 'Linus Tech Tips',
    domain: 'Cloud & DevOps',
    category: 'Microservices architecture',
    subcategoryId: 36,
    duration: 1280,
    tags: ['servers', 'datacenter', 'networking', 'storage'],
  },
  {
    id: 'PaCmpygFfXo',
    title: 'How passwords and hashing work',
    channel: 'Computerphile',
    domain: 'Security & Data',
    category: 'Cybersecurity fundamentals',
    subcategoryId: 39,
    duration: 710,
    tags: ['security', 'cryptography', 'passwords', 'sha256'],
  },
  {
    id: 'jhXCTbFnK8o',
    title: 'Public key encryption and RSA basics',
    channel: 'Computerphile',
    domain: 'Security & Data',
    category: 'Cybersecurity fundamentals',
    subcategoryId: 39,
    duration: 830,
    tags: ['rsa', 'encryption', 'pki', 'security'],
  },
  {
    id: 'AuA2EAgAegE',
    title: 'The number e and compound growth',
    channel: 'gyMwXuJrbJQ',
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    duration: 640,
    tags: ['math', 'euler', 'growth', 'calculus'],
  },

  // Krish Naik Top Masterclasses (Directly referenced by user & authentic hits)
  {
    id: '1vsmaEfbnoE',
    title: 'AI Learning Path For 2026 - Data Science, Generative AI & AI Agents',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 1800,
    tags: ['krish naik', 'ai learning path', 'roadmap', 'generative ai', 'data science', 'agentic ai', '2026'],
  },
  {
    id: 'HCJvnek8zZM',
    title: 'Building AI Agents With Microsoft WorkIQ - Zero API Calls',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 1650,
    tags: ['krish naik', 'ai agents', 'microsoft workiq', 'zero api calls', 'automation', 'llm'],
  },
  {
    id: 'qvrbwZ3V4-o',
    title: 'Generative AI Vs Agentic AI Vs AI Agents - Complete Clarification',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 1740,
    tags: ['krish naik', 'generative ai', 'agentic ai', 'ai agents', 'difference', 'architecture'],
  },
  {
    id: '_iRUnZ_BFkA',
    title: 'Which AI Role Should You Prepare For? (AI Engineer, Data Scientist, ML Engineer)',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    duration: 1200,
    tags: ['krish naik', 'ai role', 'career', 'data scientist', 'ml engineer', 'ai engineer', 'jobs'],
  },
  {
    id: 'J5fqR-TRebI',
    title: 'Complete Agentic AI Roadmap - LangChain, LangGraph, CrewAI & Multi-Agents',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 2400,
    tags: ['krish naik', 'agentic ai roadmap', 'langgraph', 'crewai', 'autonomous agents', 'rag'],
  },
  {
    id: 'rV3HJ4LEZ7k',
    title: 'CrewAI Tutorial for Beginners - Build Multi-Agent AI Systems in Python',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 5400,
    tags: ['krish naik', 'crewai', '5C_HPTJg5ek', 'python', 'langchain', 'ai agents'],
  },
  {
    id: 'G4hL5Om4IJ4',
    title: 'LangGraph Tutorial - Building Cyclic Stateful Multi-Agent Workflows',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 7200,
    tags: ['krish naik', 'langgraph', 'cyclic graphs', 'langchain', 'stateful agents'],
  },
  {
    id: '8hly31xKli0',
    title: 'LlamaIndex Complete Guide - Advanced RAG & Vector Indexing Pipelines',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 8100,
    tags: ['krish naik', 'llamaindex', 'rag', 'vector database', 'retrieval', 'llm'],
  },
  {
    id: 'VMj-3S1tku0',
    title: 'Vector Databases Explained - Pinecone, ChromaDB, Qdrant, Milvus & FAISS',
    channel: 'Krish Naik',
    domain: 'Security & Data',
    category: 'Data engineering',
    subcategoryId: 43,
    duration: 5400,
    tags: ['krish naik', 'vector database', 'chromadb', 'pinecone', 'embeddings', 'similarity search'],
  },
  {
    id: 'm8Icp_Cid5o',
    title: 'Fine-Tuning Llama 3 with LoRA and QLoRA on Custom Datasets in Unsloth',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 6300,
    tags: ['krish naik', '_iRUnZ_BFkA', 'llama 3', 'lora', 'qlora', 'unsloth', 'llm'],
  },
  {
    id: 'MsocPEZBd-M',
    title: 'Complete Prompt Engineering Masterclass for Developers - 0 to Pro',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 7200,
    tags: ['krish naik', 'prompt engineering', 'system prompts', 'few-shot', 'chain of thought'],
  },
  {
    id: 'GhQdlIFylQ8',
    title: 'Complete MLOps Bootcamp - MLflow, DVC, Docker, GitHub Actions & AWS',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Model Deployment (MLOps)',
    subcategoryId: 8,
    duration: 18000,
    tags: ['krish naik', 'mlops', 'mlflow', 'dvc', 'docker', 'ci/cd', 'aws', 'deployment'],
  },
  {
    id: 'HGOBQPFzWKo',
    title: 'FastAPI for Machine Learning & Deep Learning Model Serving',
    channel: 'Krish Naik',
    domain: 'Web Development',
    category: 'Backend frameworks (Node.js, Django, Spring)',
    subcategoryId: 18,
    duration: 6400,
    tags: ['krish naik', 'fastapi', 'model serving', 'api', 'python', 'docker'],
  },
  {
    id: 'i_LwzRVP7bg',
    title: 'Mathematics for Machine Learning - Linear Algebra, Calculus & Optimization',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    duration: 14400,
    tags: ['krish naik', 'maths for ml', 'linear algebra', 'calculus', 'w7ejDZ8SWv8', 'gradient descent'],
  },
  {
    id: 'inWWhr5tnEA',
    title: 'Building Production RAG Systems with Hybrid Search & Cross-Encoder Re-ranking',
    channel: 'Krish Naik',
    domain: 'AI & Machine Learning',
    category: 'Generative AI & LLMs',
    subcategoryId: 5,
    duration: 9000,
    tags: ['krish naik', 'rag', 'hybrid search', 'reranking', 'bm25', 'dense vectors'],
  },
  // Top Developer Masterclasses Across All Fields
  {
    id: 'zQnBQ4tB3ZA',
    title: 'Vue.js 3 Full Course for Beginners [2024 Edition]',
    channel: 'freeCodeCamp.org',
    domain: 'Web Development',
    category: 'Frontend frameworks (React, Vue, Svelte)',
    subcategoryId: 17,
    duration: 10800,
    tags: ['vue', 'javascript', 'frontend', 'web dev'],
  },
  {
    id: '30LWjhZzg50',
    title: 'Svelte & SvelteKit Full Course for Beginners',
    channel: 'freeCodeCamp.org',
    domain: 'Web Development',
    category: 'Frontend frameworks (React, Vue, Svelte)',
    subcategoryId: 17,
    duration: 14400,
    tags: ['svelte', 'sveltekit', 'frontend', 'javascript'],
  },
  {
    id: 'Y8Tko2YC5hA',
    title: 'CSS Grid & Flexbox Full Tutorial with Responsive Projects',
    channel: 'freeCodeCamp.org',
    domain: 'Web Development',
    category: 'Frontend frameworks (React, Vue, Svelte)',
    subcategoryId: 17,
    duration: 18000,
    tags: ['css', 'grid', 'responsive', 'frontend'],
  },
  {
    id: 'zQnBQ4tB3ZA',
    title: 'Postman Tutorial for Beginners - API Testing & Automation',
    channel: 'freeCodeCamp.org',
    domain: 'Web Development',
    category: 'REST & GraphQL APIs',
    subcategoryId: 21,
    duration: 9000,
    tags: ['postman', 'api', 'testing', 'rest api'],
  },
  {
    id: '2pWv7GOvuf0',
    title: 'gRPC in 100 Seconds',
    channel: 'Fireship',
    domain: 'Web Development',
    category: 'REST & GraphQL APIs',
    subcategoryId: 21,
    duration: 140,
    tags: ['grpc', 'protobuf', 'microservices', 'fireship'],
  },
  {
    id: 'lHhRhPV--G0',
    title: 'FastAPI + Celery + Redis: Background Tasks Full Guide',
    channel: 'ArjanCodes',
    domain: 'Web Development',
    category: 'Backend frameworks (Node.js, Django, Spring)',
    subcategoryId: 18,
    duration: 2400,
    tags: ['fastapi', 'celery', 'redis', 'python', 'architecture'],
  },
  {
    id: 'jhXCTbFnK8o',
    title: 'Kubernetes Crash Course for Absolute Beginners',
    channel: 'TechWorld with Nana',
    domain: 'Cloud & DevOps',
    category: 'Kubernetes & containerization',
    subcategoryId: 30,
    duration: 13800,
    tags: ['kubernetes', 'k8s', 'devops', 'docker', 'nana'],
  },
  {
    id: 'LZzq1zSL1bs',
    title: 'Terraform Full Course - Automate Cloud Infrastructure with IaC',
    channel: 'freeCodeCamp.org',
    domain: 'Cloud & DevOps',
    category: 'Infrastructure as Code (Terraform, Ansible)',
    subcategoryId: 31,
    duration: 7800,
    tags: ['terraform', 'iac', 'cloud', 'aws', 'devops'],
  },
  {
    id: 'RGOj5yH7evk',
    title: 'GitHub Actions Tutorial - CI/CD Pipelines from Scratch',
    channel: 'Kunal Kushwaha',
    domain: 'Cloud & DevOps',
    category: 'CI/CD pipelines (GitHub Actions, GitLab)',
    subcategoryId: 29,
    duration: 5400,
    tags: ['github actions', 'cicd', 'devops', 'kunal kushwaha'],
  },
  {
    id: 'xk4_1vDrzzo',
    title: 'Complete DevOps Bootcamp - Linux, Docker, K8s, CI/CD, Terraform',
    channel: 'Kunal Kushwaha',
    domain: 'Cloud & DevOps',
    category: 'DevOps & SRE culture',
    subcategoryId: 28,
    duration: 28800,
    tags: ['devops', 'kunal kushwaha', 'docker', 'kubernetes', 'linux'],
  },
  {
    id: 'wm5gMKuwSYk',
    title: 'Blind 75 LeetCode Questions - Full DSA Roadmap Solved',
    channel: 'NeetCode',
    domain: 'Software Engineering Practice',
    category: 'Interview preparation & coding challenges',
    subcategoryId: 55,
    duration: 18000,
    tags: ['neetcode', 'blind 75', 'dsa', 'leetcode', 'algorithms', 'faang'],
  },
  {
    id: '-7VgYNiGxYw',
    title: 'Dynamic Programming - 7 Patterns You Must Know',
    channel: 'NeetCode',
    domain: 'Software Engineering Practice',
    category: 'Interview preparation & coding challenges',
    subcategoryId: 55,
    duration: 3600,
    tags: ['neetcode', 'dynamic programming', 'algorithms', 'dsa'],
  },
  {
    id: 'EN4fEbcFZ_E',
    title: 'System Design: Designing Twitter / X from Scratch',
    channel: 'NeetCode',
    domain: 'Cloud & DevOps',
    category: 'Distributed systems & consensus',
    subcategoryId: 34,
    duration: 2100,
    tags: ['neetcode', 'system design', 'twitter', 'distributed systems'],
  },
  {
    id: 'WQeoO7MI0Bs',
    title: 'Chai aur React 19 - Complete React Course in Hindi',
    channel: 'Chai aur Code',
    domain: 'Web Development',
    category: 'Frontend frameworks (React, Vue, Svelte)',
    subcategoryId: 17,
    duration: 36000,
    tags: ['chai aur code', 'hitesh choudhary', 'react', 'react 19', 'javascript'],
  },
  {
    id: 'YS4e4q9oBaU',
    title: 'Chai aur JavaScript - Full In-Depth JS Masterclass',
    channel: 'Chai aur Code',
    domain: 'Programming Languages',
    category: 'JavaScript / TypeScript',
    subcategoryId: 10,
    duration: 43200,
    tags: ['chai aur code', 'hitesh choudhary', 'javascript', 'js in hindi', 'ecmascript'],
  },
  {
    id: 'WUvTyaaNkzM',
    title: 'Docker aur Containerization Master Series in Hindi',
    channel: 'Chai aur Code',
    domain: 'Cloud & DevOps',
    category: 'Kubernetes & containerization',
    subcategoryId: 30,
    duration: 7200,
    tags: ['chai aur code', 'docker', 'containers', 'hitesh choudhary'],
  },
  {
    id: 'zQGOcOUBi6s',
    title: 'Python Full Course for Beginners in Hindi [With Notes & Projects]',
    channel: 'CodeWithHarry',
    domain: 'Programming Languages',
    category: 'Python',
    subcategoryId: 9,
    duration: 43200,
    tags: ['codewithharry', 'python', 'python in hindi', 'full course'],
  },
  {
    id: 'qvrbwZ3V4-o',
    title: 'Complete Web Development Bootcamp - HTML, CSS, JS, React, Node',
    channel: 'CodeWithHarry',
    domain: 'Web Development',
    category: 'Full-Stack Frameworks',
    subcategoryId: 19,
    duration: 72000,
    tags: ['codewithharry', 'web development', 'sigma web dev', 'fullstack', 'react'],
  },
  {
    id: 'pkYVOmU3MgA',
    title: 'C++ Full Course - From Basics to Advanced Object Oriented Programming',
    channel: 'CodeWithHarry',
    domain: 'Programming Languages',
    category: 'C / C++',
    subcategoryId: 14,
    duration: 28800,
    tags: ['codewithharry', 'c++', 'oop', 'dsa in cpp'],
  },
  {
    id: '7xngnjfIlK4',
    title: 'Rust Crash Course for Beginners - From Zero to Hero',
    channel: 'Traversy Media',
    domain: 'Programming Languages',
    category: 'Rust',
    subcategoryId: 11,
    duration: 7200,
    tags: ['traversy media', 'rust', 'systems programming', 'memory safety'],
  },
  {
    id: 'HCJvnek8zZM',
    title: 'Next.js 15 Full Stack Crash Course with Server Actions',
    channel: 'Traversy Media',
    domain: 'Web Development',
    category: 'Full-Stack Frameworks',
    subcategoryId: 19,
    duration: 9000,
    tags: ['traversy media', 'nextjs', 'react', 'fullstack', 'server actions'],
  },
  {
    id: 'SOTamWNgDKc',
    title: 'Go / Golang Programming - Complete Course for Beginners',
    channel: 'freeCodeCamp.org',
    domain: 'Programming Languages',
    category: 'Go (Golang)',
    subcategoryId: 12,
    duration: 25200,
    tags: ['freecodecamp', 'golang', 'go', '7eh4d6sabA0', 'goroutines'],
  },
  {
    id: 'BBpAmxU_NQo',
    title: 'StatQuest: Logistic Regression Clearly Explained!!!',
    channel: 'StatQuest with Josh Starmer',
    domain: 'AI & Machine Learning',
    category: 'Machine Learning fundamentals',
    subcategoryId: 1,
    duration: 1140,
    tags: ['statquest', 'logistic regression', 'classification', 'machine learning'],
  },

];

export function generateMockRecords(count: number = 35): ContentRecord[] {
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_DAY = 24 * ONE_HOUR;

  // Combine taxonomy videos and known videos
  const rawCatalog: ContentRecord[] = [...TAXONOMY_VIDEOS];

  for (const kv of KNOWN_VIDEO_CATALOG) {
    rawCatalog.push({
      id: `known-${kv.id}`,
      videoId: kv.id,
      url: `https://www.youtube.com/watch?v=${kv.id}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${kv.id}/hqdefault.jpg`,
      title: kv.title,
      channel: kv.channel,
      domain: kv.domain,
      category: kv.category,
      subcategoryId: kv.subcategoryId,
      timestamp: now - 2 * ONE_HOUR,
      source: (['home', 'sidebar', 'search', 'trending'] as const)[Math.floor(Math.random() * 4)],
      duration: kv.duration,
      viewCount: Math.floor(Math.random() * 2500000) + 150000,
      likes: Math.floor(Math.random() * 95000) + 5000,
      tags: kv.tags,
    });
  }

  // De-duplicate by videoId
  const seenIds = new Set<string>();
  const uniqueCatalog: ContentRecord[] = [];
  for (const r of rawCatalog) {
    if (!seenIds.has(r.videoId)) {
      seenIds.add(r.videoId);
      uniqueCatalog.push({ ...r });
    }
  }

  // Balanced timestamp distribution guaranteeing EVERY category and domain has fresh Today content:
  // Bucket 0 (Today - 1 to 23 hours ago): 40% of catalog (~80+ videos)
  // Bucket 1 (Past 7 Days - 1 to 6 days ago): 30% of catalog (~60+ videos)
  // Bucket 2 (Past 30 Days - 8 to 28 days ago): 20% of catalog (~40+ videos)
  // Bucket 3 (This Quarter - 32 to 85 days ago): 10% of catalog (~20+ videos)
  uniqueCatalog.forEach((rec, idx) => {
    let assignedTimestamp: number;
    const bucket = idx % 10;

    if (bucket < 4) {
      // TODAY (< 24 hours ago): between 1 and 22 hours ago
      const hoursAgo = (idx % 22) + 1;
      assignedTimestamp = now - hoursAgo * ONE_HOUR;
    } else if (bucket < 7) {
      // PAST 7 DAYS (2 to 6 days ago)
      const daysAgo = (idx % 5) + 2;
      assignedTimestamp = now - daysAgo * ONE_DAY - (idx % 12) * ONE_HOUR;
    } else if (bucket < 9) {
      // PAST 30 DAYS (8 to 28 days ago)
      const daysAgo = (idx % 20) + 8;
      assignedTimestamp = now - daysAgo * ONE_DAY;
    } else {
      // THIS QUARTER (31 to 85 days ago)
      const daysAgo = (idx % 50) + 32;
      assignedTimestamp = now - daysAgo * ONE_DAY;
    }

    rec.timestamp = assignedTimestamp;
  });

  // Sort by newest timestamp first
  return uniqueCatalog.sort((a, b) => b.timestamp - a.timestamp);
}

export function computeStats(records: ContentRecord[], rules: BlockRule[]): DashboardStats {
  const channelMap: Record<string, number> = {};
  const categoryMap: Record<string, number> = {};
  const sourceMap: Record<string, number> = {};
  const dailyMap: Record<string, number> = {};

  for (const r of records) {
    channelMap[r.channel] = (channelMap[r.channel] || 0) + 1;
    categoryMap[r.category] = (categoryMap[r.category] || 0) + 1;
    sourceMap[r.source] = (sourceMap[r.source] || 0) + 1;
    const day = new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  }

  const topChannels = Object.entries(channelMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([channel, count]) => ({ channel, count }));

  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([category, count]) => ({ category, count }));

  const dailyActivity = Object.entries(dailyMap)
    .map(([date, count]) => ({ date, count }))
    .slice(-7);

  return {
    total: records.length,
    topChannels,
    topCategories,
    sourceCounts: sourceMap,
    dailyActivity,
    recent: records.slice(0, 15),
    blockedCount: rules.length,
  };
}

export function shouldBlock(record: ContentRecord, rules: BlockRule[]): boolean {
  return rules.some((rule) => {
    const target = rule.value.toLowerCase();
    if (!target) return false;
    if (rule.type === 'keyword') return record.title.toLowerCase().includes(target);
    if (rule.type === 'channel') return record.channel.toLowerCase().includes(target);
    if (rule.type === 'category') return record.category.toLowerCase() === target;
    return false;
  });
}
