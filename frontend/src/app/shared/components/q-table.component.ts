import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AgentAction, QTableEntry, RiskState } from '../../core/models/simulation.models';

@Component({
  selector: 'app-q-table',
  standalone: true,
  imports: [DecimalPipe],
  template: `<article class="card q-card"><div class="head"><div><h3>Q-table</h3><p class="muted">Cada celda estima el valor de una acción para un estado. El mejor valor por fila queda resaltado.</p></div><span class="pill">política visible</span></div><div class="table-wrap q-wrap"><table><thead><tr><th>Estado</th>@for(a of actions;track a){<th>{{a}}</th>}</tr></thead><tbody>@for(s of states;track s){<tr><th><span class="state" [class.normal]="s==='NORMAL'" [class.critical]="s==='CRITICAL'">{{s}}</span></th>@for(a of actions;track a){<td [class.best]="bestAction(s)===a">{{value(s,a)|number:'1.2-2'}}</td>}</tr>}</tbody></table></div></article>`,
  styles: [`.q-card{min-width:0}.head{display:flex;justify-content:space-between;gap:12px;align-items:start;margin-bottom:14px}.head h3{margin-bottom:4px}.q-wrap table{min-width:620px}.q-wrap th,.q-wrap td{padding:14px 16px;text-align:center}.q-wrap tbody th{text-align:left}.best{background:var(--soft-teal);color:var(--teal);font-weight:900;box-shadow:inset 0 0 0 2px rgba(20,118,110,.18)}.state{font-weight:900;color:var(--amber)}.state.normal{color:var(--green)}.state.critical{color:var(--red)}td{font-variant-numeric:tabular-nums;font-size:1rem}`]
})
export class QTableComponent {
  @Input() entries: QTableEntry[] = [];
  states: RiskState[] = ['NORMAL', 'SUSPICIOUS', 'RISKY', 'CRITICAL'];
  actions: AgentAction[] = ['ALLOW', 'MONITOR', 'BLOCK'];
  value(s: RiskState, a: AgentAction) { return this.entries.find(e => e.state === s && e.action === a)?.qValue ?? 0; }
  bestAction(s: RiskState) { return this.actions.reduce((best, a) => this.value(s, a) > this.value(s, best) ? a : best, 'ALLOW' as AgentAction); }
}
