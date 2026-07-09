import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AgentConfig, SimulationResponse, TrainRequest } from '../models/simulation.models';

@Injectable({ providedIn: 'root' })
export class SimulationService {
  private readonly baseUrl = `${environment.apiBaseUrl}/simulation`;
  constructor(private readonly http: HttpClient) {}
  status(): Observable<SimulationResponse> { return this.http.get<SimulationResponse>(`${this.baseUrl}/status`); }
  step(): Observable<SimulationResponse> { return this.http.post<SimulationResponse>(`${this.baseUrl}/step`, {}); }
  train(request: TrainRequest): Observable<SimulationResponse> { return this.http.post<SimulationResponse>(`${this.baseUrl}/train`, request); }
  reset(): Observable<SimulationResponse> { return this.http.post<SimulationResponse>(`${this.baseUrl}/reset`, {}); }
  updateConfig(config: AgentConfig): Observable<SimulationResponse> { return this.http.put<SimulationResponse>(`${this.baseUrl}/config`, config); }
}
