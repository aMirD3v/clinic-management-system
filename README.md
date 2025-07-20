# Clinic Management System

This is a full-stack web application for managing a university clinic. It provides different interfaces for various roles within the clinic, including reception, nurses, doctors, laboratory technicians, and pharmacy staff.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [Radix UI](https://www.radix-ui.com/)
*   **Database ORM**: [Prisma](https://www.prisma.io/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
*   **Form Management**: [React Hook Form](https://react-hook-form.com/)
*   **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

## Features

*   **Role-Based Access Control**: Different users have different permissions based on their roles.
*   **Reception**:
    *   Search for students by ID.
    *   Register new patient visits.
*   **Nurse**:
    *   View a list of patients waiting for vital signs to be taken.
    *   Record vital signs (blood pressure, temperature, pulse, weight).
    *   Send patients to the doctor.
*   **Doctor**:
    *   View a list of patients ready for consultation.
    *   View patient information, vital signs, and lab results.
    *   Submit a diagnosis and prescription.
    *   Request lab tests.
*   **Laboratory**:
    *   View a list of pending lab requests.
    *   Submit lab results.
*   **Pharmacy**:
    *   (Placeholder for pharmacy functionality)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v20 or later)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd clinic-management-system
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following:
    ```
    DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="<your-secret>"
    ```

4.  **Run database migrations:**
    ```bash
    npx prisma migrate dev
    ```

5.  **Seed the database:**
    ```bash
    npx prisma db seed
    ```

6.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Project Structure

*   `app/`: Contains the main application code, including pages and API routes.
*   `components/`: Contains reusable React components.
*   `lib/`: Contains helper functions, database client, and authentication configuration.
*   `prisma/`: Contains the database schema, migrations, and seed script.
*   `public/`: Contains static assets like images and fonts.
*   `types/`: Contains TypeScript type definitions.

## API Endpoints

*   `POST /api/auth/...`: Handles user authentication.
*   `POST /api/clinic/reception/visits`: Creates a new visit.
*   `GET /api/clinic/nurse/visits`: Fetches visits waiting for a nurse.
*   `POST /api/clinic/nurse/submit/[visitId]/nurse-note`: Submits a nurse's notes.
*   `GET /api/clinic/doctor/visits`: Fetches visits ready for a doctor.
*   `POST /api/clinic/doctor/[id]`: Submits a doctor's diagnosis.
*   `GET /api/clinic/laboratory/visits`: Fetches visits sent to the lab.
*   `POST /api/clinic/laboratory/submit/[id]`: Submits lab results.
*   `GET /api/students/[id]`: Fetches student information.

## Deployment

To create a production build, run the following command:
```bash
npm run build
```
Then, start the production server:
```bash
npm run start
```

## Linting

To run the linter, use the following command:
```bash
npm run lint
```# clinic-management-system
