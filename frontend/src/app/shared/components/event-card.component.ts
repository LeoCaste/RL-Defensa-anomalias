import { Component, Input } from '@angular/core';
import { NetworkEvent } from '../../core/models/simulation.models';

@Component({
  selector: 'app-event-card',
  standalone: true,
  template: `<article class="card signal-card"><h3>Evento actual</h3>@if(event){<p><span class="pill">{{event.riskState}}</span> <b>{{event.eventType}}</b> · {{event.realLabel}}</p><p class="muted">Estas señales se convierten en el estado RL que el agente usa para decidir.</p><div class="grid two signals"><span>Logins fallidos <b>{{event.failedLogins}}</b></span><span>Frecuencia <b>{{event.connectionFrequency}}</b></span><span>Puerto <b>{{event.targetPort}}</b></span><span>Reputación IP <b>{{event.ipReputation}}</b></span><span>Tráfico <b>{{event.trafficVolume}}</b></span></div>}@else{<p class="empty-state">Primer paso: pulsa “Ejecutar evento”. Aquí aparecerán las señales de red simuladas y el estado RL observado por el agente.</p>}</article>`,
  styles: [`.signal-card{min-height:100%}.signals{margin-top:var(--space-sm);column-gap:var(--space-md);row-gap:var(--space-sm)}.signals span{border:1px solid var(--line);border-radius:16px;padding:var(--space-sm);background:rgba(246,241,232,.34);display:flex;justify-content:space-between;gap:var(--space-sm);align-items:center}`]
})
export class EventCardComponent { @Input() event: NetworkEvent | null = null; }
