# Geek Project

## Project Overview

This is a React-based web application built with Refine framework that displays and manages albums, photos, and users data from JSONPlaceholder API.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation

Follow these steps to set up and run the project:

1. **Unzip the project folder**

2. **Navigate to the project directory**

   ```
   cd Geek/Front-end
   ```

3. **Install dependencies**

   ```
   npm install
   ```

## Running the Application

1. **Start the development server**

   ```
   npm run dev
   ```

2. **Open the application in your browser**
   The application will automatically open in your default browser at [http://localhost:5173]

## Project Structure

- `/src` - Contains the source code
  - `/pages` - React components for different pages
  - `/components` - Reusable React components
  - `/hooks` - Custom React hooks
  - `/styles` - CSS/SCSS modules for styling
  - `/assets` - Static assets like images, fonts, and icons
  - `/routes` - Route definitions and navigation configuration

## Features

- Album listing with pagination
- Photo gallery view
- User profiles
- Responsive design using Ant Design components

## Technologies Used

- React
- Refine (React Query + Ant Design)
- React Router for navigation
- Axios for API requests
- Ant Design for UI components
- CSS Modules for styling

## API Integration

The application fetches data from JSONPlaceholder API:

- Albums: https://jsonplaceholder.typicode.com/albums
- Photos: https://jsonplaceholder.typicode.com/photos
- Users: https://jsonplaceholder.typicode.com/users
