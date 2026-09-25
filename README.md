# AskMyRepo 🔍💬

> **Chat with any GitHub repository like it's your teammate.** Instant codebase navigation, semantic vector search, AST symbol chunking, and verifiable source citations.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)](https://spring.io/projects/spring-boot)
[![pgvector](https://img.shields.io/badge/pgvector-PostgreSQL-336791.svg)](https://github.com/pgvector/pgvector)

---

## 🌟 Key Features

- ⚡ **Instant Codebase Q&A:** Ask complex questions about architecture, control flows, endpoints, and refactoring without reading thousands of lines manually.
- 🎯 **Verifiable Line-by-Line Citations:** Every single answer links directly to the exact file and lines on GitHub (`file.go#L42-L88`). Zero hallucinations left unchecked.
- 🧠 **AST-Aware Semantic Chunking:** Code is parsed respecting function boundaries, classes, types, and docstrings instead of arbitrary character splitting.
- 🔒 **Enterprise-Grade Security:**
  - 100% Zero-Model-Training policy.
  - AES-256 encrypted OAuth token storage.
  - Instant one-click repository data revocation.
- 🚀 **Full Self-Hosting Ready:** Run AskMyRepo on your own infrastructure or cloud with Docker Compose.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons |
| **Backend** | Java 21, Spring Boot 3, Spring Security OAuth2, Spring AI / LangChain4j |
| **Vector DB** | PostgreSQL with `pgvector` / ChromaDB |
| **Embeddings & LLMs** | OpenAI (`text-embedding-3-small`, `gpt-4o-mini`), Google Gemini |
| **Source Integration**| GitHub REST & GraphQL APIs |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** (v18+) & **npm**
- **Java 21 JDK** & **Maven**
- **PostgreSQL** with `pgvector` extension enabled (or Docker)
- **GitHub OAuth App** credentials ([create one here](https://github.com/settings/developers))

### 2. Configure Environment Variables

**Backend (`backend/src/main/resources/application.yml` or `.env`):**
```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/askmyrepo
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
OPENAI_API_KEY=your_openai_api_key
```

**Frontend (`client/.env.local`):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Run with Docker Compose
```bash
docker-compose up -d
```

### 4. Or Run Manually

```bash
# Start Backend (Spring Boot)
cd backend
./mvnw spring-boot:run

# Start Frontend (Next.js)
cd client
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Security & Privacy

Read our complete policies:
- [Privacy Policy](PRIVACY.md)
- [Terms of Service](TERMS.md)

---

## 📄 License

Licensed under the [MIT License](LICENSE).
Built with ❤️ by [@karale-aryan](https://github.com/karale-aryan).
