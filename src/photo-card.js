import { LitElement, html, css } from 'lit';

export class PhotoCard extends LitElement {
  static properties = {
    photo: { type: Object },
    isVisible: { type: Boolean },
    reaction: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      border-radius: 12px;
      overflow: hidden;
      background: var(--card-bg, #ffffff);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    :host(:hover) {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .card-image {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      background: var(--image-bg, #f0f0f0);
    }

    .card-content {
      padding: 16px;
    }

    .photo-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--text-primary, #1a1a1a);
    }

    .photo-date {
      font-size: 14px;
      color: var(--text-secondary, #666);
      margin: 0 0 16px 0;
    }

    .author-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-top: 1px solid var(--border-color, #e0e0e0);
      border-bottom: 1px solid var(--border-color, #e0e0e0);
    }

    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .author-details {
      flex: 1;
    }

    .author-name {
      font-weight: 600;
      font-size: 14px;
      margin: 0;
      color: var(--text-primary, #1a1a1a);
    }

    .author-channel {
      font-size: 12px;
      color: var(--text-secondary, #666);
      margin: 2px 0 0 0;
    }

    .author-since {
      font-size: 11px;
      color: var(--text-tertiary, #999);
    }

    .actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }

    .action-btn {
      flex: 1;
      padding: 10px;
      border: 1px solid var(--border-color, #e0e0e0);
      background: var(--button-bg, #f5f5f5);
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .action-btn:hover {
      background: var(--button-hover, #e8e8e8);
      transform: scale(1.05);
    }

    .action-btn.active-like {
      background: #e8f5e9;
      border-color: #4caf50;
      color: #2e7d32;
    }

    .action-btn.active-dislike {
      background: #ffebee;
      border-color: #f44336;
      color: #c62828;
    }

    .placeholder {
      width: 100%;
      aspect-ratio: 1 / 1;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --card-bg: #2a2a2a;
        --text-primary: #ffffff;
        --text-secondary: #b0b0b0;
        --text-tertiary: #808080;
        --border-color: #404040;
        --button-bg: #3a3a3a;
        --button-hover: #4a4a4a;
        --image-bg: #1a1a1a;
      }
    }
  `;

  constructor() {
    super();
    this.photo = {};
    this.isVisible = false;
    this.reaction = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadReaction();
  }

  loadReaction() {
    if (this.photo.id) {
      const stored = localStorage.getItem(`photo-reaction-${this.photo.id}`);
      this.reaction = stored;
    }
  }

  handleLike() {
    const newReaction = this.reaction === 'like' ? null : 'like';
    this.reaction = newReaction;
    this.saveReaction();
  }

  handleDislike() {
    const newReaction = this.reaction === 'dislike' ? null : 'dislike';
    this.reaction = newReaction;
    this.saveReaction();
  }

  saveReaction() {
    if (this.photo.id) {
      if (this.reaction) {
        localStorage.setItem(`photo-reaction-${this.photo.id}`, this.reaction);
      } else {
        localStorage.removeItem(`photo-reaction-${this.photo.id}`);
      }
    }
  }

  async handleShare() {
    const shareData = {
      title: this.photo.name,
      text: `Check out this photo: ${this.photo.name} by ${this.photo.author.name}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          this.fallbackShare();
        }
      }
    } else {
      this.fallbackShare();
    }
  }

  fallbackShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert(`Share this photo: ${this.photo.name}`);
    });
  }

  render() {
    if (!this.photo.id) {
      return html`<div class="placeholder"></div>`;
    }

    return html`
      <div class="card-content">
        ${this.isVisible 
          ? html`<img 
              class="card-image" 
              src="${this.photo.thumbnail}" 
              alt="${this.photo.name}"
              loading="lazy"
            />`
          : html`<div class="placeholder"></div>`
        }
        
        <h3 class="photo-title">${this.photo.name}</h3>
        <p class="photo-date">${new Date(this.photo.dateTaken).toLocaleDateString()}</p>
        
        <div class="author-info">
          <img 
            class="author-avatar" 
            src="${this.photo.author.image}" 
            alt="${this.photo.author.name}"
          />
          <div class="author-details">
            <p class="author-name">${this.photo.author.name}</p>
            <p class="author-channel">${this.photo.author.channel}</p>
            <p class="author-since">Member since ${new Date(this.photo.author.userSince).getFullYear()}</p>
          </div>
        </div>
        
        <div class="actions">
          <button 
            class="action-btn ${this.reaction === 'like' ? 'active-like' : ''}"
            @click="${this.handleLike}"
          >
            ${this.reaction === 'like' ? '👍' : '👍🏻'} Like
          </button>
          <button 
            class="action-btn ${this.reaction === 'dislike' ? 'active-dislike' : ''}"
            @click="${this.handleDislike}"
          >
            ${this.reaction === 'dislike' ? '👎' : '👎🏻'} Dislike
          </button>
          <button 
            class="action-btn"
            @click="${this.handleShare}"
          >
            📤 Share
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('photo-card', PhotoCard);
