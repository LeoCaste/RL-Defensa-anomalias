import { Component, Input } from "@angular/core";

@Component({
  selector: "app-metric-card",
  standalone: true,
  template: `<article class="card metric">
    <p class="muted">{{ label }}</p>
    <h2>{{ value }}</h2>
    @if (helper) {
      <small>{{ helper }}</small>
    }
  </article>`,
  styles: [
    `
      .metric {
        min-height: 132px;
        display: grid;
        align-content: center;
        gap: var(--space-xs);
        padding: var(--space-md);
      }
      .metric p {
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-size: 0.78rem;
        margin: 0;
      }
      .metric h2 {
        margin: 0;
        font-variant-numeric: tabular-nums;
      }
      .metric small {
        max-width: 180px;
      }
    `,
  ],
})
export class MetricCardComponent {
  @Input() label = "";
  @Input() value: string | number = "";
  @Input() helper = "";
}
