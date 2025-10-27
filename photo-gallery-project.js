/**
 * Copyright 2025 Junyu Zhao
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `photo-gallery-project`
 * A photo gallery that loads fox images from randomfox.ca API
 * @demo index.html
 * @element photo-gallery-project
 */
export class PhotoGalleryProject extends DDDSuper(LitElement) {

  static get tag() {
    return "photo-gallery-project";
  }

  constructor() {
    super();
    this.foxImages = [];
    this.loading = false;
    this.error = null;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      foxImages: { type: Array },
      loading: { type: Boolean },
      error: { type: String },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        padding: var(--ddd-spacing-4);
        font-family: var(--ddd-font-navigation);
      }

      .gallery-header {
        text-align: center;
        margin-bottom: var(--ddd-spacing-6);
      }

      .gallery-header h1 {
        color: var(--ddd-theme-default-limestoneMaxLight);
        font-size: var(--ddd-font-size-xl);
        margin: 0;
      }

      .controls {
        display: flex;
        justify-content: center;
        gap: var(--ddd-spacing-4);
        margin-bottom: var(--ddd-spacing-6);
      }

      button {
        background-color: var(--ddd-theme-default-beaver70);
        color: white;
        border: none;
        padding: var(--ddd-spacing-3) var(--ddd-spacing-6);
        font-size: var(--ddd-font-size-s);
        border-radius: var(--ddd-radius-sm);
        cursor: pointer;
        font-family: var(--ddd-font-navigation);
        transition: background-color 0.3s ease;
      }

      button:hover {
        background-color: var(--ddd-theme-default-original87Pink);
      }

      button:disabled {
        background-color: var(--ddd-theme-default-slateGray);
        cursor: not-allowed;
      }

      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--ddd-spacing-4);
        max-width: 1400px;
        margin: 0 auto;
      }

      .fox-card {
        background-color: var(--ddd-theme-default-white);
        border-radius: var(--ddd-radius-md);
        padding: var(--ddd-spacing-4);
        box-shadow: var(--ddd-boxShadow-md);
        transition: transform 0.3s ease;
      }

      .fox-card:hover {
        transform: translateY(-4px);
      }

      .fox-card img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: var(--ddd-radius-sm);
      }

      .fox-card p {
        margin-top: var(--ddd-spacing-2);
        color: var(--ddd-theme-default-limestoneMaxLight);
        font-size: var(--ddd-font-size-xs);
        text-align: center;
      }

      .loading, .error {
        text-align: center;
        padding: var(--ddd-spacing-8);
        font-size: var(--ddd-font-size-m);
      }

      .error {
        color: var(--ddd-theme-default-error);
      }

      @media (max-width: 768px) {
        .gallery-grid {
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
      }

      @media (max-width: 480px) {
        .gallery-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (prefers-color-scheme: dark) {
        .fox-card {
          background-color: var(--ddd-theme-default-coalMiner);
        }
        .gallery-header h1 {
          color: var(--ddd-theme-default-white);
        }
        .fox-card p {
          color: var(--ddd-theme-default-white);
        }
      }
    `];
  }

  /**
   * Fetch a single fox image from the RandomFox API
   */
  async fetchFoxImage() {
    try {
      const response = await fetch('https://randomfox.ca/floof/');
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      throw new Error('Failed to fetch fox image');
    } catch (error) {
      console.error('Error fetching fox:', error);
      throw error;
    }
  }

  /**
   * Load multiple fox images
   */
  async loadFoxes(count = 1) {
    this.loading = true;
    this.error = null;
    
    try {
      const promises = [];
      for (let i = 0; i < count; i++) {
        promises.push(this.fetchFoxImage());
      }
      
      const newFoxes = await Promise.all(promises);
      this.foxImages = [...this.foxImages, ...newFoxes];
    } catch (error) {
      this.error = 'Failed to load fox images. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Clear all loaded images
   */
  clearGallery() {
    this.foxImages = [];
    this.error = null;
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="gallery-header">
        <h1>🦊 Random Fox Gallery</h1>
      </div>

      <div class="controls">
        <button 
          @click="${() => this.loadFoxes(1)}" 
          ?disabled="${this.loading}">
          Load 1 Fox
        </button>
        <button 
          @click="${() => this.loadFoxes(5)}" 
          ?disabled="${this.loading}">
          Load 5 Foxes
        </button>
        <button 
          @click="${() => this.loadFoxes(10)}" 
          ?disabled="${this.loading}">
          Load 10 Foxes
        </button>
        <button 
          @click="${() => this.clearGallery()}" 
          ?disabled="${this.loading || this.foxImages.length === 0}">
          Clear Gallery
        </button>
      </div>

      ${this.loading ? html`<div class="loading">Loading foxes... 🦊</div>` : ''}
      ${this.error ? html`<div class="error">${this.error}</div>` : ''}

      <div class="gallery-grid">
        ${this.foxImages.map((fox, index) => html`
          <div class="fox-card">
            <img src="${fox.image}" alt="Random fox ${index + 1}" loading="lazy" />
            <p>Fox #${index + 1}</p>
          </div>
        `)}
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(PhotoGalleryProject.tag, PhotoGalleryProject);
