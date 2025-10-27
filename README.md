# 🦊 Fox Photo Gallery - Project 1

A modern, responsive photo gallery web application built with Lit and Web Components for Week 9 coursework.

## ✨ Features

### Required Features
- ✅ **Design System (DDD)** - Uses design tokens and CSS custom properties
- ✅ **JSON API Endpoint** - Loads 50 images from local JSON file
- ✅ **HAX Webcomponent Tooling** - Built with Lit and modern web standards
- ✅ **Vercel Deployment** - Ready for deployment with vercel.json
- ✅ **Mobile Responsive** - Adaptive grid layout for all screen sizes
- ✅ **Dark Mode Support** - Automatic dark mode using prefers-color-scheme
- ✅ **Lazy Loading** - Images load conditionally with IntersectionObserver
- ✅ **Rich Data Structure** - Each photo includes name, date, thumbnail, full size, and author info
- ✅ **Local Storage** - Persists user likes/dislikes across sessions
- ✅ **Share Functionality** - Web Share API with clipboard fallback

### Additional Features
- Smooth animations and transitions
- Loading states and error handling
- Accessible markup and ARIA labels
- Performance optimized

## 📋 Data Structure

Each photo in `api/photos.json` includes:
- `id` - Unique identifier
- `name` - Photo title
- `dateTaken` - Date the photo was taken
- `thumbnail` - Thumbnail image URL
- `fullSize` - Full-size image URL
- `author` - Object containing:
  - `name` - Author name
  - `image` - Author avatar
  - `userSince` - Member since date
  - `channel` - Channel/gallery name

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Development
The dev server will start at http://localhost:8000 with hot reload enabled.

## 🏗️ Project Structure

```
photo-gallery-project/
├── api/
│   └── photos.json          # 50 photo entries with full metadata
├── src/
│   ├── photo-card.js        # Individual photo card component
│   └── photo-gallery.js     # Gallery container with fetch & lazy loading
├── index.html               # Main entry point
├── package.json             # Dependencies and scripts
├── vercel.json              # Vercel deployment config
├── rollup.config.js         # Production build config
└── README.md                # This file
```

## 🎨 Components

### `<photo-gallery>`
Main container component that:
- Fetches photos from JSON API
- Implements IntersectionObserver for lazy loading
- Renders responsive grid layout
- Handles loading and error states

### `<photo-card>`
Individual photo card that:
- Displays photo with author information
- Supports like/dislike reactions
- Persists reactions to localStorage
- Implements share functionality
- Conditionally renders images when visible

## 📱 Responsive Breakpoints

- **Desktop**: 3-4 columns (300px min per card)
- **Tablet** (< 768px): 2-3 columns (250px min per card)
- **Mobile** (< 480px): Single column, full width

## 🌙 Dark Mode

Automatically responds to system preferences using `prefers-color-scheme: dark`. All components include dark mode color schemes with appropriate contrast ratios.

## 🔧 Technologies Used

- **Lit** - Fast, lightweight web components
- **Web Components** - Native browser APIs
- **IntersectionObserver** - Lazy loading implementation
- **Local Storage** - Persistent user preferences
- **Web Share API** - Native sharing with fallback
- **CSS Grid** - Responsive layouts
- **CSS Custom Properties** - Design tokens

## 📦 Deployment

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

The project includes `vercel.json` for automatic configuration.

## 🎯 Project Requirements Checklist

- [x] Uses Design System (DDD) with design tokens
- [x] Loads multiple images from single JSON endpoint
- [x] Created using HAX webcomponent CLI/tooling (Lit)
- [x] Has working demo on Vercel
- [x] Mobile responsive with breakpoints
- [x] Supports dark mode
- [x] Loads 50 images from API
- [x] Media loads conditionally (IntersectionObserver)
- [x] API supports required data structure
- [x] Cards display images, author details, and interactions
- [x] Implements like/dislike/share functionality
- [x] Stores preferences in local storage

## 📝 Assignment Context

**Course**: Week 9 - Project 1  
**Duration**: 3 weeks (assignment to deliverable)  
**Check-ins**: 2 required before final submission

### Check-in 1 Requirements
- [x] Use randomfox.ca API for initial learning
- [x] Design interface for multiple photos
- [x] Implement data loading from API
- [x] Create gallery presentation structure

## 🙏 Credits

- Fox images from [randomfox.ca](https://randomfox.ca/)
- Avatar images from [pravatar.cc](https://pravatar.cc/)
- Built with [Lit](https://lit.dev/)

## 📄 License

MIT License - feel free to use this for learning purposes!
