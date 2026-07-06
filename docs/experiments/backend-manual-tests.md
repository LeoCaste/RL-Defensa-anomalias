# Backend Manual Tests

Pruebas manuales para validar el backend de `RL Anomaly Defense Lab`.

## Preparacion

Compilar backend:

```bash
cd backend
mvn clean package
```

Ejecutar backend:

```bash
cd backend
mvn spring-boot:run
```

Base URL local:

```text
http://localhost:8080
```

## Health

```bash
curl -s http://localhost:8080/api/health
```

Respuesta esperada:

```json
{"status":"ok","service":"rl-anomaly-backend"}
```

## Estado Inicial

```bash
curl -s http://localhost:8080/api/simulation/status
```

Validar:

- `metrics.episodes` inicia en `0` si se acaba de resetear.
- `qTable` contiene 12 entradas: 4 estados x 3 acciones.
- `learnedPolicy` contiene una accion por estado.

## Paso Individual

```bash
curl -s -X POST http://localhost:8080/api/simulation/step
```

Validar:

- `currentResult.event` contiene un evento de red generado.
- `currentResult.action` contiene `ALLOW`, `MONITOR` o `BLOCK`.
- `currentResult.reward` contiene la recompensa calculada.
- `currentResult.explanation` explica la decision.
- `metrics.episodes` aumenta a `1`.
- Al menos un valor de `qTable` cambia respecto de `0.0`.

## Entrenamiento 10 Episodios

```bash
curl -s -X POST http://localhost:8080/api/simulation/train \
  -H 'Content-Type: application/json' \
  -d '{"episodes":10,"alpha":0.1,"gamma":0.9,"epsilon":0.2,"anomalyProbability":0.3}'
```

Validar:

- `executedEpisodes` aumenta en 10.
- `rewardHistory` agrega 10 recompensas.
- `metrics.totalReward`, `metrics.averageReward` y `metrics.accuracy` se actualizan.

## Entrenamiento 100 Episodios

```bash
curl -s -X POST http://localhost:8080/api/simulation/train \
  -H 'Content-Type: application/json' \
  -d '{"episodes":100,"alpha":0.1,"gamma":0.9,"epsilon":0.15,"anomalyProbability":0.3}'
```

Validar:

- `executedEpisodes` aumenta en 100.
- La politica aprendida empieza a favorecer `ALLOW` en `NORMAL`, `MONITOR` en `SUSPICIOUS` y `BLOCK` en estados riesgosos.

## Entrenamiento 1000 Episodios

```bash
curl -s -X POST http://localhost:8080/api/simulation/train \
  -H 'Content-Type: application/json' \
  -d '{"episodes":1000,"alpha":0.1,"gamma":0.9,"epsilon":0.1,"anomalyProbability":0.3}'
```

Validar:

- `executedEpisodes` aumenta en 1000.
- La Q-table tiene valores positivos altos para acciones correctas.
- Las metricas acumuladas reflejan los episodios entrenados.

## Cambio de Configuracion

```bash
curl -s -X PUT http://localhost:8080/api/simulation/config \
  -H 'Content-Type: application/json' \
  -d '{"alpha":0.2,"gamma":0.85,"epsilon":0.05,"anomalyProbability":0.4,"environmentDifficulty":"HARD"}'
```

Validar:

- `config.alpha` es `0.2`.
- `config.gamma` es `0.85`.
- `config.epsilon` es `0.05`.
- `config.anomalyProbability` es `0.4`.
- `config.environmentDifficulty` es `HARD`.

## Guardar Experimento

```bash
curl -s -X POST http://localhost:8080/api/experiments \
  -H 'Content-Type: application/json' \
  -d '{"name":"manual-validation"}'
```

Validar:

- Responde HTTP `201`.
- La respuesta contiene `id`, `name`, `config`, `metrics` y `createdAt`.
- Las metricas guardadas coinciden con el estado actual de la simulacion.

## Listar Experimentos

```bash
curl -s http://localhost:8080/api/experiments
```

Validar:

- Retorna una lista JSON.
- El experimento guardado aparece con su `id`.

## Eliminar Experimento

```bash
curl -s -o /tmp/delete-status.txt -w '%{http_code}' \
  -X DELETE http://localhost:8080/api/experiments/1
```

Validar:

- Responde HTTP `204`.
- Al listar nuevamente, el experimento eliminado ya no aparece.

## Reset

```bash
curl -s -X POST http://localhost:8080/api/simulation/reset
```

Validar:

- `currentResult` queda en `null`.
- `metrics.episodes` vuelve a `0`.
- `rewardHistory` queda vacio.
- `recentHistory` queda vacio.
- Todos los valores de `qTable` vuelven a `0.0`.

## Resultado de Validacion Local

Validado localmente con Maven del sistema porque el proyecto no tiene Maven Wrapper.

- Compilacion: `mvn clean package` finalizo con `BUILD SUCCESS`.
- Ejecucion: `mvn spring-boot:run` levanto Spring Boot en `8080`.
- `GET /api/health` respondio `ok`.
- `POST /api/simulation/step` genero evento, accion, recompensa, explicacion y cambio en Q-table.
- `POST /api/simulation/train` con 10, 100 y 1000 episodios actualizo Q-table, politica, recompensas y metricas.
- `PUT /api/simulation/config` actualizo hiperparametros y dificultad.
- `POST /api/experiments` guardo un experimento en H2.
- `GET /api/experiments` listo el experimento guardado.
- `DELETE /api/experiments/1` respondio `204`.
- `POST /api/simulation/reset` limpio Q-table, metricas e historiales.
