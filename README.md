<div align="center">

# 📋 Chira

### A Modern SCRUM Project Management Tool

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Bun](https://img.shields.io/badge/Bun.js-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)
[![Clerk](https://img.shields.io/badge/Clerk-purple?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.dev/)
[![Convex](https://img.shields.io/badge/Convex-FF8C00?style=for-the-badge&logo=convex&logoColor=white)](https://www.convex.dev/)

[Demo](#) · [Features](#-core-features) · [Tech Stack](#%EF%B8%8F-technology-stack) · [Architecture](#-technical-implementation)

</div>

## 🎯 Project Overview

Chira simplifies the SCRUM process by focusing on essential features needed for sprint planning and ticket tracking. Built with a modern tech stack, it demonstrates real-time updates, user authentication, and responsive design principles.

## 🌟 Key Highlights

```mermaid
graph LR
    A[Real-time Updates] --> D[Modern UI/UX]
    B[SCRUM Management] --> D
    C[User Authentication] --> D
    D --> E[Optimized Performance]
```

## 🛠️ Technology Stack

<div align="center">

| Category    | Technology | Purpose                                          |
| ----------- | ---------- | ------------------------------------------------ |
| 🔥 Frontend | Next.js    | Server-side rendering, routing, React components |
| ⚡ Runtime  | Bun        | JavaScript runtime and tooling                   |
| 🔒 Auth     | Clerk      | User authentication and management               |
| 🚀 Backend  | Convex     | Real-time data sync and backend functions        |

</div>

## ✨ Core Features

### 📅 Sprint Management

- Sprint creation and planning
- Backlog management
- Sprint timeline tracking

### 🎫 Ticket System

- Create and manage user stories
- Track ticket status and progress
- Assign tickets to team members

### 📊 SCRUM Board

- Kanban-style board visualization
- Drag-and-drop functionality
- Real-time updates across all users

## 🏗️ Architecture

```mermaid
graph TD
    A[Client Browser] -->|Next.js| B[Frontend Layer]
    B -->|API Calls| C[Convex Backend]
    B -->|Auth| D[Clerk Service]
    C -->|Data Storage| E[Convex Database]
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#dfd,stroke:#333,stroke-width:2px
    style D fill:#fdd,stroke:#333,stroke-width:2px
    style E fill:#ddf,stroke:#333,stroke-width:2px
```

### 📁 Project Structure

```
chira/
├── 📱 app/              # Next.js app router and pages
├── 🧩 components/       # React components
├── ⚙️ convex/          # Backend functions and schema
├── 🔧 lib/             # Utility functions
├── 📂 public/          # Static assets
└── 🎨 styles/          # Styling files
```

## 💡 Design Decisions

- **Performance First**: Built with Next.js for optimal loading and SEO
- **Real-time Sync**: Leveraged Convex for instant data updates
- **Security**: Implemented Clerk for robust authentication
- **Developer Experience**: Utilized Bun for enhanced development

## 🚧 Project Status & Roadmap

```mermaid
gantt
    title Development Phases
    dateFormat  YYYY-MM-DD
    section Core Features
    Sprint Management     :done
    Ticket System        :active
    SCRUM Board          :active
    section Future
    Analytics Dashboard  :pending
    Team Collaboration   :pending
```

## 🤝 Connect With Me

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](#)
[![Portfolio](https://img.shields.io/badge/Portfolio-%23000000.svg?style=for-the-badge&logo=firefox&logoColor=#FF7139)](#)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](#)

</div>

---

<div align="center">

_Built with ❤️ and modern web technologies_

</div>
