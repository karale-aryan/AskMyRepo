# Privacy Policy — AskMyRepo

**Last Updated:** September 2026

AskMyRepo ("we", "our", or "the Service") is an open-source AI developer tool designed to index and query GitHub repositories. We respect your privacy and provide this policy to explain our data practices.

---

## 1. Information We Collect

### A. GitHub Account Information
When you authenticate via GitHub OAuth, we receive:
- Your GitHub username, email address, avatar URL, and user ID.
- Access token (encrypted at rest using AES-256) used exclusively to fetch repository metadata, branches, and code files on your explicit request.

### B. Repository Data & Embeddings
- When you index a repository, the service retrieves file paths, signatures, docstrings, and source code chunks.
- Chunks are vectorized using OpenAI embeddings (`text-embedding-3-small`) and stored in a vector index (`pgvector` / ChromaDB).
- **We do not use your source code or private repositories to train foundation AI models.**

### C. Chat & Prompt Queries
- Questions you ask and retrieved context snippets are passed to LLM providers (e.g., OpenAI GPT-4o-mini / Gemini Flash) to generate context-aware answers.

---

## 2. How Your Data Is Protected
- **Encryption at Rest & in Transit:** All network communication is TLS/HTTPS. Secrets and OAuth tokens are AES-256 encrypted in storage.
- **Revocation Anytime:** You can delete your indexed repositories or disconnect your GitHub OAuth at any time from your GitHub Account Settings or the AskMyRepo dashboard. Deleting a repository purges all stored embeddings and chunk data immediately.
- **Zero Training:** Your code snippets are never shared or sold to third parties for model training.

---

## 3. Third-Party Services
AskMyRepo integrates with:
- **GitHub API** for OAuth and repository contents.
- **OpenAI / Google Gemini** for text embeddings and chat completions.
- **Supabase / PostgreSQL** for relational and vector data storage.

---

## 4. Self-Hosting & Open Source
Because AskMyRepo is open-source under the MIT license, you can self-host the entire stack (backend, database, client) on your own infrastructure with complete control over all data retention and network egress.

---

## 5. Contact
For questions or security concerns, open an issue on the [GitHub repository](https://github.com/karale-aryan/AskMyRepo/issues) or reach out to the maintainer [@karale-aryan](https://github.com/karale-aryan).
