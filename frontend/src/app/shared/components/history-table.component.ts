import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SimulationResult } from '../../core/models/simulation.models';

@Component({
  selector: 'app-history-table',
  standalone: true,
  imports: [DecimalPipe],
  template: `<article class="card"><h3>Historial reciente</h3>@if(history.length){<div class="table-wrap"><table><thead><tr><th>Episodio</th><th>Estado</th><th>Acción</th><th>Recompensa</th><th>Resultado</th></tr></thead><tbody>@for(r of history;track r.episode){<tr><td>{{r.episode}}</td><td><b>{{r.state}}</b></td><td>{{r.action}}</td><td><b [class.positive]="r.reward>=0" [class.negative]="r.reward<0">{{r.reward|number:'1.1-2'}}</b></td><td>{{r.outcomeType}}</td></tr>}</tbody></table></div>}@else{<p class="empty-state">El historial aparecerá después de ejecutar eventos o entrenamiento.</p>}</article>`
})
export class HistoryTableComponent { @Input() history: SimulationResult[] = []; }
