import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AgentAction, QTableEntry, RiskState } from '../../core/models/simulation.models';

@Component({
  selector: 'app-q-table',
  standalone: true,
  imports: [DecimalPipe],
  template: `<article class="card"><div class="head"><h3>Q-table</h3><span class="muted">mejor valor resaltado</span></div><div class="table-wrap"><table><thead><tr><th>Estado</th>@for(a of actions;track a){<th>{{a}}</th>}</tr></thead><tbody>@for(s of states;track s){<tr><th><span class="state" [class.normal]="s==='NORMAL'" [class.critical]="s==='CRITICAL'">{{s}}</span></th>@for(a of actions;track a){<td [class.best]="bestAction(s)===a">{{value(s,a)|number:'1.2-2'}}</td>}</tr>}</tbody></table></div></article>`,
  styles: [`.head{display:flex;justify-content:space-between;gap:12px;align-items:start;margin-bottom:10px}.head h3{margin-bottom:0}.best{background:var(--soft-teal);color:var(--teal);font-weight:900}.state{font-weight:900;color:var(--amber)}.state.normal{color:var(--green)}.state.critical{color:var(--red)}td{font-variant-numeric:tabular-nums}`]
})
export class QTableComponent {
  @Input() entries: QTableEntry[] = [];
  states: RiskState[] = ['NORMAL', 'SUSPICIOUS', 'RISKY', 'CRITICAL'];
  actions: AgentAction[] = ['ALLOW', 'MONITOR', 'BLOCK'];
  value(s: RiskState, a: AgentAction) { return this.entries.find(e => e.state === s && e.action === a)?.qValue ?? 0; }
  bestAction(s: RiskState) { return this.actions.reduce((best, a) => this.value(s, a) > this.value(s, best) ? a : best, 'ALLOW' as AgentAction); }
}
