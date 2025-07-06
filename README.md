# 360 Modern Lander

A modern health insurance lead generation platform built with React, TypeScript, and Material-UI.

## Features

- **Modern UI/UX**: Clean, responsive design with Material-UI components
- **Lead Generation**: Specialized for independent worker health insurance leads
- **Multi-Step Forms**: Guided quote process with validation
- **Responsive Design**: Works seamlessly on desktop and mobile
- **TypeScript**: Full type safety and better development experience
- **Theme System**: Customizable healthcare-focused theme

## Tech Stack

- **Frontend**: React 19, TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router v7
- **Forms**: React Hook Form with Yup validation
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd 360_modern_lander
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── enrollment/     # Lead form components
│   ├── shared/         # Common components
│   └── ...
├── pages/              # Page components
├── theme/              # Material-UI theme configuration
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## Deployment

The application is ready for deployment to Vercel:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform

## License

This project is private and proprietary.
