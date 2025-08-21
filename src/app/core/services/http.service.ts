import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class HttpService {
  private base = 'https://jsonplaceholder.typicode.com';
  constructor(private http: HttpClient) {}
  get<T>(url: string, params?: any) { return this.http.get<T>(`${this.base}${url}`, { params }); }
  post<T>(url: string, body: any) { return this.http.post<T>(`${this.base}${url}`, body); }
  put<T>(url: string, body: any) { return this.http.put<T>(`${this.base}${url}`, body); }
  delete<T>(url: string) { return this.http.delete<T>(`${this.base}${url}`); }
}