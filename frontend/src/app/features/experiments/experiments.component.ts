import { DecimalPipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  AgentConfig,
  SimulationResponse,
} from "../../core/models/simulation.models";
import { SimulationService } from "../../core/services/simulation.service";
import { MetricCardComponent } from "../../shared/components/metric-card.component";
import { PolicySummaryComponent } from "../../shared/components/policy-summary.component";
import { QTableComponent } from "../../shared/components/q-table.component";

type ConfigPreset = "manual" | "conservative" | "balanced" | "exploratory";

interface ConfigPresetOption {
  label: string;
  description: string;
  config: AgentConfig;
}

const CONFIG_PRESETS: Record<
  Exclude<ConfigPreset, "manual">,
  ConfigPresetOption
> = {
  conservative: {
    label: "Conservadora",
    description:
      "Aprendizaje estable, poca exploración y eventos más fáciles de distinguir.",
    config: {
      alpha: 0.1,
      gamma: 0.9,
      epsilon: 0.05,
      anomalyProbability: 0.2,
      environmentDifficulty: "EASY",
    },
  },
  balanced: {
    label: "Equilibrada",
    description:
      "Balance entre aprendizaje, exploración y dificultad del entorno.",
    config: {
      alpha: 0.2,
      gamma: 0.9,
      epsilon: 0.1,
      anomalyProbability: 0.25,
      environmentDifficulty: "MEDIUM",
    },
  },
  exploratory: {
    label: "Exploratoria",
    description:
      "Más exploración y eventos más ambiguos; útil para observar errores y adaptación.",
    config: {
      alpha: 0.3,
      gamma: 0.8,
      epsilon: 0.35,
      anomalyProbability: 0.4,
      environmentDifficulty: "HARD",
    },
  },
};

@Component({
  selector: "app-experiments",
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    MetricCardComponent,
    QTableComponent,
    PolicySummaryComponent,
  ],
  template: `<section class="experiment-view">
    <div class="hero inner-hero">
      <h2>Configura y observa el aprendizaje</h2>
      <p>
        Ajusta los parámetros, entrena por lotes y revisa cómo cambian las
        métricas, la Q-table y la política aprendida del agente.
      </p>
    </div>
    <div class="grid two panel">
      <article class="card config-card">
        <div class="section-head">
          <div>
            <h3>Parámetros del agente</h3>
            <p class="muted">
              Estos valores se aplican al backend y afectan tanto el
              entrenamiento por lotes como la simulación en vivo.
            </p>
          </div>
        </div>
        <div class="preset-row">
          <label
            >Plantilla de configuración<select
              [(ngModel)]="selectedPreset"
              name="configPreset"
              (ngModelChange)="selectPreset($event)"
            >
              <option value="manual">Manual</option>
              <option value="conservative">Conservadora</option>
              <option value="balanced">Equilibrada</option>
              <option value="exploratory">Exploratoria</option>
            </select></label
          >
          <div>
            <p class="preset-help">
              Selecciona una plantilla para cargar valores sugeridos. Luego
              pulsa Aplicar configuración para enviarlos al backend.
            </p>
            <p class="preset-description">{{ presetDescription }}</p>
          </div>
        </div>
        <form class="config-grid" (ngSubmit)="applyConfig()">
          <label
            >Alpha <b>{{ config.alpha | number: "1.2-2" }}</b
            ><input
              type="range"
              min="0"
              max="1"
              step="0.05"
              [(ngModel)]="config.alpha"
              name="alpha"
              (ngModelChange)="markManual()"
            /><small
              >Tasa de aprendizaje: más alta cambia la Q-table con mayor
              rapidez.</small
            ></label
          ><label
            >Gamma <b>{{ config.gamma | number: "1.2-2" }}</b
            ><input
              type="range"
              min="0"
              max="1"
              step="0.05"
              [(ngModel)]="config.gamma"
              name="gamma"
              (ngModelChange)="markManual()"
            /><small
              >Descuento futuro: más alto valora recompensas posteriores.</small
            ></label
          ><label
            >Epsilon <b>{{ config.epsilon | number: "1.2-2" }}</b
            ><input
              type="range"
              min="0"
              max="1"
              step="0.05"
              [(ngModel)]="config.epsilon"
              name="epsilon"
              (ngModelChange)="markManual()"
            /><small
              >Exploración: más alto prueba acciones menos conocidas.</small
            ></label
          ><label
            >Probabilidad de anomalías
            <b>{{ config.anomalyProbability | number: "1.2-2" }}</b
            ><input
              type="range"
              min="0"
              max="1"
              step="0.05"
              [(ngModel)]="config.anomalyProbability"
              name="anomalyProbability"
              (ngModelChange)="markManual()"
            /><small
              >Frecuencia esperada de eventos maliciosos simulados.</small
            ></label
          >
          <div class="config-actions-row">
            <label
              >Dificultad<select
                [(ngModel)]="config.environmentDifficulty"
                name="environmentDifficulty"
              >
                <option value="EASY">Fácil</option>
                <option value="MEDIUM">Media</option>
                <option value="HARD">Difícil</option></select
              ><small
                >Controla qué tan ambiguos o exigentes son los eventos.</small
              ></label
            ><button
              class="btn apply"
              type="submit"
              [disabled]="simulationLoading || !validConfig()"
            >
              Aplicar configuración
            </button>
          </div>
        </form>
      </article>
      <article class="card train-card">
        <h3>Entrenamiento por lotes</h3>
        <p class="muted">
          Ejecuta múltiples episodios para reforzar la política antes de
          observar decisiones individuales en la simulación en vivo.
        </p>
        <div class="train-actions">
          @for (n of [10, 100, 500, 1000]; track n) {
            <button
              class="btn secondary"
              (click)="train(n)"
              [disabled]="simulationLoading"
            >
              Entrenar {{ n }}
            </button>
          }
          <button
            class="btn danger"
            (click)="reset()"
            [disabled]="simulationLoading"
          >
            Resetear aprendizaje
          </button>
        </div>
        <ol class="guide">
          <li>Configura los parámetros.</li>
          <li>Entrena por lotes.</li>
          <li>Revisa métricas, Q-table y política.</li>
          <li>
            Cambia a simulación en vivo para ver el mismo modelo actuando paso a
            paso.
          </li>
        </ol>
      </article>
    </div>
    @if (error) {
      <p class="notice error panel">{{ error }}</p>
    }
    @if (success) {
      <p class="notice loading panel">{{ success }}</p>
    }
    @if (state) {
      <div class="metrics-grid panel">
        <app-metric-card
          label="Episodios"
          helper="Cantidad de experiencias procesadas"
          [value]="state.metrics.episodes"
        /><app-metric-card
          label="Precisión"
          helper="Decisiones correctas sobre el total"
          [value]="formatAccuracy(state)"
        /><app-metric-card
          label="Recompensa media"
          helper="Promedio acumulado por episodio"
          [value]="formatAverageReward(state)"
        /><app-metric-card
          label="Falsos positivos"
          helper="Tráfico normal bloqueado"
          [value]="state.metrics.falsePositives"
        /><app-metric-card
          label="Falsos negativos"
          helper="Anomalías permitidas"
          [value]="state.metrics.falseNegatives"
        />
      </div>
      <div class="grid two panel learning-grid">
        <app-q-table [entries]="state.qTable" /><app-policy-summary
          [policy]="state.learnedPolicy"
        />
      </div>
      <article class="card panel">
        <h3>Cómo interpretar los resultados</h3>
        <ul class="guide">
          <li>
            <b>Precisión:</b> indica proporción de decisiones correctas, pero
            debe revisarse junto con falsos positivos y falsos negativos.
          </li>
          <li>
            <b>Falsos positivos:</b> bloqueos de tráfico normal; demasiados
            reducen usabilidad.
          </li>
          <li>
            <b>Falsos negativos:</b> amenazas permitidas; son críticos en
            defensa.
          </li>
          <li>
            <b>Recompensa media:</b> resume si las acciones elegidas están
            alineadas con el objetivo del entorno.
          </li>
        </ul>
      </article>
    } @else {
      <p class="empty card panel">Cargando estado del agente...</p>
    }
  </section>`,
  styles: [
    `
      .experiment-view {
        display: block;
      }
      .inner-hero {
        padding: var(--space-md);
        display: block;
      }
      .inner-hero h2 {
        font-size: clamp(1.45rem, 2.2vw, 2rem);
        margin: var(--space-xs) 0;
      }
      .inner-hero p {
        max-width: 820px;
        margin: 0;
      }
      .panel {
        margin-top: 20px;
      }
      .section-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 16px;
      }
      .amber {
        background: rgba(217, 119, 6, 0.12);
        color: var(--amber);
      }
      .preset-row {
        display: grid;
        grid-template-columns: minmax(180px, 0.45fr) minmax(0, 1fr);
        gap: 12px;
        align-items: start;
        margin-bottom: 16px;
        padding: 12px;
        border: 1px solid rgba(217, 119, 6, 0.22);
        border-radius: 18px;
        background: rgba(217, 119, 6, 0.06);
      }
      .preset-row label {
        display: grid;
        gap: 6px;
        font-weight: 900;
        color: var(--navy);
      }
      .preset-row select {
        border: 1px solid var(--line);
        border-radius: 14px;
        background: #fffefa;
        color: var(--navy);
        padding: 10px 12px;
        font-weight: 800;
      }
      .preset-help {
        margin: 0;
        color: var(--muted);
        font-size: 0.9rem;
        font-weight: 700;
        line-height: 1.4;
      }
      .preset-description {
        margin: 4px 0 0;
        color: var(--navy);
        font-weight: 800;
        line-height: 1.35;
      }
      .config-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }
      .config-grid label {
        display: grid;
        gap: 6px;
        font-weight: 900;
        color: var(--navy);
      }
      .config-grid b {
        color: var(--teal);
      }
      .config-grid small {
        color: var(--muted);
        font-weight: 700;
        line-height: 1.35;
      }
      .config-grid input[type="range"] {
        accent-color: var(--teal);
      }
      .config-grid select {
        border: 1px solid var(--line);
        border-radius: 14px;
        background: #fffefa;
        color: var(--navy);
        padding: 10px 12px;
        font-weight: 800;
      }
      .config-actions-row {
        grid-column: 1/-1;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 16px;
        align-items: start;
      }
      .apply {
        background: var(--amber);
        min-width: 210px;
        justify-self: end;
        margin-top: 25px;
      }
      .train-card {
        display: grid;
        align-content: start;
      }
      .train-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 14px;
      }
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: var(--space-xs);
      }
      .learning-grid {
        grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.75fr);
        align-items: start;
      }
      .guide {
        margin: 16px 0 0;
        padding-left: 20px;
      }
      .guide li {
        margin: 8px 0;
      }
      .empty {
        text-align: center;
        color: var(--muted);
        padding: 20px;
      }
      @media (max-width: 980px) {
        .metrics-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .learning-grid {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 760px) {
        .config-grid,
        .metrics-grid,
        .preset-row,
        .config-actions-row {
          grid-template-columns: 1fr;
        }
        .section-head {
          display: grid;
        }
        .apply {
          width: 100%;
          min-width: 0;
          justify-self: stretch;
          margin-top: 0;
        }
      }
    `,
  ],
})
export class ExperimentsComponent implements OnInit, OnChanges {
  @Input() state: SimulationResponse | null = null;
  @Output() stateChange = new EventEmitter<SimulationResponse>();

  config: AgentConfig = {
    alpha: 0.2,
    gamma: 0.9,
    epsilon: 0.2,
    anomalyProbability: 0.3,
    environmentDifficulty: "MEDIUM",
  };
  simulationLoading = false;
  error = "";
  success = "";
  selectedPreset: ConfigPreset = "manual";
  presetDescription = "Configura manualmente cada parámetro del agente.";

  constructor(private readonly simulation: SimulationService) {}

  ngOnInit() {
    this.loadState();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes["state"]?.currentValue)
      this.setState(changes["state"].currentValue, false);
  }
  loadState() {
    this.simulationLoading = true;
    this.error = "";
    this.simulation.status().subscribe({
      next: (s) => this.setState(s),
      error: () => {
        this.error = "No se pudo cargar la configuración del agente.";
        this.simulationLoading = false;
      },
    });
  }
  applyConfig() {
    if (!this.validConfig()) return;
    this.simulationLoading = true;
    this.error = "";
    this.success = "";
    this.simulation.updateConfig(this.config).subscribe({
      next: (s) => {
        this.setState(s);
        this.success = "Configuración aplicada correctamente.";
      },
      error: () => {
        this.error = "No se pudo aplicar la configuración.";
        this.simulationLoading = false;
      },
    });
  }
  train(episodes: number) {
    this.simulationLoading = true;
    this.error = "";
    this.success = "";
    this.simulation.train({ ...this.config, episodes }).subscribe({
      next: (s) => {
        this.setState(s);
        this.success = `Entrenamiento de ${episodes} episodios completado.`;
      },
      error: () => {
        this.error = "No se pudo entrenar el agente.";
        this.simulationLoading = false;
      },
    });
  }
  reset() {
    this.simulationLoading = true;
    this.error = "";
    this.success = "";
    this.simulation.reset().subscribe({
      next: (s) => {
        this.setState(s);
        this.success = "Aprendizaje reiniciado.";
      },
      error: () => {
        this.error = "No se pudo resetear la simulación.";
        this.simulationLoading = false;
      },
    });
  }
  selectPreset(preset: ConfigPreset) {
    this.selectedPreset = preset;
    if (preset === "manual") {
      this.presetDescription =
        "Configura manualmente cada parámetro del agente.";
      return;
    }
    const selected = CONFIG_PRESETS[preset];
    this.config = { ...selected.config };
    this.presetDescription = selected.description;
  }
  markManual() {
    if (this.selectedPreset !== "manual") this.selectedPreset = "manual";
    this.presetDescription =
      "Valores modificados manualmente. Pulsa Aplicar configuración para enviarlos al backend.";
  }
  validConfig() {
    return ["alpha", "gamma", "epsilon", "anomalyProbability"].every((k) => {
      const v = this.config[k as keyof AgentConfig] as number;
      return v >= 0 && v <= 1;
    });
  }
  formatAccuracy(state: SimulationResponse) {
    return `${state.metrics.accuracy.toFixed(1)}%`;
  }
  formatAverageReward(state: SimulationResponse) {
    return state.metrics.averageReward.toFixed(2);
  }
  private setState(state: SimulationResponse, emit = true) {
    this.state = state;
    this.config = { ...state.config };
    this.syncPresetFromConfig(state.config);
    this.simulationLoading = false;
    if (emit) this.stateChange.emit(state);
  }
  private syncPresetFromConfig(config: AgentConfig) {
    const matchingPreset = Object.entries(CONFIG_PRESETS).find(
      ([, preset]) => this.sameConfig(config, preset.config),
    )?.[0] as Exclude<ConfigPreset, "manual"> | undefined;

    if (matchingPreset) {
      this.selectedPreset = matchingPreset;
      this.presetDescription = CONFIG_PRESETS[matchingPreset].description;
      return;
    }

    this.selectedPreset = "manual";
    this.presetDescription = "Configura manualmente cada parámetro del agente.";
  }
  private sameConfig(a: AgentConfig, b: AgentConfig) {
    return (
      a.alpha === b.alpha &&
      a.gamma === b.gamma &&
      a.epsilon === b.epsilon &&
      a.anomalyProbability === b.anomalyProbability
    );
  }
}
