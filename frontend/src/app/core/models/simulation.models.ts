export type RiskState = "NORMAL" | "SUSPICIOUS" | "RISKY" | "CRITICAL";
export type AgentAction = "ALLOW" | "MONITOR" | "BLOCK";
export type EnvironmentDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface AgentConfig {
  alpha: number;
  gamma: number;
  epsilon: number;
  anomalyProbability: number;
  environmentDifficulty: EnvironmentDifficulty;
}
export interface NetworkEvent {
  id: string;
  eventType: string;
  failedLogins: number;
  connectionFrequency: number;
  targetPort: number;
  ipReputation: number;
  trafficVolume: number;
  realLabel: string;
  riskState: RiskState;
  timestamp: string;
}
export interface SimulationMetrics {
  episodes: number;
  totalReward: number;
  averageReward: number;
  accuracy: number;
  falsePositives: number;
  falseNegatives: number;
  truePositives: number;
  trueNegatives: number;
  monitoredEvents: number;
  blockedEvents: number;
  allowedEvents: number;
}
export interface QTableEntry {
  state: RiskState;
  action: AgentAction;
  qValue: number;
}
export interface PolicyEntry {
  state: RiskState;
  bestAction: AgentAction;
  expectedValue: number;
}
export interface SimulationResult {
  episode: number;
  event: NetworkEvent;
  state: RiskState;
  action: AgentAction;
  exploration: boolean;
  selectedQValue: number;
  previousQValue?: number;
  updatedQValue?: number;
  reward: number;
  outcomeType: string;
  explanation: string;
  nextState: RiskState;
  metrics: SimulationMetrics;
  qTable: QTableEntry[];
  learnedPolicy: PolicyEntry[];
}
export interface SimulationResponse {
  currentResult: SimulationResult | null;
  config: AgentConfig;
  metrics: SimulationMetrics;
  executedEpisodes: number;
  qTable: QTableEntry[];
  learnedPolicy: PolicyEntry[];
  rewardHistory: number[];
  recentHistory: SimulationResult[];
}
export interface TrainRequest {
  episodes: number;
  alpha: number;
  gamma: number;
  epsilon: number;
  anomalyProbability: number;
}
