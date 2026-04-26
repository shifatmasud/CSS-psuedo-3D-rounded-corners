# 3D CSS Card

A fully responsive, interactive 3D UI card component built with React, Framer Motion, and Tailwind CSS. This project explores pure CSS 3D transforms to create a volumetric card complete with thickness, dynamic lighting, and beautifully approximated 3D rounded corners. 

## Features

- **Interactive 3D Tilt**: Physics-based tilting using Framer Motion springs (`useSpring`, `useMotionValue`) that tracks mouse and touch movements.
- **Volumetric Rendering**: Creates a true 3D object using purely CSS `transformStyle: preserve-3d` and individual HTML planes for the front, back, and sides.
- **Approximated Rounded Corners**: Uses an advanced procedural technique to map dynamically intersecting flat planes around the border radius to simulate smooth 3D corners without WebGL.
- **Dynamic Lighting Model**: Includes a procedural 2D lighting model that shades the 3D sides according to a virtual light source to add depth and realism to the volume.
- **Responsive & Touch-Friendly**: Fully supports mobile touch events and gracefully scales to viewport sizes.

## Technology Stack

- [React 19](https://react.dev/)
- [Framer Motion](https://motion.dev/) (for physics and animations)
- [Tailwind CSS 4](https://tailwindcss.com/) (for styling and gradients)
- [Vite](https://vitejs.dev/) (for fast development and building)

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository and navigate into the project directory.
2. Install the dependencies:

```bash
npm install
```

### Running the Development Server

Start the Vite development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the 3D card.

### Building for Production

To create a production-optimized build:

```bash
npm run build
```

The optimized assets will be generated in the `dist` folder, which can be served using any static file server or deployed to your hosting provider of choice.

## Design Details

The 3D card goes beyond simple `rotateX` and `rotateY` transforms. It calculates the necessary angles (`APOTHEM`, `SEGMENTS`, `STEP`) to algorithmically plot numerous tiny side-planes, simulating the curve of a border-radius in three-dimensional CSS space. This creates an effect that typically requires WebGL, constructed entirely out of standard DOM elements.
