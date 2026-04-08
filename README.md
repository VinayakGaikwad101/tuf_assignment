# TUF Assignment: Context-Aware Scheduler

This project is an interactive calendar application that implements Generative UI principles. It bridges the gap between aesthetics and utility by dynamically extracting design systems from high-resolution imagery and providing a focused, per-date note-taking experience.

## The Core Concept

Most applications rely on static dark or light modes. This application utilizes a Native Canvas Extraction Engine. When the header image is randomized, the system:

1.  Draws the image onto a hidden 1x1 pixel canvas.
2.  Extracts the average color data of the entire image.
3.  Processes the data through a Relative Luminance Algorithm to ensure accessibility.
4.  Updates the global CSS variables, including primary accents, notebook line colors, and hover states to synchronize with the image.

## Tech Stack

- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS
- Animations: Framer Motion
- Date Logic: date-fns
- Icons: Lucide React

## Features

- Dynamic Theming: Utilizes native Web APIs for color extraction, avoiding the overhead and compatibility issues of external libraries.
- Per-Date Persistence: Notes are stored in LocalStorage using a YYYY-MM-DD mapping strategy.
- Smart Range Selection: Implements logic to automatically swap start and end dates if selected out of chronological order.
- Month Summary: An aggregate view that parses storage to display all notes for the current month in a single list.
- Responsive Design: Optimized for both mobile and desktop viewports.

## Local Setup

### 1\. Clone the repository

git clone [https://github.com/your-username/tuf-assignment.git](https://www.google.com/search?q=https://github.com/your-username/tuf-assignment.git)
cd tuf-assignment

### 2\. Install dependencies

npm install

### 3\. Run the development server

npm run dev

Open http://localhost:3000 in your browser to view the application.

## Architectural Choices

### Data Persistence

LocalStorage was chosen to ensure zero-latency data retrieval and a setup-free experience for reviewers. This removes the need for external API keys or database migrations while maintaining data across browser sessions.

### Native Canvas API

By leveraging the native HTML5 Canvas API for color extraction, the application avoids common bundling errors associated with older libraries in modern environments like Turbopack. This approach results in a smaller bundle size and higher reliability.

### Validation Logic

The date selection handler includes a "Smart Swap" mechanism. If a user selects a range where the second click is chronologically earlier than the first, the state is automatically corrected. This ensures the application logic remains consistent and prevents UI errors.

Submitted for the TUF Assignment.
