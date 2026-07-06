import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExperimentResponse } from '../../core/models/experiment.models';
import { ExperimentService } from '../../core/services/experiment.service';

@Component({
  selector: 'app-experiments',
  standalone: true,
  imports: [FormsModule, DatePipe, DecimalPipe],
  template: `<section class="page"><div class="hero"><span class="pill">Experimentos</span><h1>Guardar y comparar ejecuciones</h1><p>Un experimento conserva una fotografía del agente actual: configuración, métricas y desempeño acumulado. Compararlos ayuda a ver cómo alpha, gamma, epsilon o la dificultad cambian el aprendizaje.</p><form class="save" (ngSubmit)="save()"><input [(ngModel)]="name" name="name" placeholder="Nombre del experimento" required><button class="btn" [disabled]="!name.trim()||loading">{{loading ? 'Guardando...' : 'Guardar experimento'}}</button></form></div><div class="grid two panel"><article class="card"><h3>Cómo usar esta sección</h3><ol class="steps"><li>Entrena el agente en el laboratorio.</li><li>Guarda una ejecución.</li><li>Cambia parámetros como epsilon o dificultad.</li><li>Entrena nuevamente.</li><li>Compara resultados.</li></ol></article><article class="card"><h3>Cómo interpretar la comparación</h3><ul class="guide"><li>Accuracy alto indica mejores decisiones generales.</li><li>Falsos positivos son eventos normales bloqueados.</li><li>Falsos negativos son anomalías permitidas.</li><li>Recompensa total compara desempeño acumulado.</li><li>Epsilon alto suele generar más exploración y resultados más variables.</li></ul></article></div>@if(loading){<p class="notice loading panel">Sincronizando experimentos con el backend.</p>}@if(success){<p class="notice success panel">{{success}}</p>}@if(error){<p class="notice error panel">{{error}}</p>}<article class="card panel"><div class="section-head"><div><h3>Comparación</h3><p class="muted">Ordena visualmente resultados por precisión, recompensa y errores.</p></div><span class="pill">{{experiments.length}} guardados</span></div><div class="table-wrap"><table><thead><tr><th>Nombre</th><th>Episodios</th><th>Alpha</th><th>Gamma</th><th>Epsilon</th><th>Accuracy</th><th>Recomp. total</th><th>Recomp. prom.</th><th>FP</th><th>FN</th><th>Dificultad</th><th>Fecha</th><th></th></tr></thead><tbody>@for(e of experiments;track e.id){<tr><td><b>{{e.name}}</b></td><td>{{e.metrics.episodes}}</td><td>{{e.config.alpha}}</td><td>{{e.config.gamma}}</td><td>{{e.config.epsilon}}</td><td><b class="positive">{{e.metrics.accuracy|number:'1.1-2'}}</b></td><td>{{e.metrics.totalReward|number:'1.1-2'}}</td><td>{{e.metrics.averageReward|number:'1.2-2'}}</td><td>{{e.metrics.falsePositives}}</td><td>{{e.metrics.falseNegatives}}</td><td>{{e.config.environmentDifficulty}}</td><td>{{e.createdAt|date:'short'}}</td><td><button class="btn danger compact" (click)="remove(e.id)" [disabled]="loading">Eliminar</button></td></tr>}@empty{<tr><td colspan="13"><p class="empty-state">No hay experimentos guardados. Entrena el agente desde el laboratorio y guarda al menos dos ejecuciones para comparar configuraciones.</p></td></tr>}</tbody></table></div></article></section>`,
  styles: [`.panel{margin-top:20px}.save{display:grid;grid-template-columns:minmax(220px,420px) auto;gap:10px;margin-top:20px}.section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:16px}.steps,.guide{margin:12px 0 0;padding-left:20px}.steps li,.guide li{margin:8px 0}.compact{min-height:34px;padding:7px 12px;font-size:.84rem}@media(max-width:760px){.save{grid-template-columns:1fr}.section-head{display:grid}.compact{width:auto}}`]
})
export class ExperimentsComponent implements OnInit {
  experiments: ExperimentResponse[] = [];
  name = '';
  loading = false;
  error = '';
  success = '';

  constructor(private readonly experimentsApi: ExperimentService) {}

  ngOnInit() { this.load(); }
  load() { this.loading = true; this.error = ''; this.experimentsApi.list().subscribe({ next: r => { this.experiments = r; this.loading = false; }, error: () => { this.error = 'No se pudieron cargar experimentos.'; this.loading = false; } }); }
  save() { if (!this.name.trim()) return; this.loading = true; this.error = ''; this.success = ''; this.experimentsApi.save({ name: this.name.trim() }).subscribe({ next: () => { this.name = ''; this.success = 'Experimento guardado correctamente.'; this.load(); }, error: () => { this.error = 'No se pudo guardar el experimento actual.'; this.loading = false; } }); }
  remove(id: number) { this.loading = true; this.error = ''; this.success = ''; this.experimentsApi.delete(id).subscribe({ next: () => { this.success = 'Experimento eliminado.'; this.load(); }, error: () => { this.error = 'No se pudo eliminar el experimento.'; this.loading = false; } }); }
}
