class NexusSearch {
  constructor() {
    this.currentSearchType = "images"
    this.currentQuery = ""
    this.currentPage = 1
    this.isLoading = false
    this.hasMoreResults = true
    this.results = []

    // Free API Configuration - No keys required for most
    this.apis = {
      unsplash: {
        baseUrl: "https://api.unsplash.com/search/photos",
        accessKey: "YOUR_UNSPLASH_ACCESS_KEY", // Get free key from unsplash.com/developers
        perPage: 30,
      },
      pexels: {
        baseUrl: "https://api.pexels.com/v1/search",
        videoUrl: "https://api.pexels.com/videos/search",
        apiKey: "YOUR_PEXELS_API_KEY", // Get free key from pexels.com/api
        perPage: 30,
      },
      pixabay: {
        baseUrl: "https://pixabay.com/api/",
        videoUrl: "https://pixabay.com/api/videos/",
        key: "YOUR_PIXABAY_API_KEY", // Get free key from pixabay.com/api/docs/
        perPage: 30,
      },
      youtube: {
        baseUrl: "https://www.googleapis.com/youtube/v3/search",
        key: "YOUR_YOUTUBE_API_KEY", // Get free key from Google Cloud Console
        maxResults: 25,
      },
    }

    this.settings = {
      resultsPerPage: 30,
      safeSearch: true,
      theme: "dark",
    }

    this.init()
  }

  init() {
    this.bindEvents()
    this.loadSettings()
    this.hideLoadingScreen()
  }

  bindEvents() {
    // Search functionality
    document.getElementById("searchBtn").addEventListener("click", () => this.performSearch())
    document.getElementById("searchInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.performSearch()
    })

    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.switchSearchType(e.target.dataset.type))
    })

    // View options
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.switchView(e.target.dataset.view))
    })

    // Load more
    document.getElementById("loadMoreBtn").addEventListener("click", () => this.loadMoreResults())

    // Infinite scroll
    window.addEventListener("scroll", () => this.handleScroll())

    // Modal controls
    document.getElementById("settingsBtn").addEventListener("click", () => this.openSettings())
    document.getElementById("themeBtn").addEventListener("click", () => this.toggleTheme())

    // Modal close events
    document.querySelectorAll(".modal-overlay, .modal-close").forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target === el) this.closeModal()
      })
    })

    // Settings
    document.getElementById("resultsPerPage").addEventListener("change", (e) => {
      this.settings.resultsPerPage = Number.parseInt(e.target.value)
      this.saveSettings()
    })

    document.getElementById("safeSearch").addEventListener("change", (e) => {
      this.settings.safeSearch = e.target.checked
      this.saveSettings()
    })

    document.getElementById("themeSelect").addEventListener("change", (e) => {
      this.settings.theme = e.target.value
      this.applyTheme()
      this.saveSettings()
    })
  }

  hideLoadingScreen() {
    setTimeout(() => {
      document.getElementById("loadingScreen").classList.add("hidden")
    }, 1500)
  }

  switchSearchType(type) {
    this.currentSearchType = type

    // Update active filter button
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.type === type)
    })

    // Update placeholder
    const placeholder = type === "images" ? "Search for images..." : "Search for videos..."
    document.getElementById("searchInput").placeholder = placeholder

    // Re-search if there's a current query
    if (this.currentQuery) {
      this.performSearch()
    }
  }

  switchView(view) {
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view)
    })

    const grid = document.getElementById("resultsGrid")
    grid.className = view === "masonry" ? "results-grid masonry" : "results-grid"
  }

  async performSearch() {
    const query = document.getElementById("searchInput").value.trim()
    if (!query) return

    this.currentQuery = query
    this.currentPage = 1
    this.results = []
    this.hasMoreResults = true

    // Show results container
    document.getElementById("welcomeScreen").classList.add("hidden")
    document.getElementById("resultsContainer").classList.remove("hidden")
    document.getElementById("noResults").classList.add("hidden")

    // Update search query display
    document.getElementById("searchQuery").textContent = `for "${query}"`

    // Clear previous results
    document.getElementById("resultsGrid").innerHTML = ""

    await this.fetchResults()
  }

  async fetchResults() {
    if (this.isLoading || !this.hasMoreResults) return

    this.isLoading = true
    this.showLoading()

    try {
      let results = []

      if (this.currentSearchType === "images") {
        results = await this.fetchImages()
      } else {
        results = await this.fetchVideos()
      }

      if (results.length === 0 && this.currentPage === 1) {
        this.showNoResults()
      } else {
        this.results.push(...results)
        this.displayResults(results)
        this.updateResultsCount()

        if (results.length < this.settings.resultsPerPage) {
          this.hasMoreResults = false
        }
      }
    } catch (error) {
      console.error("Search error:", error)
      this.showError("Failed to fetch results. Please try again.")
    } finally {
      this.isLoading = false
      this.hideLoading()
    }
  }

  async fetchImages() {
    // Try Unsplash first (high quality)
    try {
      const unsplashResults = await this.fetchFromUnsplash()
      if (unsplashResults.length > 0) return unsplashResults
    } catch (error) {
      console.warn("Unsplash API failed, trying Pexels:", error)
    }

    // Fallback to Pexels
    try {
      const pexelsResults = await this.fetchFromPexelsImages()
      if (pexelsResults.length > 0) return pexelsResults
    } catch (error) {
      console.warn("Pexels API failed, trying Pixabay:", error)
    }

    // Final fallback to Pixabay
    try {
      return await this.fetchFromPixabayImages()
    } catch (error) {
      console.error("All image APIs failed:", error)
      return []
    }
  }

  async fetchVideos() {
    // Try YouTube first (best video source)
    try {
      const youtubeResults = await this.fetchFromYouTube()
      if (youtubeResults.length > 0) return youtubeResults
    } catch (error) {
      console.warn("YouTube API failed, trying Pexels:", error)
    }

    // Fallback to Pexels Videos
    try {
      const pexelsResults = await this.fetchFromPexelsVideos()
      if (pexelsResults.length > 0) return pexelsResults
    } catch (error) {
      console.warn("Pexels Videos API failed, trying Pixabay:", error)
    }

    // Final fallback to Pixabay Videos
    try {
      return await this.fetchFromPixabayVideos()
    } catch (error) {
      console.error("All video APIs failed:", error)
      return []
    }
  }

  async fetchFromUnsplash() {
    const url = `${this.apis.unsplash.baseUrl}?query=${encodeURIComponent(this.currentQuery)}&page=${this.currentPage}&per_page=${this.apis.unsplash.perPage}&client_id=${this.apis.unsplash.accessKey}`

    const response = await fetch(url)
    if (!response.ok) throw new Error(`Unsplash API error: ${response.status}`)

    const data = await response.json()

    return data.results.map((item) => ({
      id: item.id,
      webformatURL: item.urls.regular,
      largeImageURL: item.urls.full,
      tags: item.alt_description || item.description || this.currentQuery,
      user: item.user.name,
      views: item.views || 0,
      downloads: item.downloads || 0,
      source: "unsplash",
      sourceUrl: item.links.html,
    }))
  }

  async fetchFromPexelsImages() {
    const url = `${this.apis.pexels.baseUrl}?query=${encodeURIComponent(this.currentQuery)}&page=${this.currentPage}&per_page=${this.apis.pexels.perPage}`

    const response = await fetch(url, {
      headers: {
        Authorization: this.apis.pexels.apiKey,
      },
    })

    if (!response.ok) throw new Error(`Pexels API error: ${response.status}`)

    const data = await response.json()

    return data.photos.map((item) => ({
      id: item.id,
      webformatURL: item.src.medium,
      largeImageURL: item.src.original,
      tags: item.alt || this.currentQuery,
      user: item.photographer,
      views: 0,
      downloads: 0,
      source: "pexels",
      sourceUrl: item.url,
    }))
  }

  async fetchFromPixabayImages() {
    const url = `${this.apis.pixabay.baseUrl}?key=${this.apis.pixabay.key}&q=${encodeURIComponent(this.currentQuery)}&image_type=photo&page=${this.currentPage}&per_page=${this.apis.pixabay.perPage}&safesearch=${this.settings.safeSearch}`

    const response = await fetch(url)
    if (!response.ok) throw new Error(`Pixabay API error: ${response.status}`)

    const data = await response.json()

    return data.hits.map((item) => ({
      id: item.id,
      webformatURL: item.webformatURL,
      largeImageURL: item.largeImageURL,
      tags: item.tags,
      user: item.user,
      views: item.views,
      downloads: item.downloads,
      source: "pixabay",
      sourceUrl: `https://pixabay.com/photos/${item.id}/`,
    }))
  }

  async fetchFromYouTube() {
    const url = `${this.apis.youtube.baseUrl}?part=snippet&type=video&q=${encodeURIComponent(this.currentQuery)}&key=${this.apis.youtube.key}&maxResults=${this.apis.youtube.maxResults}&pageToken=${this.currentPage > 1 ? this.nextPageToken || "" : ""}`

    const response = await fetch(url)
    if (!response.ok) throw new Error(`YouTube API error: ${response.status}`)

    const data = await response.json()
    this.nextPageToken = data.nextPageToken

    return data.items.map((item) => ({
      id: { videoId: item.id.videoId },
      snippet: {
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails,
        description: item.snippet.description,
      },
      duration: "N/A",
      source: "youtube",
      sourceUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }))
  }

  async fetchFromPexelsVideos() {
    const url = `${this.apis.pexels.videoUrl}?query=${encodeURIComponent(this.currentQuery)}&page=${this.currentPage}&per_page=${this.apis.pexels.perPage}`

    const response = await fetch(url, {
      headers: {
        Authorization: this.apis.pexels.apiKey,
      },
    })

    if (!response.ok) throw new Error(`Pexels Videos API error: ${response.status}`)

    const data = await response.json()

    return data.videos.map((item) => ({
      id: { videoId: item.id },
      snippet: {
        title: `Video by ${item.user.name}`,
        channelTitle: item.user.name,
        publishedAt: new Date().toISOString(),
        thumbnails: {
          medium: { url: item.image },
          high: { url: item.image },
        },
        description: `Duration: ${item.duration}s`,
      },
      duration: this.formatDuration(item.duration),
      source: "pexels",
      sourceUrl: item.url,
    }))
  }

  async fetchFromPixabayVideos() {
    const url = `${this.apis.pixabay.videoUrl}?key=${this.apis.pixabay.key}&q=${encodeURIComponent(this.currentQuery)}&page=${this.currentPage}&per_page=${this.apis.pixabay.perPage}&safesearch=${this.settings.safeSearch}`

    const response = await fetch(url)
    if (!response.ok) throw new Error(`Pixabay Videos API error: ${response.status}`)

    const data = await response.json()

    return data.hits.map((item) => ({
      id: { videoId: item.id },
      snippet: {
        title: item.tags,
        channelTitle: item.user,
        publishedAt: new Date().toISOString(),
        thumbnails: {
          medium: {
            url: item.picture_id
              ? `https://i.vimeocdn.com/video/${item.picture_id}_295x166.jpg`
              : "https://via.placeholder.com/295x166",
          },
          high: {
            url: item.picture_id
              ? `https://i.vimeocdn.com/video/${item.picture_id}_640x360.jpg`
              : "https://via.placeholder.com/640x360",
          },
        },
        description: `Views: ${item.views} • Duration: ${item.duration}s`,
      },
      duration: this.formatDuration(item.duration),
      source: "pixabay",
      sourceUrl: `https://pixabay.com/videos/${item.id}/`,
    }))
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  displayResults(results) {
    const grid = document.getElementById("resultsGrid")

    results.forEach((item) => {
      const element = this.createResultElement(item)
      grid.appendChild(element)
    })
  }

  createResultElement(item) {
    const div = document.createElement("div")
    div.className = "result-item"
    div.addEventListener("click", () => this.openMediaModal(item))

    if (this.currentSearchType === "images") {
      div.innerHTML = `
        <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
        <div class="result-overlay">
          <div class="result-info">
            <div class="result-title">${item.tags}</div>
            <div class="result-meta">By ${item.user} • ${item.source}</div>
          </div>
        </div>
      `
    } else {
      div.innerHTML = `
        <img src="${item.snippet.thumbnails.medium.url}" alt="${item.snippet.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/320x180?text=Video+Not+Found'">
        <div class="video-duration">${item.duration}</div>
        <div class="result-overlay">
          <div class="result-info">
            <div class="result-title">${item.snippet.title}</div>
            <div class="result-meta">${item.snippet.channelTitle} • ${item.source}</div>
          </div>
        </div>
      `
    }

    return div
  }

  openMediaModal(item) {
    const modal = document.getElementById("mediaModal")
    const mediaContainer = modal.querySelector(".modal-media")
    const title = modal.querySelector(".modal-title")
    const details = modal.querySelector(".modal-details")
    const downloadBtn = modal.querySelector(".download-btn")

    if (this.currentSearchType === "images") {
      mediaContainer.innerHTML = `<img src="${item.largeImageURL}" alt="${item.tags}" onerror="this.src='${item.webformatURL}'">`
      title.textContent = item.tags
      details.innerHTML = `
        <p>By ${item.user} • Source: ${item.source}</p>
        <p>${item.views} views • ${item.downloads} downloads</p>
      `
      downloadBtn.onclick = () => window.open(item.sourceUrl, "_blank")
    } else {
      mediaContainer.innerHTML = `<img src="${item.snippet.thumbnails.high.url}" alt="${item.snippet.title}" onerror="this.src='${item.snippet.thumbnails.medium.url}'">`
      title.textContent = item.snippet.title
      details.innerHTML = `
        <p>Channel: ${item.snippet.channelTitle}</p>
        <p>Duration: ${item.duration} • Source: ${item.source}</p>
        <p>Published: ${new Date(item.snippet.publishedAt).toLocaleDateString()}</p>
      `
      downloadBtn.onclick = () => window.open(item.sourceUrl, "_blank")
    }

    modal.classList.remove("hidden")
  }

  closeModal() {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.classList.add("hidden")
    })
  }

  openSettings() {
    // Update settings values
    document.getElementById("resultsPerPage").value = this.settings.resultsPerPage
    document.getElementById("safeSearch").checked = this.settings.safeSearch
    document.getElementById("themeSelect").value = this.settings.theme

    document.getElementById("settingsModal").classList.remove("hidden")
  }

  async loadMoreResults() {
    this.currentPage++
    await this.fetchResults()
  }

  handleScroll() {
    if (this.isLoading || !this.hasMoreResults) return

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    if (scrollTop + clientHeight >= scrollHeight - 1000) {
      this.loadMoreResults()
    }
  }

  showLoading() {
    if (this.currentPage === 1) {
      document.getElementById("resultsGrid").innerHTML =
        '<div class="loading-more"><div class="loading-spinner"></div><span>Searching...</span></div>'
    } else {
      document.getElementById("loadingMore").classList.remove("hidden")
    }
    document.getElementById("loadMoreBtn").classList.add("hidden")
  }

  hideLoading() {
    document.getElementById("loadingMore").classList.add("hidden")
    if (this.hasMoreResults) {
      document.getElementById("loadMoreBtn").classList.remove("hidden")
    }
  }

  showNoResults() {
    document.getElementById("resultsContainer").classList.add("hidden")
    document.getElementById("noResults").classList.remove("hidden")
  }

  showError(message) {
    // Create toast notification
    const toast = document.createElement("div")
    toast.className = "toast error"
    toast.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
    `
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.remove()
    }, 5000)
  }

  updateResultsCount() {
    const count = this.results.length
    const countText = count === 1 ? "1 result" : `${count.toLocaleString()} results`
    document.getElementById("resultsCount").textContent = countText
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark"
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    this.settings.theme = newTheme
    this.applyTheme()
    this.saveSettings()
  }

  applyTheme() {
    if (this.settings.theme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light")
    } else {
      document.documentElement.setAttribute("data-theme", this.settings.theme)
    }

    // Update theme button icon
    const themeBtn = document.getElementById("themeBtn")
    const icon = this.settings.theme === "light" ? "fa-sun" : "fa-moon"
    themeBtn.querySelector("i").className = `fas ${icon}`
  }

  saveSettings() {
    localStorage.setItem("nexusSearchSettings", JSON.stringify(this.settings))
  }

  loadSettings() {
    const saved = localStorage.getItem("nexusSearchSettings")
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) }
    }
    this.applyTheme()
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new NexusSearch()
})
