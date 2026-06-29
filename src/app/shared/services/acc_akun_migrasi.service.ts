import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AccCoaMigrasiService {

  private apiUrl = SERVER_API_URL + '/AccAkunMigrasiCoa';

  constructor(private http: HttpClient) {}

  /**
   * =====================================
   * DATATABLES – ALL IN ONE
   * =====================================
   */
  getDatatable(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/datatable`,
      payload
    );
  }

  /**
   * =====================================
   * SUMMARY HEADER
   * =====================================
   */
  getSummary(): Observable<{
    status: string;
    summary: {
      total_baru: number;
      total_existing: number;
      total_all: number;
    };
  }> {
    return this.http.get<any>(
      `${this.apiUrl}/summary`
    );
  }

  /**
   * =====================================
   * EKSEKUSI MIGRASI (INSERT ONLY)
   * =====================================
   */
  migrate(kodeAkun: string[]): Observable<{
    status: string;
    inserted: string[];
  }> {
    return this.http.post<any>(
      `${this.apiUrl}/migrate`,
      { kode_akun: kodeAkun }
    );
  }
}
