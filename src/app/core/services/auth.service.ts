import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private key = 'auth';
  login(email: string) {
    localStorage.setItem(this.key, JSON.stringify({ email, logged: true }));
  }
  logout() { localStorage.removeItem(this.key); }
  isLogged(): boolean {
    const s = localStorage.getItem(this.key);
    return !!(s && JSON.parse(s).logged);
  }
}