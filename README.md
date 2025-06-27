# 🔍 Nexus Search - Premium Media Search Engine

A modern, high-performance video and image search engine with premium UI/UX design. Built with vanilla JavaScript, featuring a sleek dark theme, responsive design, and advanced search capabilities.

## ✨ Features

### 🎯 Core Functionality
- **Dual Search Modes**: Seamlessly switch between image and video search
- **Real-time Results**: Lightning-fast search with instant results
- **Infinite Scroll**: Automatic loading of more results as you scroll
- **Advanced Filtering**: Safe search, results per page, and quality filters
- **Media Preview**: Full-screen modal preview with detailed information

### 🎨 Premium UI/UX
- **Modern Dark Theme**: Elegant dark interface with gradient accents
- **Responsive Design**: Perfect experience across all devices
- **Smooth Animations**: Fluid transitions and hover effects
- **Grid & Masonry Views**: Multiple layout options for browsing
- **Loading States**: Beautiful loading animations and progress indicators

### ⚡ Performance
- **Optimized Loading**: Lazy loading images and efficient API calls
- **Caching System**: Smart caching for improved performance
- **Error Handling**: Graceful error handling with user feedback
- **Accessibility**: Full keyboard navigation and screen reader support

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- API keys for Pixabay and YouTube (see setup instructions)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/AaYuSh11233/Rebirth.git
   cd nexus-search
   \`\`\`

2. **Configure API Keys**
   
   Edit \`script.js\` and replace the placeholder API keys:
   \`\`\`javascript
   this.apis = {
       pixabay: {
           key: 'YOUR_PIXABAY_API_KEY', // Get from https://pixabay.com/api/docs/
           baseUrl: 'https://pixabay.com/api/'
       },
       youtube: {
           key: 'YOUR_YOUTUBE_API_KEY', // Get from Google Cloud Console
           baseUrl: 'https://www.googleapis.com/youtube/v3/search'
       }
   };
   \`\`\`

3. **Serve the application**
   \`\`\`bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   \`\`\`

4. **Open your browser** and navigate to \`http://localhost:8000\`

## 🔧 API Setup

### 🖼️ Image APIs

#### Unsplash API (Primary - High Quality)
1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Create a free account and register your application
3. Get your Access Key (1000 requests/hour free)
4. Replace `YOUR_UNSPLASH_ACCESS_KEY` in the code

#### Pexels API (Backup - Good Quality)
1. Visit [Pexels API](https://www.pexels.com/api/)
2. Create a free account
3. Get your API key (200 requests/hour free)
4. Replace `YOUR_PEXELS_API_KEY` in the code

#### Pixabay API (Fallback - Unlimited Free)
1. Visit [Pixabay API](https://pixabay.com/api/docs/)
2. Create a free account
3. Get your API key (unlimited requests)
4. Replace `YOUR_PIXABAY_API_KEY` in the code

### 🎥 Video APIs

#### YouTube Data API (Primary - Best Video Source)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials (API key)
5. Get 10,000 requests/day free
6. Replace `YOUR_YOUTUBE_API_KEY` in the code

#### Pexels Videos API (Backup)
- Uses the same API key as Pexels Images
- Provides high-quality stock videos

#### Pixabay Videos API (Fallback)
- Uses the same API key as Pixabay Images
- Unlimited free video searches

## 🚀 API Features

### Smart Fallback System
- **Images**: Unsplash → Pexels → Pixabay
- **Videos**: YouTube → Pexels Videos → Pixabay Videos
- Automatic failover if one API is down or rate-limited

### Free Tier Limits
- **Unsplash**: 50 requests/hour (demo), 5000/hour (production)
- **Pexels**: 200 requests/hour
- **Pixabay**: Unlimited requests
- **YouTube**: 10,000 requests/day

### Quality Comparison
- **Unsplash**: Highest quality professional photos
- **Pexels**: High quality stock photos and videos
- **Pixabay**: Good quality with largest free collection
- **YouTube**: Best video content variety

## 🎮 Usage

### Basic Search
1. **Select Search Type**: Choose between Images or Videos
2. **Enter Query**: Type your search terms in the search box
3. **Browse Results**: Scroll through the grid of results
4. **Preview Media**: Click any item to open full-screen preview

### Advanced Features
- **View Modes**: Switch between grid and masonry layouts
- **Settings**: Customize results per page, safe search, and theme
- **Infinite Scroll**: Results load automatically as you scroll
- **Keyboard Shortcuts**: Press Enter to search, Escape to close modals

## 🏗️ Project Structure

\`\`\`
nexus-search/
├── index.html          # Main application structure
├── styles.css          # Complete styling and responsive design
├── script.js           # Core application logic and API integration
└── README.md           # Project documentation
\`\`\`

## 🎨 Customization

### Theme Colors
Modify CSS custom properties in \`styles.css\`:

\`\`\`css
:root {
    --bg-primary: #0a0a0f;           /* Main background */
    --bg-secondary: #1a1a2e;         /* Secondary background */
    --accent-primary: #6366f1;       /* Primary accent color */
    --accent-secondary: #8b5cf6;     /* Secondary accent color */
    --text-primary: #ffffff;         /* Primary text */
    /* ... other variables */
}
\`\`\`

### Search Settings
Adjust default settings in \`script.js\`:

\`\`\`javascript
this.settings = {
    resultsPerPage: 40,    // Number of results per page
    safeSearch: true,      // Enable safe search
    theme: 'dark'          // Default theme
};
\`\`\`

### Layout Options
- **Grid Columns**: Modify \`grid-template-columns\` in \`.results-grid\`
- **Card Sizes**: Adjust \`minmax(280px, 1fr)\` for different card sizes
- **Spacing**: Change \`gap\` values for different spacing

## 📱 Browser Support

- **Chrome**: 80+ ✅
- **Firefox**: 75+ ✅
- **Safari**: 13+ ✅
- **Edge**: 80+ ✅
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+ ✅

## 🔒 Privacy & Security

- **No Data Collection**: No user data is stored or tracked
- **Secure API Calls**: All API requests use HTTPS
- **Safe Search**: Optional safe search filtering
- **No Cookies**: No tracking cookies or analytics

## ⚡ Performance Features

- **Lazy Loading**: Images load only when visible
- **Debounced Search**: Prevents excessive API calls
- **Efficient Rendering**: Virtual scrolling for large result sets
- **Caching**: Smart caching of search results
- **Optimized Images**: Responsive image loading

## 🎯 Technical Highlights

- **Modern JavaScript**: ES6+ features with clean, maintainable code
- **CSS Grid & Flexbox**: Advanced layout techniques
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliant
- **Performance**: Optimized for speed and efficiency

---

**Built with ❤️ and modern web technologies**

*Experience the future of media search!* 🚀
