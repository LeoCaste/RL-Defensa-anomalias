# RL Anomaly Defense Lab

Aplicación web educativa e interactiva para explicar **Aprendizaje por Refuerzo** aplicado a un caso de **detección de anomalías en red**.

El proyecto simula un entorno de red donde distintos eventos son evaluados por un agente basado en **Q-Learning**. El agente aprende, mediante recompensas y penalizaciones, si debe permitir, monitorear o bloquear cada evento.

La idea principal es mostrar el proceso de aprendizaje de forma visual, no construir un sistema real de ciberseguridad.

---

## Tecnologías

- Java
- Spring Boot
- Angular
- TypeScript
- SCSS
- H2 Database
- Docker
- Docker Compose

---

## Objetivo

El objetivo del proyecto es mostrar cómo un agente puede aprender una política de decisión a partir de la interacción con un entorno.

La aplicación permite observar:

- cómo se representa un problema mediante estados, acciones y recompensas;
- cómo se actualiza una Q-table;
- cómo cambia la política aprendida después del entrenamiento;
- cómo influyen parámetros como alpha, gamma y epsilon;
- cómo un evento de red pasa por el agente y genera una respuesta defensiva.

---

## Caso práctico

El escenario elegido es la **detección de anomalías en eventos de red**.

El entorno genera eventos simulados con características como:

- tipo de evento;
- frecuencia;
- reputación de origen;
- volumen de tráfico;
- intentos fallidos;
- nivel de riesgo.

A partir de estos datos, cada evento se clasifica en un estado de riesgo.

| Estado | Descripción |
|---|---|
| Normal | Tráfico esperado o legítimo |
| Sospechoso | Evento que requiere observación |
| Riesgoso | Evento con señales relevantes de amenaza |
| Crítico | Evento que debería ser bloqueado |

El agente puede tomar una de tres acciones.

| Acción | Descripción |
|---|---|
| Permitir | El evento continúa hacia el servidor |
| Monitorear | El evento queda bajo observación |
| Bloquear | El evento es detenido por el agente |

---

## Modelado del problema

| Elemento de RL | Representación en el proyecto |
|---|---|
| Agente | Defensor de red |
| Entorno | Simulador de eventos de red |
| Estado | Nivel de riesgo del evento |
| Acción | Permitir, monitorear o bloquear |
| Recompensa | Puntaje asignado según el resultado de la decisión |
| Política | Mejor acción aprendida para cada estado |
| Algoritmo | Q-Learning tabular |

---

## Q-Learning

El agente utiliza **Q-Learning tabular**. Cada combinación entre estado y acción tiene un valor Q asociado. Ese valor representa qué tan conveniente ha sido tomar una acción determinada en un estado determinado.

Fórmula utilizada:

    Q(s,a) ← Q(s,a) + α [r + γ max Q(s',a') - Q(s,a)]

Donde:

| Parámetro | Significado |
|---|---|
| alpha | Tasa de aprendizaje |
| gamma | Importancia de recompensas futuras |
| epsilon | Probabilidad de exploración |
| reward | Recompensa recibida después de tomar una acción |
| Q-table | Tabla donde se almacenan los valores aprendidos |

En términos simples, el agente prueba acciones, recibe recompensas o penalizaciones, y ajusta su tabla interna para decidir mejor en eventos futuros.

---

## Funcionalidades

### Fundamentos

Sección introductoria donde se explican los conceptos principales de Aprendizaje por Refuerzo:

- agente;
- entorno;
- estado;
- acción;
- recompensa;
- política.

La explicación está conectada con el caso de red usado en la aplicación.

---

### Q-Learning

Sección dedicada al algoritmo utilizado.

Incluye:

- fórmula de actualización;
- explicación de alpha, gamma y epsilon;
- uso de Q-table;
- relación entre estados, acciones y política aprendida.

---

### Caso práctico

Sección donde se muestra cómo la detección de anomalías en red se transforma en un problema de Aprendizaje por Refuerzo.

Aquí se explica qué representa cada elemento del modelo dentro del escenario de ciberseguridad simulado.

---

## Laboratorio

El laboratorio es la sección principal de la aplicación. Está dividido en dos pestañas internas:

- Experimento
- Simulación en vivo

---

## Laboratorio: Experimento

Esta pestaña permite configurar y entrenar el agente.

Incluye:

- selección de plantillas de configuración;
- edición manual de parámetros;
- entrenamiento por lotes;
- métricas del agente;
- Q-table;
- política aprendida.

### Plantillas disponibles

| Plantilla | Descripción |
|---|---|
| Conservadora | Baja exploración, entorno más simple y aprendizaje estable |
| Equilibrada | Configuración general para observar el comportamiento del agente sin extremos |
| Exploratoria | Mayor exploración, más dificultad y más eventos ambiguos |

Las plantillas cargan valores sugeridos, pero la configuración manual se mantiene disponible.

### Parámetros configurables

| Parámetro | Efecto |
|---|---|
| Alpha | Controla qué tan rápido cambia la Q-table con nueva experiencia |
| Gamma | Controla cuánto se valoran recompensas futuras |
| Epsilon | Controla la probabilidad de explorar acciones nuevas |
| Probabilidad de anomalías | Ajusta la frecuencia esperada de eventos maliciosos simulados |
| Dificultad | Controla qué tan ambiguos o exigentes son los eventos generados |

---

## Laboratorio: Simulación en vivo

Esta pestaña muestra el proceso de decisión de forma visual.

La animación representa el flujo:

    Computador externo → Agente RL → Servidor / Monitoreo / Bloqueo

Cada evento pasa por el agente y genera una respuesta:

- si el agente permite el evento, el flujo llega al servidor;
- si lo monitorea, el evento queda bajo observación;
- si lo bloquea, el flujo se detiene en el agente.

La simulación permite:

- iniciar ejecución automática;
- pausar;
- ejecutar paso único;
- cambiar velocidad;
- resetear;
- observar la consola de eventos;
- ver la recompensa obtenida;
- ver qué combinación de estado y acción fue actualizada.

---

## Métricas

La aplicación muestra métricas para interpretar el comportamiento del agente.

| Métrica | Descripción |
|---|---|
| Episodios | Cantidad de eventos procesados |
| Precisión | Proporción de decisiones correctas |
| Recompensa media | Promedio de recompensa obtenida |
| Falsos positivos | Eventos normales bloqueados por error |
| Falsos negativos | Anomalías permitidas por error |

En este escenario, los falsos negativos son especialmente relevantes, porque representan amenazas que el agente dejó pasar. Los falsos positivos también importan, porque implican bloquear tráfico legítimo.

---

## Estructura del proyecto

    rl-anomaly-defense-lab/
    ├── backend/
    │   ├── src/
    │   └── pom.xml
    │
    ├── frontend/
    │   ├── src/
    │   └── package.json
    │
    ├── docker-compose.yml
    └── README.md

---

## Ejecución con Docker

El proyecto está dockerizado. Desde la raíz del repositorio, ejecutar:

    docker compose up --build

Luego abrir la aplicación en el navegador:

    http://localhost:4200

Para detener los contenedores:

    docker compose down

---

## Uso recomendado

1. Entrar a la aplicación desde el navegador.
2. Revisar las secciones de Fundamentos, Q-Learning y Caso.
3. Ir al Laboratorio.
4. En la pestaña Experimento, elegir una plantilla o ajustar parámetros manualmente.
5. Aplicar la configuración.
6. Entrenar el agente por lotes.
7. Revisar métricas, Q-table y política aprendida.
8. Cambiar a Simulación en vivo.
9. Ejecutar eventos paso a paso o iniciar la simulación automática.
10. Observar cómo el agente procesa eventos y actualiza su aprendizaje.

---

## Notas de diseño

El proyecto usa una paleta visual clara, con tonos crema y navy, buscando una presentación más académica que una estética de dashboard de ciberseguridad tradicional.

La simulación en vivo fue incluida para que el aprendizaje no se vea solo como una tabla de datos, sino como una secuencia observable:

    evento → agente → acción → recompensa → aprendizaje

---

## Referencias

- Sutton, R. S., & Barto, A. G. Reinforcement Learning: An Introduction.
- Watkins, C. J. C. H., & Dayan, P. Q-learning.
- Documentación oficial de Spring Boot.
- Documentación oficial de Angular.