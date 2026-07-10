import { DecimalPipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import {
  AgentAction,
  QTableEntry,
  RiskState,
} from "../../core/models/simulation.models";
import { DisplayLabelPipe } from "../pipes/display-label.pipe";

@Component({
  selector: "app-q-table",
  standalone: true,
  imports: [DecimalPipe, DisplayLabelPipe],
  template: `<article class="card q-card">
    <div class="head">
      <div>
        <h3>Q-table</h3>
        <p class="muted">
          La Q-table muestra valores aprendidos, no recompensas inmediatas. La
          celda resaltada indica la acción preferida para cada estado.
        </p>
      </div>
    </div>
    @if (hasLearning()) {
      <div class="table-wrap q-wrap">
        <table>
          <thead>
            <tr>
              <th>Estado</th>
              @for (a of actions; track a) {
                <th>{{ a | labelEs }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (s of states; track s) {
              <tr>
                <th>
                  <span
                    class="state"
                    [class.normal]="s === 'NORMAL'"
                    [class.critical]="s === 'CRITICAL'"
                    >{{ s | labelEs }}</span
                  >
                </th>
                @for (a of actions; track a) {
                  <td [class.best]="bestAction(s) === a">
                    {{ value(s, a) | number: "1.2-2" }}
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    } @else {
      <p class="empty-state">
        La tabla inicia sin utilidad aprendida. Ejecuta eventos o entrena por
        lotes para que cada estado-acción acumule valores Q y revele una acción
        preferida.
      </p>
    }
  </article>`,
  styles: [
    `
      .q-card {
        min-width: 0;
      }
      .head {
        display: flex;
        justify-content: space-between;
        gap: var(--space-sm);
        align-items: start;
        margin-bottom: var(--space-md);
      }
      .head h3 {
        margin-bottom: var(--space-xs);
      }
      .head p {
        max-width: 620px;
      }
      .q-wrap table {
        min-width: 0;
      }
      .q-wrap th,
      .q-wrap td {
        padding: var(--space-sm);
        text-align: right;
      }
      .q-wrap thead th:first-child,
      .q-wrap tbody th {
        text-align: left;
      }
      .best {
        background: var(--soft-teal);
        color: var(--teal);
        font-weight: 900;
        box-shadow: inset 0 0 0 2px rgba(20, 118, 110, 0.18);
      }
      .state {
        font-weight: 900;
        color: var(--amber);
      }
      .state.normal {
        color: var(--green);
      }
      .state.critical {
        color: var(--red);
      }
      td {
        font-variant-numeric: tabular-nums;
        font-size: 1rem;
      }
      @media (max-width: 760px) {
        .head {
          display: grid;
        }
        .q-wrap th,
        .q-wrap td {
          padding: var(--space-xs);
          font-size: 0.82rem;
        }
        .state {
          font-size: 0.76rem;
        }
      }
    `,
  ],
})
export class QTableComponent {
  @Input() entries: QTableEntry[] = [];
  states: RiskState[] = ["NORMAL", "SUSPICIOUS", "RISKY", "CRITICAL"];
  actions: AgentAction[] = ["ALLOW", "MONITOR", "BLOCK"];
  value(s: RiskState, a: AgentAction) {
    return (
      this.entries.find((e) => e.state === s && e.action === a)?.qValue ?? 0
    );
  }
  bestAction(s: RiskState) {
    return this.actions.reduce(
      (best, a) => (this.value(s, a) > this.value(s, best) ? a : best),
      "ALLOW" as AgentAction,
    );
  }
  hasLearning() {
    return this.entries.some((e) => e.qValue !== 0);
  }
}
