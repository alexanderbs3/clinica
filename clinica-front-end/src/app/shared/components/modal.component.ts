import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="open" (click)="onBackdropClick($event)">
      <div class="modal-container" [class]="'modal-' + size" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="modal-close" (click)="close.emit()">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
        </div>
        <div class="modal-body"><ng-content></ng-content></div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; inset: 0;
      background: rgba(15,23,41,0.5);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      animation: fadeIn 0.2s ease;
    }
    .modal-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.18);
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
    .modal-sm  { max-width: 440px; }
    .modal-md  { max-width: 580px; }
    .modal-lg  { max-width: 760px; }
    .modal-xl  { max-width: 960px; }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px 0;
    }
    .modal-title { font-family: 'Syne', sans-serif; font-size: 1.125rem; font-weight: 700; color: #0f172a; }
    .modal-close {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: #94a3b8; cursor: pointer; transition: all 0.15s;
      svg { width: 18px; height: 18px; }
      &:hover { background: #f1f5f9; color: #0f172a; }
    }
    .modal-body { padding: 16px 24px 24px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px) scale(0.97); opacity: 0; } to { transform: none; opacity: 1; } }
  `]
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() size: 'sm'|'md'|'lg'|'xl' = 'md';
  @Output() close = new EventEmitter<void>();

  onBackdropClick(e: Event) { this.close.emit(); }
}
