import { Component, OnInit } from '@angular/core';
import { SimulationResponse } from '../../core/models/simulation.models';
import { SimulationService } from '../../core/services/simulation.service';
import { ExperimentsComponent } from '../experiments/experiments.component';
import { LiveSimulationViewComponent } from './live-simulation-view.component';

type LabTab = 'experiment' | 'live';

@Component({
  selector: 'app-laboratory',
  standalone: true,
  imports: [ExperimentsComponent, LiveSimulationViewComponent],
  template: `<section class="page"><div class="hero lab-head"><h1>Experimenta y observa el agente RL</h1><p>Configura entrenamientos o ejecuta la simulación en vivo: ambas vistas usan el mismo estado del backend, la misma Q-table y la misma política aprendida.</p></div><div class="lab-tabs" role="tablist" aria-label="Vistas del laboratorio"><button type="button" role="tab" [attr.aria-selected]="activeTab==='experiment'" [class.active]="activeTab==='experiment'" (click)="setTab('experiment')">Experimento</button><button type="button" role="tab" [attr.aria-selected]="activeTab==='live'" [class.active]="activeTab==='live'" (click)="setTab('live')">Simulación en vivo</button></div>@if(activeTab==='experiment'){<app-experiments [state]="state" (stateChange)="syncState($event)"/>}@else{ @if(error){<p class="notice error panel">{{error}}</p>}<app-live-simulation-view [state]="state" (stateChange)="syncState($event)"/>}</section>`,
  styles: [`.lab-head{padding:var(--space-md);display:block}.lab-head h1{font-size:clamp(1.8rem,3vw,2.55rem);margin:var(--space-xs) 0}.lab-head p{max-width:820px;margin:0;line-height:1.5}.lab-tabs{display:inline-flex;gap:8px;flex-wrap:wrap;margin:var(--space-md) 0;padding:6px;border:1px solid var(--line);border-radius:999px;background:rgba(255,253,248,.72)}.lab-tabs button{border:1px solid transparent;border-radius:999px;background:transparent;color:var(--text);cursor:pointer;font-weight:900;padding:10px 16px}.lab-tabs button.active{background:var(--navy);border-color:var(--navy);color:#fffdf8}.lab-tabs button:not(.active):hover{background:rgba(20,118,110,.1);color:var(--teal)}.panel{margin-top:var(--space-md)}@media(max-width:760px){.lab-tabs{display:grid;border-radius:22px;width:100%}.lab-tabs button{width:100%}}`]
})
export class LaboratoryComponent implements OnInit {
  activeTab: LabTab = 'experiment';
  state: SimulationResponse | null = null;
  error = '';

  constructor(private readonly simulation: SimulationService) {}

  ngOnInit() { this.load(); }
  setTab(tab: LabTab) { this.activeTab = tab; this.load(); }
  syncState(state: SimulationResponse) { this.state = state; }
  private load() { this.simulation.status().subscribe({ next: s => this.state = s, error: () => this.error = 'No se pudo conectar con el backend en /api.' }); }
}
