# 📚 QuizMentor Project Tech Stack Documentation

## 🔧 Development Tools Overview

| Category                  | Tool                                                                       | Purpose                                                                        |
| ------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Framework**             | [Next.js](https://nextjs.org/)                                             | Full-stack React framework with routing, API routes, and server-side rendering |
| **Styling**               | [Tailwind CSS](https://tailwindcss.com/)                                   | Utility-first CSS framework for fast UI design                                 |
|                           | [ShadCN UI](https://ui.shadcn.dev/)                                        | Pre-built, customizable component library built on Tailwind & Radix            |
| **ORM / DB**              | [Prisma](https://www.prisma.io/)                                           | Type-safe database toolkit for PostgreSQL                                      |
| **Database**              | [PostgreSQL](https://www.postgresql.org/)                                  | Relational database system used to store app data                              |
| **Authentication**        | [Supabase Auth](https://supabase.com/)                                     | Authentication provider (alternative: NextAuth.js)                             |
| **AI Integration**        | [OpenAI GPT-4o](https://platform.openai.com/)                              | For question generation, explanations, and study suggestions                   |
|                           | [Claude AI](https://claude.ai) _(optional)_                                | For document-based AI features like generating quizzes from notes              |
| **Containerization**      | [Docker](https://www.docker.com/)                                          | Package the app and DB into containers                                         |
|                           | [Docker Compose](https://docs.docker.com/compose/)                         | Run app + DB containers together                                               |
| **API Testing**           | [Postman](https://www.postman.com/) / [Hoppscotch](https://hoppscotch.io/) | Test REST APIs                                                                 |
| **Editor**                | [VS Code](https://code.visualstudio.com/)                                  | Primary code editor with helpful extensions                                    |
| **Version Control**       | [Git](https://git-scm.com/) + [GitHub](https://github.com/)                | Code versioning and collaboration                                              |
| **Deployment (Frontend)** | [Vercel](https://vercel.com/)                                              | Deploy and host the Next.js frontend                                           |
| **Deployment (Backend)**  | [Railway](https://railway.app/) / [Render](https://render.com/)            | Host PostgreSQL and backend API                                                |

## 🎨 Theming System

### Light Mode (Default)

| Element             | Color   | Hex Code |
| ------------------- | ------- | -------- |
| Background          | #16161a |
| Headline            | #fffffe |
| Paragraph           | #94a1b2 |
| Button              | #7f5af0 |
| Button Text         | #fffffe |
| Illustration Stroke | #010101 |
| Main                | #fffffe |
| Highlight           | #7f5af0 |
| Secondary           | #72757e |
| Tertiary            | #2cb67d |

### Dark Mode

| Element             | Color   | Hex Code |
| ------------------- | ------- | -------- |
| Background          | #fffffe |
| Headline            | #2b2c34 |
| Paragraph           | #2b2c34 |
| Button              | #6246ea |
| Button Text         | #fffffe |
| Illustration Stroke | #2b2c34 |
| Main                | #fffffe |
| Highlight           | #6246ea |
| Secondary           | #d1d1e9 |
| Tertiary            | #e45858 |

### Implementation Notes

- **Theme Provider**: Next.js context for theme switching
- **CSS Variables**: Tailwind CSS custom properties for consistent theming
- **System Preference**: Auto-detect user's system theme preference
- **Manual Toggle**: User-controlled theme switching
- **Persistent Storage**: Save theme preference in localStorage

## 🧩 Optional Tools / Future Enhancements

| Tool                                 | Purpose                                  |
| ------------------------------------ | ---------------------------------------- |
| **Framer Motion**                    | For smooth UI animations                 |
| **Zod / Yup**                        | Input validation for forms and APIs      |
| **Jest** + **React Testing Library** | Unit and UI testing                      |
| **pgAdmin / DBeaver**                | GUI tools to manage PostgreSQL           |
| **Notion / Trello**                  | Documentation, task management, planning |
| **Figma / Penpot**                   | UI/UX design, wireframing                |
| **Lucidchart / Whimsical**           | Diagrams, ERD, system architecture       |

## ✅ Notes for Future Use

- Folder structure will be component-driven (Next.js App Router layout)
- AI API keys should be stored in `.env` for security
- Manage Prisma with `npx prisma migrate dev`
- Start local dev easily with Docker:
  ```bash
  docker-compose up --build
  ```
