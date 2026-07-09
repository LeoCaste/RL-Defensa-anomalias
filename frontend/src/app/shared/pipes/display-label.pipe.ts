import { Pipe, PipeTransform } from '@angular/core';

const LABELS: Record<string, string> = {
  NORMAL: 'Normal',
  SUSPICIOUS: 'Sospechoso',
  RISKY: 'Riesgoso',
  CRITICAL: 'Crítico',
  ALLOW: 'Permitir',
  MONITOR: 'Monitorear',
  BLOCK: 'Bloquear',
  EASY: 'Fácil',
  MEDIUM: 'Media',
  HARD: 'Difícil',
  idle: 'En espera',
  incoming: 'Evento entrante',
  inspecting: 'Analizando',
  decision: 'Decisión',
  routing: 'Respuesta defensiva',
  'routing-allow': 'Respuesta defensiva',
  'routing-monitor': 'Respuesta defensiva',
  'routing-block': 'Respuesta defensiva',
  reward: 'Recompensa',
  learning: 'Aprendizaje',
  CORRECT: 'Correcto',
  FALSE_POSITIVE: 'Falso positivo',
  FALSE_NEGATIVE: 'Falso negativo',
  PRUDENT_DECISION: 'Decisión prudente',
  MINOR_ERROR: 'Error menor',
  exploration: 'Exploración',
  EXPLORATION: 'Exploración',
  exploitation: 'Explotación',
  EXPLOITATION: 'Explotación',
  NORMAL_TRAFFIC: 'Tráfico normal',
  LOGIN_ATTEMPT: 'Intento de acceso',
  PORT_SCAN: 'Escaneo de puertos',
  DATA_TRANSFER: 'Transferencia de datos',
  UNKNOWN_ACCESS: 'Acceso desconocido',
  BRUTE_FORCE: 'Fuerza bruta',
  DATA_EXFILTRATION: 'Exfiltración de datos'
};

const TEXT_REPLACEMENTS: [RegExp, string][] = [
  [/\baccion\b/gi, 'acción'],
  [/\bexploracion\b/gi, 'exploración'],
  [/\bexplotacion\b/gi, 'explotación'],
  [/\btrafico\b/gi, 'tráfico'],
  [/\bdecision\b/gi, 'decisión'],
  [/\bobservacion\b/gi, 'observación'],
  [/\bepsilon-greedy\b/gi, 'epsilon-greedy'],
  [/\bpor exploración epsilon-greedy\b/gi, 'por exploración'],
  [/\bpor explotación de la Q-table\b/gi, 'por explotación de la Q-table'],
  [/\bTrafico normal permitido correctamente\b/gi, 'Tráfico normal permitido correctamente'],
  [/\bMonitorear trafico normal consume recursos sin necesidad\b/gi, 'Monitorear tráfico normal consume recursos sin necesidad'],
  [/\bTrafico normal bloqueado: falso positivo\b/gi, 'Tráfico normal bloqueado: falso positivo'],
  [/\bEvento sospechoso monitoreado: decision prudente\b/gi, 'Evento sospechoso monitoreado: decisión prudente'],
  [/\bEvento sospechoso permitido sin observacion adicional\b/gi, 'Evento sospechoso permitido sin observación adicional']
];

export function displayLabel(value: unknown): string {
  if (value === null || value === undefined) return '';
  const key = String(value);
  return LABELS[key] ?? key;
}

export function displayText(value: unknown): string {
  if (value === null || value === undefined) return '';
  const translatedLabels = Object.entries(LABELS).reduce((text, [key, label]) => text.replace(new RegExp(`\\b${key}\\b`, 'g'), label), String(value));
  return TEXT_REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), translatedLabels);
}

@Pipe({ name: 'labelEs', standalone: true })
export class DisplayLabelPipe implements PipeTransform {
  transform(value: unknown, mode: 'label' | 'text' = 'label'): string { return mode === 'text' ? displayText(value) : displayLabel(value); }
}
