import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PolicyEntry } from '../../core/models/simulation.models';

@Component({
  selector: 'app-policy-summary',
  standalone: true,
  imports: [DecimalPipe],
  template: `<article class="card"><h3>Política aprendida</h3>@if(policy.length){<div class="grid two policy-grid">@for(p of policy;track p.state){<div class="policy"><b>{{p.state}}</b><span>{{p.bestAction}}</span><small>valor {{p.expectedValue|number:'1.2-2'}}</small></div>}</div>}@else{<p class="empty-state">Entrena el agente para ver la política sugerida por estado.</p>}</article>`,
  styles: [`.policy-grid{margin-top:12px}.policy{border:1px solid var(--line);border-radius:18px;padding:14px;display:grid;gap:5px;background:rgba(246,241,232,.36)}.policy span{color:var(--teal);font-weight:900;font-size:1.08rem}`]
})
export class PolicySummaryComponent { @Input() policy: PolicyEntry[] = []; }
