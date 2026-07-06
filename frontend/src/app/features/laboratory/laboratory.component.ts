import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgentAction, AgentConfig, SimulationResponse } from '../../core/models/simulation.models';
import { SimulationService } from '../../core/services/simulation.service';
import { DecisionCardComponent } from '../../shared/components/decision-card.component';
import { EventCardComponent } from '../../shared/components/event-card.component';
import { HistoryTableComponent } from '../../shared/components/history-table.component';
import { MetricCardComponent } from '../../shared/components/metric-card.component';
import { PolicySummaryComponent } from '../../shared/components/policy-summary.component';
import { QTableComponent } from '../../shared/components/q-table.component';

@Component({
  selector: 'app-laboratory',
  standalone: true,
  imports: [FormsModule, DecimalPipe, EventCardComponent, DecisionCardComponent, MetricCardComponent, QTableComponent, PolicySummaryComponent, HistoryTableComponent],
  template: `<section class="page"><div class="hero lab-head"><div><span class="pill">Laboratorio interactivo</span><h1>Entrena el agente defensor</h1><p>Ejecuta pasos individuales o lotes de entrenamiento. Observa cómo cambian decisión, recompensa, Q-table y métricas.</p></div><div class="actions"><button class="btn primary-action" (click)="step()" [disabled]="loading">{{loading ? 'Procesando...' : 'Ejecutar evento'}}</button>@for(n of [10,100,500,1000];track n){<button class="btn secondary" (click)="train(n)" [disabled]="loading">Entrenar {{n}}</button>}<button class="btn danger" (click)="reset()" [disabled]="loading">Resetear</button></div></div>@if(loading){<p class="notice loading panel">Operación en curso. El backend está actualizando el estado del agente.</p>}@if(error){<p class="notice error panel">{{error}}</p>}@if(state){<div class="grid two panel"><app-event-card [event]="state.currentResult?.event ?? null"/><app-decision-card [result]="state.currentResult"/></div><div class="grid three panel"><app-metric-card label="Episodios" [value]="state.metrics.episodes"/><app-metric-card label="Accuracy" [value]="(state.metrics.accuracy|number:'1.1-2')!"/><app-metric-card label="Recompensa media" [value]="(state.metrics.averageReward|number:'1.2-2')!"/></div><div class="grid two panel"><section class="card config-card"><h3>Hiperparámetros</h3><form class="grid two config-grid" (ngSubmit)="applyConfig()"><label>Alpha <input type="range" min="0" max="1" step="0.01" [(ngModel)]="config.alpha" name="alpha"><small>{{config.alpha}} · aprendizaje</small></label><label>Gamma <input type="range" min="0" max="1" step="0.01" [(ngModel)]="config.gamma" name="gamma"><small>{{config.gamma}} · recompensa futura</small></label><label>Epsilon <input type="range" min="0" max="1" step="0.01" [(ngModel)]="config.epsilon" name="epsilon"><small>{{config.epsilon}} · exploración</small></label><label>Anomalías <input type="range" min="0" max="1" step="0.01" [(ngModel)]="config.anomalyProbability" name="anomalyProbability"><small>{{config.anomalyProbability}} · probabilidad</small></label><label>Dificultad <select [(ngModel)]="config.environmentDifficulty" name="environmentDifficulty"><option>EASY</option><option>MEDIUM</option><option>HARD</option></select><small>separación de señales</small></label><button class="btn warn apply" type="submit" [disabled]="loading || !validConfig()">Aplicar configuración</button></form></section><section class="card"><h3>Distribución de acciones</h3>@for(row of actionRows();track row.action){<div class="action-row"><p><b>{{row.action}}</b><span>{{row.count}}</span></p><div class="bar"><span [style.width.%]="row.percent"></span></div></div>}<h3 class="reward-title">Recompensas recientes</h3>@if(rewardBars().length){<div class="spark">@for(v of rewardBars();track $index){<span [style.height.%]="v"></span>}</div>}@else{<p class="empty-state">Sin recompensas registradas todavía.</p>}</section></div><div class="grid two panel"><app-q-table [entries]="state.qTable"/><app-policy-summary [policy]="state.learnedPolicy"/></div><app-history-table class="panel" [history]="state.recentHistory"/>}@else if(!loading && !error){<p class="empty-state panel">No hay estado disponible. Verifica que el backend esté iniciado.</p>}</section>`,
  styles: [`.lab-head{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);gap:24px;align-items:start}.actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-content:start}.primary-action{grid-column:1/-1}.panel{margin-top:20px}.config-card form{margin-top:12px}.config-grid{align-items:end}.apply{align-self:end}.action-row{display:grid;gap:8px;margin-top:14px}.action-row p{display:flex;justify-content:space-between;gap:12px;margin:0}.reward-title{margin-top:24px}.spark{height:128px;display:flex;gap:4px;align-items:end;border-bottom:1px solid var(--line);padding-top:12px}.spark span{width:100%;min-width:4px;background:linear-gradient(180deg,var(--teal),#8BC7BE);border-radius:6px 6px 0 0}@media(max-width:980px){.lab-head{grid-template-columns:1fr}.actions{grid-template-columns:repeat(3,minmax(0,1fr))}.primary-action{grid-column:auto}}@media(max-width:760px){.actions{grid-template-columns:1fr}.primary-action{grid-column:auto}}`]
})
export class LaboratoryComponent implements OnInit {
  state: SimulationResponse | null = null;
  loading = false;
  error = '';
  config: AgentConfig = { alpha: .2, gamma: .9, epsilon: .2, anomalyProbability: .3, environmentDifficulty: 'MEDIUM' };

  constructor(private readonly simulation: SimulationService) {}

  ngOnInit() { this.load(); }
  load() { this.run(() => this.simulation.status()); }
  step() { this.run(() => this.simulation.step()); }
  train(episodes: number) { this.run(() => this.simulation.train({ ...this.config, episodes })); }
  reset() { this.run(() => this.simulation.reset()); }
  applyConfig() { if (this.validConfig()) this.run(() => this.simulation.updateConfig(this.config)); }
  validConfig() { return ['alpha', 'gamma', 'epsilon', 'anomalyProbability'].every(k => { const v = this.config[k as keyof AgentConfig] as number; return v >= 0 && v <= 1; }); }
  actionRows() { const m = this.state?.metrics; const rows: { action: AgentAction; count: number }[] = [{ action: 'ALLOW', count: m?.allowedEvents ?? 0 }, { action: 'MONITOR', count: m?.monitoredEvents ?? 0 }, { action: 'BLOCK', count: m?.blockedEvents ?? 0 }]; const max = Math.max(1, ...rows.map(r => r.count)); return rows.map(r => ({ ...r, percent: r.count / max * 100 })); }
  rewardBars() { const h = this.state?.rewardHistory.slice(-40) ?? []; if (!h.length) return []; const min = Math.min(...h), max = Math.max(...h); return h.map(v => max === min ? 50 : 10 + ((v - min) / (max - min)) * 90); }
  private run(call: () => ReturnType<SimulationService['status']>) { this.loading = true; this.error = ''; call().subscribe({ next: s => { this.state = s; this.config = { ...s.config }; this.loading = false; }, error: () => { this.error = 'No se pudo conectar con el backend en http://localhost:8080/api.'; this.loading = false; } }); }
}
