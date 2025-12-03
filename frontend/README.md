# Microplastic Detection System - Frontend

An advanced AI-powered web application for detecting and analyzing microplastics in water samples using computer vision and machine learning.

## Overview

This is the frontend application for the Microplastic Detection System. It provides an intuitive, modern interface for uploading images, visualizing detections, and analyzing results with comprehensive statistics and charts.

## Features

- **AI-Powered Detection**: Advanced computer vision models to identify microplastics in images
- **Real-time Analysis**: Fast and accurate detection with confidence scores
- **Interactive Visualization**: Zoom, pan, and explore detected microplastics with bounding boxes
- **Detailed Analytics**: Comprehensive charts and statistics for detection analysis
- **Export Reports**: Download detailed JSON reports of detections
- **Modern UI/UX**: Beautiful, responsive interface built with React and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React 18** - Modern UI library
- **shadcn/ui** - High-quality component library
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful charting library
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching

## Prerequisites

- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm, yarn, or bun package manager
- Backend API running (see [Backend README](../backend/README.md))

## Getting Started

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Configure environment variables:**
   
   Create a `.env.local` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```
   
   For production, set this to your deployed backend URL.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Charts.tsx       # Chart visualizations
│   │   ├── DetectionTable.tsx # Detection results table
│   │   ├── ImageWithDetections.tsx # Image display with overlays
│   │   ├── StatisticsPanel.tsx # Statistics display
│   │   └── UploadZone.tsx   # File upload component
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Main detection page
│   │   └── NotFound.tsx    # 404 page
│   ├── types/               # TypeScript type definitions
│   │   └── detection.ts     # Detection-related types
│   ├── utils/               # Utility functions
│   │   └── api.ts           # API client functions
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Library utilities
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
│   ├── favicon.ico
│   └── robots.txt
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── vercel.json              # Vercel deployment configuration
```

## Usage

1. **Upload Image**: 
   - Drag and drop an image onto the upload zone, or
   - Click to browse and select an image file
   - Supported formats: JPG, JPEG, PNG, BMP, WEBP
   - Maximum file size: 10MB

2. **View Results**: 
   - Detected microplastics are highlighted with bounding boxes
   - Each detection shows a confidence score
   - Click on detections to view details

3. **Analyze Data**: 
   - View comprehensive statistics panel
   - Explore interactive charts showing detection distribution
   - Review detailed detection table with all results

4. **Export Report**: 
   - Download a comprehensive JSON report of all detections
   - Includes bounding boxes, scores, and metadata

## Environment Variables

### Development

Create a `.env.local` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### Production

Set environment variables in your deployment platform (Vercel, Netlify, etc.):

- `VITE_API_BASE_URL`: Your deployed backend API URL
  - Example: `https://your-api.onrender.com`

**Note**: Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

## Backend Integration

This frontend requires a backend API that provides the following endpoint:

- **POST** `/predict` - Accepts image file and returns detection results

See the [Backend README](../backend/README.md) for backend setup and API documentation.

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

### Code Style

- TypeScript strict mode enabled
- ESLint configured for React and TypeScript
- Prettier formatting (if configured)

## Deployment

### Vercel (Recommended)

This frontend is configured for deployment on Vercel:

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Configure environment variables:
   - `VITE_API_BASE_URL`: Your backend API URL
5. Deploy

See the main project README for detailed deployment instructions.

### Other Platforms

The built `dist` folder can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

## Troubleshooting

### API Connection Issues

- Verify `VITE_API_BASE_URL` is set correctly
- Check that the backend server is running
- Ensure CORS is configured on the backend
- Check browser console for detailed error messages

### Build Errors

- Ensure all dependencies are installed: `npm install`
- Check Node.js version (v18+ required)
- Clear node_modules and reinstall if needed
- Review build logs for specific errors

### Environment Variables Not Working

- Remember: Vite requires `VITE_` prefix
- Restart dev server after changing `.env` files
- In production, set variables in deployment platform
- Variables are embedded at build time, not runtime

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Code splitting for optimal load times
- Lazy loading of components
- Optimized image handling
- Efficient re-renders with React Query

## License

This project is part of a microplastic detection system for environmental research and analysis.

