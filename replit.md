# Overview

Arduino Blocks Kids is a visual programming environment that allows children to create Arduino programs using drag-and-drop blocks instead of writing code directly. The application provides a kid-friendly interface with colorful blocks representing different Arduino functions (LEDs, sensors, controls, etc.) that can be assembled like puzzle pieces to build complete programs. The blocks automatically generate proper Arduino C++ code that can be uploaded to connected Arduino boards.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built as a single-page React application using TypeScript and Vite for development tooling. The UI framework leverages Radix UI components with shadcn/ui styling for a polished interface, combined with Tailwind CSS for responsive design and kid-friendly theming.

**Key Design Decisions:**
- **Wouter for routing**: Lightweight client-side routing without the complexity of React Router
- **Tanstack React Query**: Handles server state management and caching for API calls
- **Component-based architecture**: Modular components for BlockPalette, WorkspaceArea, CodePanel, and UI elements
- **Kid-friendly design system**: Custom CSS variables and color palette designed for children with playful gradients and large interactive elements

## Backend Architecture
The backend follows a Node.js/Express REST API pattern with WebSocket support for real-time features. The server is structured with clear separation between routing, storage, and business logic.

**Key Design Decisions:**
- **Express.js framework**: Mature and well-documented web framework for Node.js
- **WebSocket integration**: Real-time communication for Arduino upload status and port scanning
- **Middleware-based request handling**: Centralized logging and error handling
- **Memory storage with interface abstraction**: Allows easy migration to persistent storage later

## Data Storage Solutions
Currently implements in-memory storage with a well-defined interface that abstracts storage operations. The schema is designed with Drizzle ORM for future PostgreSQL integration.

**Storage Strategy:**
- **Interface-based design**: `IStorage` interface allows swapping storage implementations
- **Drizzle ORM schema**: PostgreSQL-ready schema definitions in shared directory
- **Type-safe operations**: Full TypeScript integration with Zod validation schemas

## Authentication and Authorization
No authentication system is currently implemented, as the application is designed for local/educational use. The architecture supports adding authentication later through middleware patterns.

## Real-time Communication
WebSocket server handles real-time features including Arduino code uploads, port scanning, and status updates. The client uses a custom `useWebSocket` hook for connection management and automatic reconnection.

**WebSocket Features:**
- Upload progress tracking
- Arduino board detection
- Serial monitor simulation
- Automatic reconnection on connection loss

## Code Generation System
A custom Arduino code generator converts visual blocks into valid Arduino C++ code. The system maintains block relationships and generates properly structured setup() and loop() functions.

**Generation Strategy:**
- Block-to-code mapping with type safety
- Dependency injection for pin management
- Template-based code structure
- Real-time code preview as blocks are manipulated

# External Dependencies

## Database Technology
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless environments
- **connect-pg-simple**: Session store for PostgreSQL (prepared for future authentication)

## UI Framework & Styling
- **Radix UI**: Headless component library providing accessible, customizable UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Pre-built component system based on Radix UI with consistent styling
- **Lucide React**: Comprehensive icon library

## State Management & Data Fetching
- **Tanstack React Query**: Server state management with caching, synchronization, and background updates
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation library for type-safe data validation

## Development & Build Tools
- **Vite**: Fast build tool and development server with HMR support
- **TypeScript**: Static type checking for improved developer experience
- **ESBuild**: Fast JavaScript bundler for production builds

## Visual Programming
- **Blockly**: Google's visual programming library (referenced but not fully integrated)
- **Custom block system**: Proprietary drag-and-drop interface designed for Arduino programming

## Real-time Communication
- **WebSocket (ws)**: Native WebSocket implementation for real-time Arduino communication
- **Custom WebSocket hooks**: React hooks for connection management and message handling

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & class-variance-authority**: Conditional CSS class management
- **nanoid**: Unique ID generation for components and blocks

## Arduino Integration
- **Custom Arduino code generator**: Converts visual blocks to Arduino C++ code
- **Serial communication simulation**: Mock serial monitor for educational purposes
- **Port scanning**: Simulated Arduino board detection and connection management