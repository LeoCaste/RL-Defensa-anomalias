import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SimulationResult } from '../../core/models/simulation.models';

@Component({
  selector: 'app-history-table',
  standalone: true,
  imports: [DecimalPipe],
  template: `<article class="card"><h3>Historial reciente</h3>@if(history.length){<p class="muted">Usa este registro para comprobar si el agente repite mejores decisiones después de entrenar.</p><div class="table-wrap"><table><thead><tr><th>Episodio</th><th>Estado</th><th>Acción</th><th>Recompensa</th><th>Resultado</th></tr></thead><tbody>@for(r of history;track r.episode){<tr><td>{{r.episode}}</td><td><b>{{r.state}}</b></td><td>{{r.action}}</td><td><b [class.positive]="r.reward>=0" [class.negative]="r.reward<0">{{r.reward|number:'1.1-2'}}</b></td><td>{{r.outcomeType}}</td></tr>}</tbody></table></div>}@else{<p class="empty-state">Ejecuta un evento o entrena por lotes. Aquí se listarán las decisiones recientes para revisar estado, acción, recompensa y resultado.</p>}</article>`,
  styles: [`.table-wrap{margin-top:var(--space-sm)}table{border-collapse:collapse}th,td{padding:var(--space-sm) var(--space-md);border-bottom:1px solid rgba(216,207,193,.82)}td:first-child,td:nth-child(4){text-align:right;font-variant-numeric:tabular-nums}tbody tr:nth-child(even){background:rgba(246,241,232,.32)}tbody tr:hover{background:rgba(15,118,110,.06)}`]
})
export class HistoryTableComponent { @Input() history: SimulationResult[] = []; }
