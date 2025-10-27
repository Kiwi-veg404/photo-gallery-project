import { LitElement, html, css } from 'lit';
import './photo-card.js';

export class PhotoGallery extends LitElement {
  static properties = {
    photos: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    visiblePhotos: { type: Set }
  };

  static styles = css`
    :host {
      display: block;
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 32px;
    }

    .title {
      font-size: 36px;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: var(--text-primary, #1a1a1a);
    }

    .subtitle {
      font-size: 18px;
      color: var(--text-secondary, #666);
      margin: 0;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .loading {
      text-align: center;
      padding: 40px;
      font-size: 18px;
      color: var(--text-secondary, #666);
    }

    .error {
      text-align: center;
      padding: 40px;
      color: #d32f2f;
      font-size: 18px;
    }

    .loading-spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color, #e0e0e0);
      border-top-color: #1976d2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Tablet */
    @media (max-width: 768px) {
      :host {
        padding: 16px;
      }

      .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
      }

      .title {
        font-size: 28px;
      }

      .subtitle {
        font-size: 16px;
      }
    }

    /* Mobile */
    @media (max-width: 480px) {
      :host {
        padding: 12px;
      }

      .gallery-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .title {
        font-size: 24px;
      }

      .subtitle {
        font-size: 14px;
      }
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --text-primary: #ffffff;
        --text-secondary: #b0b0b0;
        --border-color: #404040;
        background: #1a1a1a;
      }
    }
  `;

  constructor() {
    super();
    this.photos = [];
    this.loading = true;
    this.error = '';
    this.visiblePhotos = new Set();
    this.observer = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchPhotos();
    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  async fetchPhotos() {
    try {
      this.loading = true;
      const response = await fetch('./api/photos.json');
      
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      
      const json = await response.json();
      this.photos = json.data || [];
      this.loading = false;
    } catch (err) {
      this.error = err.message;
      this.loading = false;
    }
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const photoId = entry.target.getAttribute('data-photo-id');
          if (photoId) {
            this.visiblePhotos.add(photoId);
            this.requestUpdate();
          }
        }
      });
    }, options);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    
    if (changedProperties.has('photos') && this.photos.length > 0) {
      this.updateComplete.then(() => {
        const cards = this.shadowRoot.querySelectorAll('photo-card');
        cards.forEach(card => {
          if (this.observer) {
            this.observer.observe(card);
          }
        });
      });
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading">
          <div class="loading-spinner"></div>
          <p>Loading amazing fox photos...</p>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="error">
          <p>❌ Error: ${this.error}</p>
          <p>Please make sure the photos.json file is available.</p>
        </div>
      `;
    }

    return html`
      <div class="header">
        <h1 class="title">🦊 Fox Photo Gallery</h1>
        <p class="subtitle">A beautiful collection of ${this.photos.length} fox photos</p>
      </div>
      
      <div class="gallery-grid">
        ${this.photos.map(photo => html`
          <photo-card 
            .photo="${photo}"
            .isVisible="${this.visiblePhotos.has(photo.id)}"
            data-photo-id="${photo.id}"
          ></photo-card>
        `)}
      </div>
    `;
  }
}

customElements.define('photo-gallery', PhotoGallery);
