import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  template: `<article class="card metric"><p class="muted">{{label}}</p><h2>{{value}}</h2></article>`,
  styles: [`.metric{min-height:132px;display:grid;align-content:center}.metric p{font-weight:800;text-transform:uppercase;letter-spacing:.04em;font-size:.78rem}.metric h2{margin-bottom:0;font-variant-numeric:tabular-nums}`]
})
export class MetricCardComponent { @Input() label = ''; @Input() value: string | number = ''; }
