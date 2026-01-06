# Cynomesh AI Studio - Effective Fishstick

An enterprise-grade IDE for building and managing autonomous agent frameworks, distributed intelligence layers, and AI-driven infrastructure.

**[🌐 Live Demo](https://comfy-daifuku-80d504.netlify.app/)**

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
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌐 Deployment

### Backend (Render)
The backend is ready for deployment on Render.
1. Create a new **Blueprint** on Render.
2. Connect this GitHub repository.
3. Render will automatically detect the `render.yaml` file and set up the service.
4. Once deployed, copy your service URL (e.g., `https://ai-studio-ide-backend.onrender.com`).
5. **Environment Variables**: The `STUDIO_API_KEY` (currently using `exs-d5e7kgfgi27c73981tmg`) is pre-configured in `render.yaml` to enable AI features.

### Frontend (Netlify)
The frontend is configured for easy deployment to Netlify. 
1. Connect your GitHub repository to Netlify.
2. Set the **Base directory** to `frontend`.
3. Set the **Build command** to `npm run build`.
4. Set the **Publish directory** to `frontend/dist`.
5. The project uses a proxy for API calls. Update the `to` field in `netlify.toml` with your Render backend URL.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/zerocalce/effective-fishstick)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📫 Contact

**Aldrin Reyes**
- **Portfolio**: [comfy-daifuku-80d504.netlify.app](https://comfy-daifuku-80d504.netlify.app)
- **Email**: herocalze11@gmail.com
- **GitHub**: [@zerocalce](https://github.com/zerocalce)
- **Facebook**: [Aldrin Reyes](https://www.facebook.com/profile.php?id=100095179577581)
