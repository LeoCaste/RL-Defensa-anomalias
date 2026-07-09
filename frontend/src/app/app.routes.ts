import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { TheoryComponent } from './features/theory/theory.component';
import { QLearningComponent } from './features/q-learning/q-learning.component';
import { CaseStudyComponent } from './features/case-study/case-study.component';
import { LaboratoryComponent } from './features/laboratory/laboratory.component';
import { LimitationsComponent } from './features/limitations/limitations.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'fundamentos', component: TheoryComponent },
  { path: 'q-learning', component: QLearningComponent },
  { path: 'caso-practico', component: CaseStudyComponent },
  { path: 'laboratorio', component: LaboratoryComponent },
  { path: 'experimentos', redirectTo: 'laboratorio', pathMatch: 'full' },
  { path: 'experiments', redirectTo: 'laboratorio', pathMatch: 'full' },
  { path: 'limitaciones', component: LimitationsComponent },
  { path: '**', redirectTo: '' }
];
