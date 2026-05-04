import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div class="header-left">
        <span class="header-kicker">Visao geral</span>
        <h1 class="page-title">{{ title }}</h1>
        <p class="page-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-actions"><ng-content></ng-content></div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 24px;
      padding: 22px 24px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-surface);
      box-shadow: var(--shadow-sm);
    }
    .header-kicker {
      display: inline-block;
      margin-bottom: 8px;
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--color-primary);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .page-title {
      font-size: clamp(1.7rem, 2vw, 2.1rem);
      font-weight: 800;
      color: var(--color-text-primary);
      margin-bottom: 6px;
    }
    .page-subtitle {
      color: var(--color-text-secondary);
      font-size: 0.95rem;
      max-width: 58ch;
    }
    .header-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    @media (max-width: 640px) {
      .page-header {
        padding: 20px;
      }
    }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn" [class]="'btn-' + variant + (size ? ' btn-' + size : '')" [disabled]="disabled || loading" [type]="type">
      <span class="btn-spinner" *ngIf="loading"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 18px; border-radius: 12px;
      font-size: 0.9rem; font-weight: 700;
      font-family: 'DM Sans', sans-serif;
      letter-spacing: -0.01em;
      transition: all 0.15s cubic-bezier(0.4,0,0.2,1);
      white-space: nowrap; cursor: pointer; border: 1px solid transparent;
      &:disabled { opacity: 0.65; cursor: not-allowed; }
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-strong));
      color: white;
      border-color: transparent;
      &:hover:not(:disabled) { background: linear-gradient(135deg, var(--color-primary-strong), var(--color-primary)); }
    }
    .btn-secondary {
      background: var(--color-surface);
      color: var(--color-text-primary);
      border-color: var(--color-border);
      &:hover:not(:disabled) { border-color: var(--color-border-strong); background: var(--color-surface-2); }
    }
    .btn-danger {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      &:hover:not(:disabled) { filter: brightness(0.98); }
    }
    .btn-success {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      &:hover:not(:disabled) { filter: brightness(0.98); }
    }
    .btn-ghost {
      background: transparent;
      color: var(--color-text-secondary);
      border-color: transparent;
      &:hover:not(:disabled) { background: var(--color-primary-softer); color: var(--color-text-primary); }
    }
    .btn-sm { padding: 8px 14px; font-size: 0.8125rem; border-radius: 12px; }
    .btn-lg { padding: 14px 24px; font-size: 1rem; border-radius: 16px; }
    .btn-spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
      border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class BtnComponent {
  @Input() variant: 'primary'|'secondary'|'danger'|'success'|'ghost' = 'primary';
  @Input() size: 'sm'|''|'lg' = '';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button'|'submit'|'reset' = 'button';
}

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-icon" [innerHTML]="safeIcon"></div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 10px;
      padding: 40px 24px;
      min-height: 240px;
      margin: 18px auto 6px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }
    .empty-icon {
      display: inline-flex;
      width: 72px;
      height: 72px;
      background: var(--color-surface-2);
      border: 1px solid var(--color-border);
      border-radius: 18px;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      color: var(--color-primary);
      ::ng-deep svg { width: 32px; height: 32px; color: currentColor; }
    }
    h3 { font-size: 1.125rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 0; }
    p { color: var(--color-text-secondary); font-size: 0.9375rem; margin-bottom: 10px; max-width: 42ch; }
  `]
})
export class EmptyStateComponent implements OnChanges {
  @Input() title = 'Nenhum registro encontrado';
  @Input() message = 'Comece adicionando um novo item.';
  @Input() icon = `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 16H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clip-rule="evenodd"/></svg>`;
  safeIcon: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {
    this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(this.icon);
  }

  ngOnChanges(): void {
    this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(this.icon);
  }
}
