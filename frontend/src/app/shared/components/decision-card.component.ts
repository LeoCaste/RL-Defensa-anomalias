import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SimulationResult } from '../../core/models/simulation.models';

@Component({
  selector: 'app-decision-card',
  standalone: true,
  imports: [DecimalPipe],
  template: `<article class="card decision-card"><h3>Decisión del agente</h3>@if(result){<div class="decision"><span class="pill">{{result.action}}</span><strong [class.positive]="result.reward>=0" [class.negative]="result.reward<0">{{result.reward|number:'1.1-2'}}</strong></div><p>Resultado: <b>{{result.outcomeType}}</b> · {{result.exploration?'exploración':'explotación'}}</p><p class="muted">{{result.explanation}}</p>}@else{<p class="empty-state">Sin decisión todavía.</p>}</article>`,
  styles: [`.decision-card{min-height:100%}.decision{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}.decision strong{font-size:2rem;line-height:1}`]
})
export class DecisionCardComponent { @Input() result: SimulationResult | null = null; }
