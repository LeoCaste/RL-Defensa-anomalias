import { Component } from "@angular/core";
@Component({
  selector: "app-q-learning",
  standalone: true,
  template: `<section class="page">
    <div class="hero">
      <h1>Una tabla que aprende valores de decisión</h1>
      <p>
        Q-Learning estima qué tan conveniente es ejecutar una acción en un
        estado. En este laboratorio, cada celda Q(estado, acción) cambia después
        de observar recompensa y siguiente estado.
      </p>
    </div>
    <article class="card formula-card">
      <h3>Regla de actualización</h3>
      <code>Q(s,a) ← Q(s,a) + α [r + γ max Q(s',a') - Q(s,a)]</code>
      <p class="muted">
        La diferencia entre lo esperado y lo observado empuja el valor Q hacia
        arriba o hacia abajo.
      </p>
    </article>
    <div class="grid two panel">
      <article class="card">
        <h3>Cómo leer la fórmula</h3>
        <ul class="guided">
          <li>
            <strong>Q(s,a)</strong>: valor esperado de tomar una acción en un
            estado.
          </li>
          <li>
            <strong>Alpha</strong>: cuánto pesa la experiencia nueva frente a lo
            ya aprendido.
          </li>
          <li><strong>Gamma</strong>: cuánto importan recompensas futuras.</li>
          <li>
            <strong>Epsilon</strong>: probabilidad de explorar una acción no
            necesariamente óptima.
          </li>
        </ul>
      </article>
      <article class="card">
        <h3>Por qué funciona aquí</h3>
        <p>
          La simulación usa pocos estados y acciones discretas. Eso hace que una
          Q-table sea suficiente, visible y didáctica: se puede inspeccionar
          cada valor sin redes neuronales ni modelos opacos.
        </p>
      </article>
    </div>
    <article class="card panel">
      <h3>Parámetros del laboratorio</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Significado en la app</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>alpha</b></td>
              <td>cuánto aprende de la nueva experiencia</td>
            </tr>
            <tr>
              <td><b>gamma</b></td>
              <td>cuánto considera recompensas futuras</td>
            </tr>
            <tr>
              <td><b>epsilon</b></td>
              <td>cuánto explora acciones nuevas</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>`,
  styles: [
    `
      .panel {
        margin-top: 20px;
      }
      .formula-card {
        margin-top: 20px;
      }
      .formula-card code {
        display: block;
        margin: 14px 0;
        padding: 18px;
        border-radius: 16px;
        background: #0b1f33;
        color: #fffdf8;
        font-size: clamp(1rem, 2.2vw, 1.45rem);
        font-weight: 900;
        overflow-x: auto;
      }
      .guided {
        margin: 12px 0 0;
        padding-left: 20px;
      }
      .guided li {
        margin: 10px 0;
      }
    `,
  ],
})
export class QLearningComponent {}
