import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PolicyEntry } from '../../core/models/simulation.models';

@Component({
  selector: 'app-policy-summary',
  standalone: true,
  imports: [DecimalPipe],
  template: `<article class="card"><h3>Política aprendida</h3><p class="muted">La política resume la mejor acción actual por estado según la Q-table.</p>@if(hasLearning()){ @if(matchesExpected()){<p class="policy-ok">Lectura coherente: NORMAL → ALLOW, SUSPICIOUS → MONITOR, RISKY/CRITICAL → BLOCK.</p>}<div class="grid two policy-grid">@for(p of policy;track p.state){<div class="policy" [class.expected]="isExpected(p.state,p.bestAction)"><b>{{p.state}}</b><span>{{p.bestAction}}</span><small>valor {{p.expectedValue|number:'1.2-2'}}</small></div>}</div>}@else{<p class="empty-state">Entrena el agente para que la Q-table deje de estar en cero. Aquí se resumirá la mejor acción aprendida para cada estado.</p>}</article>`,
  styles: [`.policy-grid{margin-top:12px}.policy{border:1px solid var(--line);border-radius:18px;padding:14px;display:grid;gap:5px;background:rgba(246,241,232,.36)}.policy.expected{border-color:rgba(21,128,61,.26);background:rgba(21,128,61,.06)}.policy span{color:var(--teal);font-weight:900;font-size:1.08rem}.policy-ok{border:1px solid rgba(21,128,61,.24);background:rgba(21,128,61,.07);color:var(--green);border-radius:14px;padding:10px 12px;font-weight:800}`]
})
export class PolicySummaryComponent {
  @Input() policy: PolicyEntry[] = [];
  isExpected(state: PolicyEntry['state'], action: PolicyEntry['bestAction']) { return (state === 'NORMAL' && action === 'ALLOW') || (state === 'SUSPICIOUS' && action === 'MONITOR') || ((state === 'RISKY' || state === 'CRITICAL') && action === 'BLOCK'); }
  hasLearning() { return this.policy.some(p => p.expectedValue !== 0); }
  matchesExpected() { return this.policy.length >= 4 && this.policy.every(p => this.isExpected(p.state, p.bestAction)); }
}
