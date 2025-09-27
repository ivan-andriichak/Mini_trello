# Mini-Trello 📝

Welcome to Mini-Trello! This is a simplified yet full-featured clone of the popular Trello service, created to demonstrate full-stack development skills. The project allows users to create boards, columns, and cards to organize their tasks, with complete drag-and-drop functionality.

**✨ [Live Demo Link](https://mini-trello-amber.vercel.app/) ✨**


* [Postimages](https://postimg.cc/gallery/3DFWbxX)*

---

## 🚀 Key Features

*   **User Authentication:** A complete registration and login system.
*   **Session Management:** Secure authentication based on JWT (JSON Web Tokens) using `httpOnly` cookies.
*   **Board CRUD:** Create, view, edit, and delete your project boards.
*   **Column CRUD:** Within each board, you can create, edit, and delete columns.
*   **Card CRUD:** Add, edit, and delete tasks in the form of cards.
*   **Drag & Drop:**
    *   Easily drag cards between columns and change their order.
    *   Reorder boards on the main page.
*   **Responsive Design:** The interface displays correctly on both desktop and mobile devices.

---

## 🛠️ Technology Stack

The project is built on a modern and powerful technology stack:

### Frontend

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Drag & Drop:** [`@hello-pangea/dnd`](https://github.com/hello-pangea/dnd)
*   **API Client:** [Axios](https://axios-http.com/)

### Backend

*   **Framework:** [NestJS](https://nestjs.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **Authentication:** [Passport.js](http://www.passportjs.org/) (JWT Strategy)

### Deployment

*   **Frontend:** [Vercel](https://vercel.com/)
*   **Backend:** [Render](https://render.com/)

---

## ⚙️ Running the Project Locally

To run this project on your local machine, follow these steps.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (version 18 or higher)
*   [Git](https://git-scm.com/)
*   A running instance of PostgreSQL

### 1. Clone the Repository

```bash
git clone https://github.com/ivan-andriichak/Mini_trello.git
cd Mini_trello
```

### 2. Set Up and Run the Backend

1.  Navigate to the backend folder and install the dependencies:
    ```bash
    cd backend
    npm install
    ```

2.  Create a `.env` file in the `backend` folder with the following content:

    ```env
    POSTGRES_USER=
    POSTGRES_PASSWORD=
    POSTGRES_DB=
    HOST=localhost

    DATABASE_URL="postgresql://postg:user@localhost:5432/trello_db"

    JWT_SECRET="tftyhi2ghk"
    NODE_ENV=development

    PORT=5000
    ```
    
    \*This file contains all necessary environment variables for local development: PostgreSQL credentials, connection URL, JWT secret, environment, and server port. Adjust values as needed for your setup.*

3.  Apply the database migrations:
    ```bash
    npx prisma migrate dev
    ```

4.  Start the development server:
    ```bash
    npm run start:dev
    ```
    The backend will be available at `http://localhost:5000`.

### 3. Set Up and Run the Frontend

1.  Open a new terminal, navigate to the frontend folder, and install the dependencies:
    ```bash
    cd frontend
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

Now you can open `http://localhost:3000` in your browser and start using the application!