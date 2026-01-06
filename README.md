# CYNOMESH - Autonomous Agent IDE

An enterprise-grade IDE for building and managing autonomous agent frameworks, distributed intelligence layers, and AI-driven infrastructure.

## 🚀 Features

- **Autonomous Agent Orchestration**: Design and manage distributed agent swarms.
- **Distributed Intelligence**: Optimize LLM routing and latency across geo-distributed layers.
- **Visual Model Builder**: Design AI architectures using a drag-and-drop interface.
- **Automated Infrastructure Remediation**: Built-in SRE agents for automated fixes.
- **Sandbox Environment**: Execute agent code in secure, isolated runtimes.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, React Flow, Recharts.
- **Backend**: Node.js, Express, Prisma (SQLite), JWT Authentication.
- **CI/CD**: GitHub Actions for automated builds.

## 🏁 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/zerocalce/effective-fishstick.git
   cd effective-fishstick
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   npx prisma db push
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the IDE**:
   Open **[http://localhost:5173](http://localhost:5173)** in your browser for local development.

## 🌐 Deployment

### Backend (Render)
The backend is live on Render at **[https://ai-studio-ide-backend.onrender.com](https://ai-studio-ide-backend.onrender.com)**.
1. It is configured via `render.yaml` for automated deployments.
2. **Environment Variables**: The `STUDIO_API_KEY` (currently using `exs-d5e7kgfgi27c73981tmg`) is pre-configured to enable AI features.
3. The database uses Prisma with SQLite for simplicity in this demo.

### Frontend (Netlify)
The frontend is ready for deployment to Netlify.
1. It uses `netlify.toml` to proxy `/api/*` requests to the Render backend.
2. To update the backend endpoint, simply modify the `to` field in `netlify.toml`.
3. Once you deploy, Netlify will generate a **unique URL** for your site (e.g., `https://your-site-name.netlify.app/`).

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/zerocalce/effective-fishstick)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📫 Contact

**Aldrin Reyes**
- **Portfolio**: [localhost:5173](http://localhost:5173)
- **Email**: herocalze11@gmail.com
- **GitHub**: [@zerocalce](https://github.com/zerocalce)
- **Facebook**: [Aldrin Reyes](https://www.facebook.com/profile.php?id=100095179577581)
