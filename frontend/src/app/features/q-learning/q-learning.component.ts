import { Component } from '@angular/core';
@Component({selector:'app-q-learning',standalone:true,template:`<section class="page"><div class="card"><h1>Q-Learning</h1><p>Q-Learning estima el valor de ejecutar una acción en un estado. En este laboratorio, cada celda Q(estado, acción) cambia después de observar recompensa y siguiente estado.</p><p><strong>Alpha</strong> controla cuánto aprende de lo nuevo, <strong>gamma</strong> cuánto valora recompensas futuras y <strong>epsilon</strong> cuánta exploración permite.</p></div></section>`})
export class QLearningComponent {}
