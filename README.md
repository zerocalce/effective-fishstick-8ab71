# AI Studio IDE - Effective Fishstick

An advanced AI development environment with a visual builder, dataset manager, and automated deployment pipelines.

## 🚀 Features

- **Visual Model Builder**: Design AI architectures using a drag-and-drop interface.
- **Dataset Management**: Upload, explore, and preprocess datasets for training.
- **Automated Deployments**: Deploy models to various cloud platforms with one click.
- **AI Assistant**: Built-in NLP assistant to help with code, debugging, and platform guidance.
- **Sandbox Environment**: Execute code in secure, isolated runtimes.

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

## 📄 License

This project is licensed under the MIT License.
