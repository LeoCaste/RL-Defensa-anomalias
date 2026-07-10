import { DecimalPipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SimulationResult } from "../../core/models/simulation.models";
import { DisplayLabelPipe } from "../pipes/display-label.pipe";

@Component({
  selector: "app-decision-card",
  standalone: true,
  imports: [DecimalPipe, DisplayLabelPipe],
  template: `<article class="card decision-card">
    <h3>Decisión del agente</h3>
    @if (result) {
      <div class="decision">
        <span class="pill">{{ result.action | labelEs }}</span
        ><strong
          [class.positive]="result.reward >= 0"
          [class.negative]="result.reward < 0"
          >{{ result.reward | number: "1.1-2" }}</strong
        >
      </div>
      <div class="decision-steps">
        <p>
          <span>Estado observado</span><b>{{ result.state | labelEs }}</b>
        </p>
        <p>
          <span>Acción elegida</span><b>{{ result.action | labelEs }}</b>
        </p>
        <p>
          <span>Modo</span
          ><b>{{ result.exploration ? "Exploración" : "Explotación" }}</b>
        </p>
        <p>
          <span>Recompensa</span
          ><b
            [class.positive]="result.reward >= 0"
            [class.negative]="result.reward < 0"
            >{{ result.reward | number: "1.1-2" }}</b
          >
        </p>
        <p>
          <span>Resultado</span><b>{{ result.outcomeType | labelEs }}</b>
        </p>
        <p>
          <span>Siguiente estado</span><b>{{ result.nextState | labelEs }}</b>
        </p>
      </div>
      <p class="muted">
        <b>Interpretación:</b> {{ result.explanation | labelEs: "text" }}
      </p>
      <p class="q-effect">
        <b>Efecto sobre Q-table:</b> la recompensa
        {{ result.reward >= 0 ? "aumenta o mantiene" : "penaliza" }} la utilidad
        esperada de {{ result.state | labelEs }} →
        {{ result.action | labelEs }}.
      </p>
    } @else {
      <p class="empty-state">
        Pulsa “Ejecutar evento” para ver cómo el agente transforma un estado en
        una acción, recibe recompensa y actualiza la Q-table.
      </p>
    }
  </article>`,
  styles: [
    `
      .decision-card {
        min-height: 100%;
      }
      .decision {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-sm);
        margin-bottom: var(--space-sm);
      }
      .decision strong {
        font-size: 2rem;
        line-height: 1;
      }
      .decision-steps {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: var(--space-md);
        row-gap: var(--space-sm);
        margin-bottom: var(--space-sm);
      }
      .decision-steps p {
        border: 1px solid var(--line);
        border-radius: 14px;
        background: rgba(246, 241, 232, 0.42);
        padding: var(--space-sm);
        margin: 0;
        display: grid;
        gap: var(--space-xs);
      }
      .decision-steps span {
        color: var(--muted);
        font-size: 0.76rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .decision-steps b {
        color: var(--navy);
      }
      .q-effect {
        border-left: 4px solid var(--teal);
        padding-left: var(--space-sm);
        color: var(--navy);
        margin-top: var(--space-sm);
      }
      @media (max-width: 760px) {
        .decision-steps {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DecisionCardComponent {
  @Input() result: SimulationResult | null = null;
}
