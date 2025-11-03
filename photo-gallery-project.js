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
    this.editableCards = this.loadFromLocalStorage();
    this.editingCardId = null;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      foxImages: { type: Array },
      loading: { type: Boolean },
      error: { type: String },
      editableCards: { type: Array },
      editingCardId: { type: String },
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
        color: var(--ddd-theme-primary-coalMiner);
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
          background-color: var(--ddd-theme-primary-coalMiner);
        }
        .gallery-header h1 {
          color: var(--ddd-theme-primary);
        }
        .fox-card p {
          color: var(--ddd-theme-primary);
        }
      }

      .section-divider {
        margin: var(--ddd-spacing-12) 0;
        border-top: 2px solid var(--ddd-theme-primary);
      }

      .editable-card {
        position: relative;
        background-color: var(--ddd-theme-primary-coalMiner);
        border-radius: var(--ddd-radius-md);
        padding: var(--ddd-spacing-4);
        box-shadow: var(--ddd-boxShadow-md);
        transition: transform 0.3s ease;
      }

      .editable-card:hover {
        transform: translateY(-4px);
      }

      .editable-card img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: var(--ddd-radius-sm);
        margin-bottom: var(--ddd-spacing-2);
      }

      .editable-card input {
        width: 100%;
        padding: var(--ddd-spacing-2);
        margin-bottom: var(--ddd-spacing-2);
        border: 1px solid var(--ddd-theme-default-limestoneLight);
        border-radius: var(--ddd-radius-sm);
        font-family: var(--ddd-font-navigation);
        font-size: var(--ddd-font-size-xs);
      }

      .editable-card textarea {
        width: 100%;
        padding: var(--ddd-spacing-2);
        margin-bottom: var(--ddd-spacing-2);
        border: 1px solid var(--ddd-theme-default-limestoneLight);
        border-radius: var(--ddd-radius-sm);
        font-family: var(--ddd-font-navigation);
        font-size: var(--ddd-font-size-xs);
        min-height: 80px;
        resize: vertical;
      }

      .card-content h3 {
        margin: 0 0 var(--ddd-spacing-2) 0;
        color: var(--ddd-theme-default-white);
        font-size: var(--ddd-font-size-m);
      }

      .card-content p {
        margin: 0;
        color: var(--ddd-theme-default-white);
        font-size: var(--ddd-font-size-xs);
        line-height: 1.5;
      }

      .card-actions {
        display: flex;
        gap: var(--ddd-spacing-2);
        margin-top: var(--ddd-spacing-3);
      }

      .card-actions button {
        flex: 1;
        padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        font-size: var(--ddd-font-size-xs);
      }

      .delete-btn {
        background-color: var(--ddd-theme-default-original87Pink);
      }

      .delete-btn:hover {
        background-color: var(--ddd-theme-default-error);
      }

      @media (prefers-color-scheme: dark) {
        .editable-card {
          background-color: var(--ddd-theme-default-coalMiner);
        }
        .editable-card input,
        .editable-card textarea {
          background-color: var(--ddd-theme-primary-limestoneMaxLight);
          color: var(--ddd-theme-default-white);
          border-color: var(--ddd-theme-default-coalMiner);
        }
        .card-content h3,
        .card-content p {
          color: var(--ddd-theme-primary-white);
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

  loadFromLocalStorage() {
    const saved = localStorage.getItem('editableCards');
    return saved ? JSON.parse(saved) : [];
  }

  saveToLocalStorage() {
    localStorage.setItem('editableCards', JSON.stringify(this.editableCards));
  }

  addNewCard() {
    const newCard = {
      id: `card-${Date.now()}`,
      title: 'New Card',
      description: 'Add your description here',
      imageUrl: 'https://th.bing.com/th/id/R.e0c32eb12ced8c98cf618374abfef127?rik=8t9Nupra1%2fMwYg&riu=http%3a%2f%2f2.bp.blogspot.com%2f-bsfgb5NGczQ%2fT8JiudTvBGI%2fAAAAAAAAGRY%2fOYzZ0ZS4mwQ%2fs1600%2fBaby-Kiwi-Bird.jpg&ehk=0jRwTzSc4i81BIvs644RBDtC%2fGGRd2Yge3CxKtsNaBE%3d&risl=&pid=ImgRaw&r=0',
    };
    this.editableCards = [...this.editableCards, newCard];
    this.saveToLocalStorage();
  }

  startEditing(cardId) {
    this.editingCardId = cardId;
  }

  saveCard(cardId) {
    this.editingCardId = null;
    this.saveToLocalStorage();
  }

  deleteCard(cardId) {
    this.editableCards = this.editableCards.filter(card => card.id !== cardId);
    this.saveToLocalStorage();
  }

  updateCardField(cardId, field, value) {
    this.editableCards = this.editableCards.map(card =>
      card.id === cardId ? { ...card, [field]: value } : card
    );
  }

  renderEditableCard(card) {
    const isEditing = this.editingCardId === card.id;

    if (isEditing) {
      return html`
        <div class="editable-card">
          <input
            type="text"
            .value="${card.title}"
            @input="${(e) => this.updateCardField(card.id, 'title', e.target.value)}"
            placeholder="Card Title"
          />
          <input
            type="text"
            .value="${card.imageUrl}"
            @input="${(e) => this.updateCardField(card.id, 'imageUrl', e.target.value)}"
            placeholder="Image URL"
          />
          <img src="${card.imageUrl}" alt="${card.title}" loading="lazy" />
          <textarea
            .value="${card.description}"
            @input="${(e) => this.updateCardField(card.id, 'description', e.target.value)}"
            placeholder="Card Description"
          ></textarea>
          <div class="card-actions">
            <button @click="${() => this.saveCard(card.id)}">Save</button>
            <button class="delete-btn" @click="${() => this.deleteCard(card.id)}">Delete</button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="editable-card">
        <img src="${card.imageUrl}" alt="${card.title}" loading="lazy" />
        <div class="card-content">
          <h3>${card.title}</h3>
          <p>${card.description}</p>
        </div>
        <div class="card-actions">
          <button>(❤ ω ❤)</button>
          <button>(> v <)👍</button>
        </div>
        <div class="card-actions">
          <button @click="${() => this.startEditing(card.id)}">Edit</button>
          <button class="delete-btn" @click="${() => this.deleteCard(card.id)}">Delete</button>
        </div>
      </div>
    `;
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="gallery-header">
        <h1>Random Fox Gallery</h1>
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

      ${this.loading ? html`<div class="loading">Loading foxes...</div>` : ''}
      ${this.error ? html`<div class="error">${this.error}</div>` : ''}

      <div class="gallery-grid">
        ${this.foxImages.map((fox, index) => html`
          <div class="fox-card">
            <img src="${fox.image}" alt="Random fox ${index + 1}" loading="lazy" />
            <p>Fox #${index + 1}</p>
          </div>
        `)}
      </div>

      <div class="section-divider"></div>

      <div class="gallery-header">
        <h1>Editable Card Gallery</h1>
      </div>

      <div class="controls">
        <button @click="${() => this.addNewCard()}">
          Add New Card
        </button>
      </div>

      <div class="gallery-grid">
        ${this.editableCards.map(card => this.renderEditableCard(card))}
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