// Taxonomy: 8 Domains and 57 Software Development Categories
// Based on the comprehensive software development taxonomy

export interface CategoryDomain {
  id: string;
  name: string;
  icon: string;
  color: string;
  accentClass: string;
  badgeClass: string;
  description: string;
}

export interface SubCategory {
  id: number;
  slug: string;
  name: string;
  domainId: string;
  domainName: string;
  description: string;
  keywords: string[];
  affinityCategoryIds: number[];
}

export const DOMAINS: CategoryDomain[] = [
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    icon: '🤖',
    color: 'purple',
    accentClass: 'from-purple-500 to-indigo-500',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    description: 'Foundations, architectures, generative models, and production MLOps',
  },
  {
    id: 'languages',
    name: 'Programming Languages',
    icon: '💻',
    color: 'blue',
    accentClass: 'from-blue-500 to-cyan-500',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: 'Modern systems, web, and scripting languages and runtimes',
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    icon: '🌐',
    color: 'cyan',
    accentClass: 'from-cyan-500 to-teal-500',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    description: 'Frontend, backend, API design, PWAs, performance, and accessibility',
  },
  {
    id: 'mobile-dev',
    name: 'Mobile Development',
    icon: '📱',
    color: 'pink',
    accentClass: 'from-pink-500 to-rose-500',
    badgeClass: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    description: 'Cross-platform and native Android/iOS mobile engineering',
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    icon: '☁️',
    color: 'sky',
    accentClass: 'from-sky-500 to-blue-600',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    description: 'Cloud infrastructure, containers, CI/CD, IaC, and distributed systems',
  },
  {
    id: 'security-data',
    name: 'Security & Data',
    icon: '🔐',
    color: 'emerald',
    accentClass: 'from-emerald-500 to-teal-600',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Cybersecurity, blockchain, smart contracts, data pipelines, and analytics',
  },
  {
    id: 'emerging-tech',
    name: 'Emerging Tech',
    icon: '🎯',
    color: 'amber',
    accentClass: 'from-amber-500 to-orange-500',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Quantum computing, edge IoT, 5G, spatial AR/VR, and autonomous systems',
  },
  {
    id: 'ux-practice',
    name: 'UX & Practice',
    icon: '🎨',
    color: 'rose',
    accentClass: 'from-rose-500 to-pink-600',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    description: 'Design systems, low-code, agile methodologies, and open-source workflows',
  },
];

export const SUBCATEGORIES: SubCategory[] = [
  // 🤖 AI & Machine Learning (1–8)
  {
    id: 1,
    slug: 'ml-fundamentals',
    name: 'Machine Learning fundamentals',
    domainId: 'ai-ml',
    domainName: 'AI & Machine Learning',
    description: 'Core supervised and unsupervised learning algorithms, regression, trees, gradient descent, and evaluation metrics.',
    keywords: ['machine learning', 'scikit-learn', 'linear regression', 'clustering', 'random forest', 'gradient descent'],
    affinityCategoryIds: [2, 9, 7, 45, 8],
  },
  {
    id: 2,
    slug: 'deep-learning',
    name: 'Deep Learning (CNN, RNN, Transformers)',
    domainId: 'ai-ml',
    domainName: 'AI & Machine Learning',
    description: 'Neural network architectures, convolution, sequence modeling, attention mechanisms, and foundational transformers.',
    keywords: ['deep learning', 'pytorch', 'tensorflow', 'transformers', 'cnn', 'rnn', 'attention'],
    affinityCategoryIds: [1, 3, 4, 5, 9, 8],
  },
  {
    id: 3,
    slug: 'nlp',
    name: 'Natural Language Processing (NLP)',
    domainId: 'ai-ml',
    domainName: 'AI & Machine Learning',
    description: 'Text representation, tokenization, embeddings, sentiment analysis, translation, and BERT/RoBERTa architectures.',
    keywords: ['nlp', 'tokenization', 'huggingface', 'bert', 'text embeddings', 'langchain'],
    affinityCategoryIds: [2, 5, 9, 7],
  },
  {
    id: 4,
    slug: 'computer-vision',
    name: 'Computer Vision',
    domainId: 'ai-ml',
    domainName: 'AI & Machine Learning',
    description: 'Object detection, image segmentation, OpenCV, YOLO, diffusion vision backbones, and spatial video processing.',
    keywords: ['computer vision', 'opencv', 'yolo', 'image segmentation', 'diffusion', 'object detection'],
    affinityCategoryIds: [2, 1, 9, 28, 51],
  },
  {
    id: 5,
    slug: 'generative-ai-llms',
    name: 'Generative AI & LLMs',
    domainId: 'ai-ml',
    domainName: 'AI & Machine Learning',
    description: 'Large language models, prompt engineering, RAG pipelines, fine-tuning, autonomous agentic workflows, and synthetic media.',
    keywords: ['llm', 'generative ai', 'gpt', 'rag', 'langchain', 'llama', 'prompt engineering', 'agents'],
    affinityCategoryIds: [2, 3, 8, 9, 7],
  },
  {
    id: 6,
    slug: 'reinforcement-learning',
    name: 'Reinforcement Learning',
    domainId: 'ai-ml',
    domainName: 'AI & Machine Learning',
    description: 'Q-learning, policy gradients, RLHF (from human feedback), multi-agent simulations, and robotic control.',
    keywords: ['reinforcement learning', 'rlhf', 'q-learning', 'policy gradient', 'gymnasium'],
    affinityCategoryIds: [1, 2, 5, 9],
  },
  {
    id: 7,
    slug: 'recommender-systems',
    name: 'Recommender Systems',
    domainId: 'ai-ml',
    domainName: 'AI & Machine Learning',
    description: 'Collaborative filtering, matrix factorization, content-based embeddings, candidate generation, two-tower models, and ranking.',
    keywords: ['recommender systems', 'collaborative filtering', 'embeddings', 'ranking', 'two-tower model', 'similarity'],
    affinityCategoryIds: [1, 5, 9, 45, 43],
  },
  {
    id: 8,
    slug: 'model-deployment-mlops',
    name: 'Model Deployment (MLOps)',
    domainId: 'ai-ml',
    domainName: 'AI & Machine Learning',
    description: 'Serving ML models in production, Triton, ONNX, vLLM, model registries, drift monitoring, and scalable inference pipelines.',
    keywords: ['mlops', 'model serving', 'triton', 'vllm', 'onnx', 'docker', 'kubeflow'],
    affinityCategoryIds: [1, 2, 5, 30, 29, 32],
  },

  // 💻 Programming Languages (9–16)
  {
    id: 9,
    slug: 'python',
    name: 'Python',
    domainId: 'languages',
    domainName: 'Programming Languages',
    description: 'Python language features, typing, async programming, data structures, profiling, and extensive library ecosystem.',
    keywords: ['python', 'asyncio', 'pandas', 'fastapi', 'numpy', 'pytest', 'poetry'],
    affinityCategoryIds: [1, 2, 5, 7, 18, 43],
  },
  {
    id: 10,
    slug: 'javascript-typescript',
    name: 'JavaScript / TypeScript',
    domainId: 'languages',
    domainName: 'Programming Languages',
    description: 'Modern ESNext, TypeScript type system, generics, utility types, Node.js/Bun runtimes, and functional patterns.',
    keywords: ['typescript', 'javascript', 'generics', 'node.js', 'bun', 'ecmascript'],
    affinityCategoryIds: [17, 18, 24, 21, 19],
  },
  {
    id: 11,
    slug: 'go',
    name: 'Go',
    domainId: 'languages',
    domainName: 'Programming Languages',
    description: 'Golang concurrency with goroutines, channels, interfaces, microservices, CLI tooling, and high-throughput servers.',
    keywords: ['golang', 'goroutines', 'channels', 'microservices', 'kubernetes', 'grpc'],
    affinityCategoryIds: [30, 36, 37, 29, 18],
  },
  {
    id: 12,
    slug: 'rust',
    name: 'Rust',
    domainId: 'languages',
    domainName: 'Programming Languages',
    description: 'Ownership, borrowing, lifetimes, memory safety without garbage collection, async Tokio, and WebAssembly compilation.',
    keywords: ['rust', 'ownership', 'tokio', 'webassembly', 'memory safety', 'cargo'],
    affinityCategoryIds: [22, 37, 15, 47, 40],
  },
  {
    id: 13,
    slug: 'kotlin',
    name: 'Kotlin',
    domainId: 'languages',
    domainName: 'Programming Languages',
    description: 'Idiomatic Kotlin, coroutines, Flow, null-safety, multiplatform (KMP), and server-side backend frameworks.',
    keywords: ['kotlin', 'coroutines', 'kmp', 'android', 'ktor', 'flow'],
    affinityCategoryIds: [26, 14, 18, 25],
  },
  {
    id: 14,
    slug: 'java',
    name: 'Java',
    domainId: 'languages',
    domainName: 'Programming Languages',
    description: 'Modern Java (17+ / 21+), virtual threads (Project Loom), JVM internals, Spring Boot, and enterprise enterprise architectures.',
    keywords: ['java', 'spring boot', 'jvm', 'virtual threads', 'loom', 'maven'],
    affinityCategoryIds: [18, 13, 36, 44, 37],
  },
  {
    id: 15,
    slug: 'c-cpp',
    name: 'C/C++',
    domainId: 'languages',
    domainName: 'Programming Languages',
    description: 'Low-level memory management, pointers, RAII, modern C++20/C++23 features, compilers, and hardware acceleration.',
    keywords: ['c++', 'c', 'pointers', 'memory management', 'compilers', 'raii', 'embedded'],
    affinityCategoryIds: [12, 47, 49, 37],
  },
  {
    id: 16,
    slug: 'swift',
    name: 'Swift',
    domainId: 'languages',
    domainName: 'Programming Languages',
    description: 'Swift language syntax, protocols, structured concurrency (async/await, actors), and Apple platform ergonomics.',
    keywords: ['swift', 'swiftui', 'async/await', 'actors', 'protocols', 'ios'],
    affinityCategoryIds: [27, 28, 25],
  },

  // 🌐 Web Development (17–23)
  {
    id: 17,
    slug: 'frontend-frameworks',
    name: 'Frontend frameworks (React, Vue, Svelte)',
    domainId: 'web-dev',
    domainName: 'Web Development',
    description: 'Component-driven user interfaces, React 19, Server Components, Vue 3 Composition API, Svelte 5 runes, and state stores.',
    keywords: ['react', 'vue', 'svelte', 'next.js', 'state management', 'tailwind', 'components'],
    affinityCategoryIds: [10, 24, 21, 22, 53],
  },
  {
    id: 18,
    slug: 'backend-frameworks',
    name: 'Backend frameworks (Node.js, Django, Spring)',
    domainId: 'web-dev',
    domainName: 'Web Development',
    description: 'RESTful and RPC servers, Express, NestJS, Django, FastAPI, Spring Boot, routing, middleware, and ORMs.',
    keywords: ['backend', 'fastapi', 'django', 'express', 'nestjs', 'spring boot', 'orm'],
    affinityCategoryIds: [9, 10, 21, 36, 43],
  },
  {
    id: 19,
    slug: 'pwa',
    name: 'Progressive Web Apps (PWAs)',
    domainId: 'web-dev',
    domainName: 'Web Development',
    description: 'Service workers, offline caching, web app manifests, background sync, and installable web desktop/mobile experiences.',
    keywords: ['pwa', 'service workers', 'offline storage', 'web manifest', 'caching'],
    affinityCategoryIds: [17, 22, 24, 10],
  },
  {
    id: 20,
    slug: 'web3-decentralized',
    name: 'Web 3.0 / Decentralized web',
    domainId: 'web-dev',
    domainName: 'Web Development',
    description: 'Decentralized applications (dApps), ethers.js, wagmi, IPFS, peer-to-peer networks, and decentralized identity.',
    keywords: ['web3', 'dapp', 'ipfs', 'wagmi', 'ethers.js', 'decentralized'],
    affinityCategoryIds: [40, 41, 42, 17, 10],
  },
  {
    id: 21,
    slug: 'graphql-api-design',
    name: 'GraphQL & API design',
    domainId: 'web-dev',
    domainName: 'Web Development',
    description: 'API architecture, GraphQL schemas, resolvers, Apollo, gRPC protocol buffers, OpenAPI/Swagger specifications, and webhooks.',
    keywords: ['graphql', 'api design', 'grpc', 'openapi', 'rest', 'resolvers', 'apollo'],
    affinityCategoryIds: [18, 17, 36, 10],
  },
  {
    id: 22,
    slug: 'web-performance',
    name: 'Web performance optimization',
    domainId: 'web-dev',
    domainName: 'Web Development',
    description: 'Core Web Vitals (LCP, INP, CLS), code-splitting, tree-shaking, lazy-loading, browser caching, and rendering profiling.',
    keywords: ['web performance', 'core web vitals', 'lighthouse', 'bundling', 'caching', 'profiling'],
    affinityCategoryIds: [17, 23, 12, 19],
  },
  {
    id: 23,
    slug: 'accessibility-a11y',
    name: 'Accessibility (a11y)',
    domainId: 'web-dev',
    domainName: 'Web Development',
    description: 'WCAG compliance, ARIA attributes, semantic HTML, keyboard navigation, screen reader testing, and inclusive design.',
    keywords: ['a11y', 'accessibility', 'wcag', 'aria', 'screen reader', 'semantic html'],
    affinityCategoryIds: [17, 22, 53],
  },

  // 📱 Mobile Development (24–28)
  {
    id: 24,
    slug: 'react-native',
    name: 'React Native',
    domainId: 'mobile-dev',
    domainName: 'Mobile Development',
    description: 'Cross-platform mobile apps with Expo, new architecture (Fabric/TurboModules), React Native Web, and mobile state.',
    keywords: ['react native', 'expo', 'mobile app', 'fabric', 'cross-platform', 'ios', 'android'],
    affinityCategoryIds: [17, 10, 25, 26, 27],
  },
  {
    id: 25,
    slug: 'flutter',
    name: 'Flutter',
    domainId: 'mobile-dev',
    domainName: 'Mobile Development',
    description: 'Dart language, Flutter widget tree, custom painters, Riverpod/Bloc state management, and unified multiplatform builds.',
    keywords: ['flutter', 'dart', 'widgets', 'cross-platform', 'riverpod', 'bloc'],
    affinityCategoryIds: [24, 26, 27],
  },
  {
    id: 26,
    slug: 'native-android',
    name: 'Native Android (Kotlin)',
    domainId: 'mobile-dev',
    domainName: 'Mobile Development',
    description: 'Jetpack Compose declarative UI, Android architecture components, Material 3, Room, and Gradle build configurations.',
    keywords: ['android', 'jetpack compose', 'kotlin', 'room', 'material design', 'gradle'],
    affinityCategoryIds: [13, 24, 25, 27],
  },
  {
    id: 27,
    slug: 'native-ios',
    name: 'Native iOS (Swift)',
    domainId: 'mobile-dev',
    domainName: 'Mobile Development',
    description: 'SwiftUI declarative interfaces, UIKit interop, Combine, SwiftData, CoreData, Xcode Instruments, and App Store distribution.',
    keywords: ['ios', 'swiftui', 'swift', 'xcode', 'swiftdata', 'apple'],
    affinityCategoryIds: [16, 24, 25, 26, 28],
  },
  {
    id: 28,
    slug: 'mobile-ar-vr',
    name: 'Mobile AR/VR apps',
    domainId: 'mobile-dev',
    domainName: 'Mobile Development',
    description: 'ARKit, ARCore, spatial tracking, photogrammetry, realityKit, and handheld augmented reality interactive experiences.',
    keywords: ['augmented reality', 'arkit', 'arcore', 'spatial computing', 'realitykit', 'virtual reality'],
    affinityCategoryIds: [4, 27, 26, 51],
  },

  // ☁️ Cloud & DevOps (29–38)
  {
    id: 29,
    slug: 'cloud-platforms',
    name: 'Cloud platforms (AWS, Azure, GCP)',
    domainId: 'cloud-devops',
    domainName: 'Cloud & DevOps',
    description: 'Public cloud architecture, IAM roles, VPC networking, compute (EC2/GCE), storage (S3/Cloud Storage), and cost governance.',
    keywords: ['aws', 'azure', 'gcp', 'cloud architecture', 'iam', 's3', 'vpc'],
    affinityCategoryIds: [30, 31, 32, 33, 35, 36],
  },
  {
    id: 30,
    slug: 'kubernetes-containers',
    name: 'Kubernetes & containerization',
    domainId: 'cloud-devops',
    domainName: 'Cloud & DevOps',
    description: 'Docker container packaging, Kubernetes pods, deployments, services, Helm charts, ingress controllers, and cluster operations.',
    keywords: ['kubernetes', 'docker', 'containers', 'k8s', 'helm', 'pods', 'orchestration'],
    affinityCategoryIds: [29, 32, 33, 36, 11],
  },
  {
    id: 31,
    slug: 'serverless-computing',
    name: 'Serverless computing',
    domainId: 'cloud-devops',
    domainName: 'Cloud & DevOps',
    description: 'Event-driven functions (AWS Lambda, Cloudflare Workers), edge runtime execution, cold starts, and serverless databases.',
    keywords: ['serverless', 'aws lambda', 'cloudflare workers', 'edge functions', 'faas'],
    affinityCategoryIds: [29, 18, 36, 47],
  },
  {
    id: 32,
    slug: 'cicd-pipelines',
    name: 'CI/CD pipelines',
    domainId: 'cloud-devops',
    domainName: 'Cloud & DevOps',
    description: 'GitHub Actions, GitLab CI, automated test runs, Docker image builds, artifact publishing, and zero-downtime deployment strategies.',
    keywords: ['ci/cd', 'github actions', 'gitlab ci', 'continuous integration', 'deployment', 'automation'],
    affinityCategoryIds: [30, 33, 34, 29, 57],
  },
  {
    id: 33,
    slug: 'infrastructure-as-code',
    name: 'Infrastructure as Code (IaC)',
    domainId: 'cloud-devops',
    domainName: 'Cloud & DevOps',
    description: 'Terraform, OpenTofu, Pulumi, AWS CDK, state management, drift detection, and modular cloud provisioning.',
    keywords: ['iac', 'terraform', 'opentofu', 'pulumi', 'cloudformation', 'cdk'],
    affinityCategoryIds: [29, 30, 32, 34],
  },
  {
    id: 34,
    slug: 'devsecops',
    name: 'DevSecOps',
    domainId: 'cloud-devops',
    domainName: 'Cloud & DevOps',
    description: 'Automated vulnerability scanning (SAST/DAST), dependency audits (Snyk, Dependabot), container image scanning, and secret detection.',
    keywords: ['devsecops', 'sast', 'dast', 'vulnerability scanning', 'snyk', 'security pipelines'],
    affinityCategoryIds: [32, 39, 30, 33],
  },
  {
    id: 35,
    slug: 'finops-greenops',
    name: 'FinOps & GreenOps',
    domainId: 'cloud-devops',
    domainName: 'Cloud & DevOps',
    description: 'Cloud cost optimization, reserved instances, Spot management, carbon footprint measurement, and workload efficiency.',
    keywords: ['finops', 'cloud cost', 'greenops', 'efficiency', 'cost optimization', 'sustainability'],
    affinityCategoryIds: [29, 30, 36],
  },
  {
    id: 36,
    slug: 'microservices-architecture',
    name: 'Microservices architecture',
    domainId: 'cloud-devops',
    domainName: 'Cloud & DevOps',
    description: 'Domain-Driven Design (DDD), service meshes (Istio), API gateways, saga patterns, event brokers (Kafka, RabbitMQ), and decomposition.',
    keywords: ['microservices', 'kafka', 'event-driven', 'api gateway', 'service mesh', 'domain-driven design'],
    affinityCategoryIds: [30, 37, 21, 29, 18],
  },
  {
    id: 37,
    slug: 'distributed-computing',
    name: 'Distributed computing',
    domainId: 'cloud-devops',
    domainName: 'Cloud & DevOps',
    description: 'CAP theorem, consensus algorithms (Raft, Paxos), distributed consensus, sharding, replication, and fault tolerance.',
    keywords: ['distributed systems', 'raft', 'consensus', 'cap theorem', 'sharding', 'fault tolerance'],
    affinityCategoryIds: [36, 11, 12, 44, 40],
  },
  {
    id: 38,
    slug: 'xops-aiops-secops',
    name: 'XOps (AIOps, SecOps)',
    domainId: 'cloud-devops',
    domainName: 'Cloud & DevOps',
    description: 'AI-assisted telemetry, log anomaly detection, automated incident triage, OpenTelemetry, Grafana, and modern observability.',
    keywords: ['aiops', 'secops', 'opentelemetry', 'grafana', 'prometheus', 'observability', 'telemetry'],
    affinityCategoryIds: [34, 8, 30, 36],
  },

  // 🔐 Security & Data (39–45)
  {
    id: 39,
    slug: 'cybersecurity-fundamentals',
    name: 'Cybersecurity fundamentals',
    domainId: 'security-data',
    domainName: 'Security & Data',
    description: 'OWASP Top 10, penetration testing, cryptography, TLS/SSL, authentication protocols (OAuth2, OIDC, Passkeys), and threat modeling.',
    keywords: ['cybersecurity', 'owasp', 'penetration testing', 'cryptography', 'oauth2', 'encryption'],
    affinityCategoryIds: [34, 40, 41, 52],
  },
  {
    id: 40,
    slug: 'blockchain-development',
    name: 'Blockchain development',
    domainId: 'security-data',
    domainName: 'Security & Data',
    description: 'Distributed ledger technology, Ethereum, Solana, zero-knowledge proofs (zk-SNARKs), consensus models, and node operations.',
    keywords: ['blockchain', 'ethereum', 'solana', 'zk-snarks', 'web3', 'ledger'],
    affinityCategoryIds: [41, 42, 20, 39, 37],
  },
  {
    id: 41,
    slug: 'smart-contracts',
    name: 'Smart contracts',
    domainId: 'security-data',
    domainName: 'Security & Data',
    description: 'Solidity, Rust for Solana, Hardhat, Foundry, reentrancy audits, gas optimization, and decentralized finance (DeFi) protocols.',
    keywords: ['smart contracts', 'solidity', 'foundry', 'hardhat', 'defi', 'auditing'],
    affinityCategoryIds: [40, 42, 20, 12, 39],
  },
  {
    id: 42,
    slug: 'nfts-digital-ownership',
    name: 'NFTs & digital ownership',
    domainId: 'security-data',
    domainName: 'Security & Data',
    description: 'ERC-721/1155 token standards, on-chain metadata, royalty mechanisms, dynamic NFTs, and decentralized provenance.',
    keywords: ['nft', 'erc721', 'digital ownership', 'metadata', 'tokens'],
    affinityCategoryIds: [40, 41, 20],
  },
  {
    id: 43,
    slug: 'data-engineering',
    name: 'Data engineering',
    domainId: 'security-data',
    domainName: 'Security & Data',
    description: 'ETL/ELT pipelines, dbt, Apache Airflow, Snowflake, Databricks, PostgreSQL, data lakehouses, and dimensional modeling.',
    keywords: ['data engineering', 'etl', 'airflow', 'dbt', 'snowflake', 'sql', 'lakehouse'],
    affinityCategoryIds: [44, 45, 9, 18, 7],
  },
  {
    id: 44,
    slug: 'big-data',
    name: 'Big data (Spark, Hadoop)',
    domainId: 'security-data',
    domainName: 'Security & Data',
    description: 'Distributed data processing, Apache Spark, PySpark, streaming analytics (Flink, Kafka Streams), and petabyte storage.',
    keywords: ['big data', 'apache spark', 'pyspark', 'hadoop', 'streaming', 'flink'],
    affinityCategoryIds: [43, 45, 37, 14, 9],
  },
  {
    id: 45,
    slug: 'predictive-analytics',
    name: 'Predictive analytics',
    domainId: 'security-data',
    domainName: 'Security & Data',
    description: 'Statistical modeling, time-series forecasting (Prophet, ARIMA), feature engineering, churn analysis, and business intelligence.',
    keywords: ['predictive analytics', 'forecasting', 'time series', 'statistics', 'business intelligence'],
    affinityCategoryIds: [1, 7, 43, 9],
  },

  // 🎯 Emerging Tech (46–52)
  {
    id: 46,
    slug: 'quantum-computing',
    name: 'Quantum computing',
    domainId: 'emerging-tech',
    domainName: 'Emerging Tech',
    description: 'Qubits, quantum superposition, entanglement, Qiskit, quantum algorithms (Shor, Grover), and quantum annealing.',
    keywords: ['quantum computing', 'qiskit', 'qubits', 'quantum algorithms', 'superposition'],
    affinityCategoryIds: [1, 37, 15],
  },
  {
    id: 47,
    slug: 'edge-computing',
    name: 'Edge computing',
    domainId: 'emerging-tech',
    domainName: 'Emerging Tech',
    description: 'Edge nodes, low-latency computing, micro-data centers, WebAssembly at the edge, and distributed sensor pre-processing.',
    keywords: ['edge computing', 'low latency', 'wasm', 'iot', 'edge ai'],
    affinityCategoryIds: [49, 48, 12, 31, 8],
  },
  {
    id: 48,
    slug: '5g-realtime-applications',
    name: '5G & real-time applications',
    domainId: 'emerging-tech',
    domainName: 'Emerging Tech',
    description: 'Ultra-reliable low latency communications (URLLC), WebRTC streaming, network slicing, and real-time multiplayer backends.',
    keywords: ['5g', 'realtime', 'webrtc', 'low latency', 'streaming', 'networking'],
    affinityCategoryIds: [47, 49, 37, 28],
  },
  {
    id: 49,
    slug: 'iot-development',
    name: 'IoT development',
    domainId: 'emerging-tech',
    domainName: 'Emerging Tech',
    description: 'Microcontroller programming (ESP32, Raspberry Pi, Arduino), MQTT protocols, hardware sensors, and smart device firmware.',
    keywords: ['iot', 'esp32', 'arduino', 'mqtt', 'embedded', 'hardware', 'raspberry pi'],
    affinityCategoryIds: [47, 48, 15, 12],
  },
  {
    id: 50,
    slug: 'internet-of-behavior',
    name: 'Internet of Behavior (IoB)',
    domainId: 'emerging-tech',
    domainName: 'Emerging Tech',
    description: 'Behavioral analytics, telemetry-driven personalization, ethics in user tracking, ergonomics, and predictive behavioral models.',
    keywords: ['iob', 'behavioral analytics', 'user telemetry', 'ethics', 'personalization'],
    affinityCategoryIds: [7, 45, 53],
  },
  {
    id: 51,
    slug: 'ar-vr-enterprise',
    name: 'AR/VR enterprise applications',
    domainId: 'emerging-tech',
    domainName: 'Emerging Tech',
    description: 'Industrial digital twins, virtual training simulations, WebXR, Apple Vision Pro spatial visionOS, and Unity/Unreal integration.',
    keywords: ['enterprise vr', 'digital twins', 'webxr', 'visionos', 'unity', 'unreal engine'],
    affinityCategoryIds: [28, 4, 53],
  },
  {
    id: 52,
    slug: 'digital-immune-systems',
    name: 'Digital immune systems',
    domainId: 'emerging-tech',
    domainName: 'Emerging Tech',
    description: 'Self-healing systems, chaos engineering (Chaos Monkey), automated remediation, resilience testing, and autonomous recovery.',
    keywords: ['digital immune system', 'chaos engineering', 'self-healing', 'resilience', 'site reliability'],
    affinityCategoryIds: [34, 38, 30, 39],
  },

  // 🎨 UX & Practice (53–57)
  {
    id: 53,
    slug: 'ux-ui-design',
    name: 'UX/UI design',
    domainId: 'ux-practice',
    domainName: 'UX & Practice',
    description: 'Figma component systems, user research, wireframing, design tokens, responsive typography, and interaction micro-animations.',
    keywords: ['ux design', 'ui design', 'figma', 'design systems', 'wireframing', 'micro-interactions'],
    affinityCategoryIds: [17, 23, 54],
  },
  {
    id: 54,
    slug: 'low-code-no-code',
    name: 'Low-code / No-code platforms',
    domainId: 'ux-practice',
    domainName: 'UX & Practice',
    description: 'Visual builders, Retool, Webflow, Bubble, Zapier automation, citizen developer integrations, and enterprise internal tools.',
    keywords: ['low code', 'no code', 'retool', 'webflow', 'automation', 'zapier'],
    affinityCategoryIds: [53, 17, 18],
  },
  {
    id: 55,
    slug: 'agile-scrum',
    name: 'Agile & Scrum',
    domainId: 'ux-practice',
    domainName: 'UX & Practice',
    description: 'Sprint planning, Kanban boards, story point estimation, retrospective rituals, velocity tracking, and cross-functional leadership.',
    keywords: ['agile', 'scrum', 'kanban', 'sprint planning', 'jira', 'retrospective'],
    affinityCategoryIds: [56, 57],
  },
  {
    id: 56,
    slug: 'remote-collaboration-tools',
    name: 'Remote collaboration tools',
    domainId: 'ux-practice',
    domainName: 'UX & Practice',
    description: 'Asynchronous communication, documentation tools (Notion, Linear), pair programming platforms, and distributed engineering culture.',
    keywords: ['remote work', 'linear', 'notion', 'async', 'pair programming', 'collaboration'],
    affinityCategoryIds: [55, 57],
  },
  {
    id: 57,
    slug: 'open-source-contribution',
    name: 'Open-source contribution',
    domainId: 'ux-practice',
    domainName: 'UX & Practice',
    description: 'Git workflows, PR etiquette, open-source licensing (MIT, Apache, GPL), community governance, and maintaining OSS libraries.',
    keywords: ['open source', 'git', 'github', 'pull request', 'licensing', 'community'],
    affinityCategoryIds: [32, 55, 56, 10, 9],
  },
];

// Helper functions for taxonomy
export function getDomainById(id: string): CategoryDomain | undefined {
  return DOMAINS.find((d) => d.id === id);
}

export function getCategoryById(id: number): SubCategory | undefined {
  return SUBCATEGORIES.find((c) => c.id === id);
}

export function getCategoryByName(name: string): SubCategory | undefined {
  const lower = name.toLowerCase();
  return SUBCATEGORIES.find(
    (c) => c.name.toLowerCase() === lower || c.slug.toLowerCase() === lower
  );
}

export function getCategoriesByDomain(domainId: string): SubCategory[] {
  return SUBCATEGORIES.filter((c) => c.domainId === domainId);
}

export function getAffinityCategories(categoryId: number): SubCategory[] {
  const cat = getCategoryById(categoryId);
  if (!cat) return [];
  return cat.affinityCategoryIds
    .map((id) => getCategoryById(id))
    .filter((c): c is SubCategory => c !== undefined);
}

export function searchTaxonomy(query: string): SubCategory[] {
  if (!query.trim()) return SUBCATEGORIES;
  const q = query.toLowerCase();
  return SUBCATEGORIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.domainName.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

