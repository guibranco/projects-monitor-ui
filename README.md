# ⚙️ Projects Monitor UI 🔔

[Live Demo](https://guilherme.stracini.com.br/projects-monitor-ui/)

A **modern, centralized dashboard UI** for monitoring and managing the health and status of GitHub repositories, personal projects, and infrastructure.
This repository contains the **frontend only** – it connects to a backend API (previously bundled in the original Projects Monitor project) to provide a clean, interactive interface.

---

## 🌟 Features

### GitHub Integration

* View pending and open pull requests.
* Monitor issues across repositories.
* Track webhook activity.
* Highlight workflow runs, emphasizing failures.
* Track API usage and latest releases for selected projects.

### Infrastructure Health

* View domain lifecycle, DNS, and registrar info (expiration, transfer status).
* Monitor health checks from services like **HealthChecks.io**, **UpTimeRobot**, **AppVeyor CI**, **GitHub Actions**, and more.
* Retrieve **CloudAMQP** stats: queues, messages, consumers, and connections.

### Logs & Errors

* Aggregate error logs from the filesystem and SQL tables.
* Analyze logs with detailed statistics and grouping options.

### Continuous Integration & VPN

* Display **AppVeyor CI** build statuses.
* Monitor **WireGuard VPN** clients and connection status.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons
* **Routing & State:** React Router, i18next for translations
* **Build Tool:** Vite
* **Linting:** ESLint with React Hooks plugin

**Dependencies Highlight from `package.json`:**

```json
"dependencies": {
  "i18next": "^26.0.4",
  "lucide-react": "^1.8.0",
  "react": "^19.2.5",
  "react-dom": "^19.2.5",
  "react-i18next": "^17.0.2",
  "react-router-dom": "^7.14.0"
}
```

---

## ⚡ Getting Started

### Prerequisites

* Node.js ≥ 20
* npm or yarn
* Backend API from the original Projects Monitor project

### Installation

```bash
git clone https://github.com/yourusername/projects-monitor-ui.git
cd projects-monitor-ui
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 🌐 Localization

Fully integrated **i18next** support for multilingual dashboards. Translate strings in `src/locales`.

---

## 📌 Notes

This UI **requires the backend API** to be functional. It only handles the frontend experience: displaying data, filtering, and visualization.
The original combined Projects Monitor project included both frontend and backend.

---

## 🖼️ Preview

![Projects Monitor UI](https://guilherme.stracini.com.br/projects-monitor-ui/preview.png)
*Live version:* [projects-monitor-ui](https://guilherme.stracini.com.br/projects-monitor-ui/)

---

## 📝 License

MIT © Guilherme Stracini

---
