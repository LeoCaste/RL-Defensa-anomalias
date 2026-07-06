import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExperimentRequest, ExperimentResponse } from '../models/experiment.models';

@Injectable({ providedIn: 'root' })
export class ExperimentService {
  private readonly baseUrl = '/api/experiments';
  constructor(private readonly http: HttpClient) {}
  list(): Observable<ExperimentResponse[]> { return this.http.get<ExperimentResponse[]>(this.baseUrl); }
  save(request: ExperimentRequest): Observable<ExperimentResponse> { return this.http.post<ExperimentResponse>(this.baseUrl, request); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}
