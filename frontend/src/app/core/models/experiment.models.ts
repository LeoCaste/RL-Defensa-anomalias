import { AgentConfig, PolicyEntry, QTableEntry, SimulationMetrics } from './simulation.models';

export interface ExperimentRequest { name: string; }
export interface ExperimentResponse { id: number; name: string; description: string; config: AgentConfig; metrics: SimulationMetrics; qTable: QTableEntry[]; learnedPolicy: PolicyEntry[]; createdAt: string; }
