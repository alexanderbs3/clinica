import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import {
  Role,
  Usuario,
  LoginResponse as LoginResponseModel,
} from "../models/models";
import { environment } from "../../../environments/environment";

export interface AuthState {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface LoginRequest {
  username: string;
  password: string;
}

/** Decodifica o payload de um JWT sem biblioteca externa */
function decodeJwt(token: string): Record<string, any> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function mapBackendRole(role?: string): Role {
  if (role === "ADMIN") {
    return "ADMINISTRADOR";
  }

  return "PROFISSIONAL_SAUDE";
}

/** Serviço de autenticação integrado exclusivamente ao backend real. */
@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly loginUrl = `${environment.apiUrl}/auth/login`;

  private state = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  state$ = this.state.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): Usuario | null {
    return this.state.value.user;
  }
  get token(): string | null {
    return this.state.value.token;
  }
  get isAuthenticated(): boolean {
    return this.state.value.isAuthenticated;
  }
  get isAdmin(): boolean {
    return this.currentUser?.role === "ADMINISTRADOR";
  }
  get isProfissional(): boolean {
    return this.currentUser?.role === "PROFISSIONAL_SAUDE";
  }

  login(username: string, password: string): Observable<LoginResponseModel> {
    return this.http
      .post<LoginResponseModel>(this.loginUrl, { username, password } as LoginRequest)
      .pipe(tap((res) => this.handleLoginSuccess(res, username)));
  }

  private handleLoginSuccess(res: LoginResponseModel, username: string): void {
    const payload = decodeJwt(res.token);
    const role = mapBackendRole(payload?.["role"]);
    const user: Usuario = {
      id: payload?.["sub"] ? parseInt(payload["sub"]) : 0,
      username: payload?.["username"] ?? username,
      role,
    };
    this.state.next({ user, token: res.token, isAuthenticated: true });
    localStorage.setItem("clinica_token", res.token);
    localStorage.setItem("clinica_user", JSON.stringify(user));
  }

  logout(): void {
    this.state.next({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem("clinica_token");
    localStorage.removeItem("clinica_user");
  }

  restoreSession(): void {
    const token = localStorage.getItem("clinica_token");
    const stored = localStorage.getItem("clinica_user");
    if (token && stored) {
      try {
        const user: Usuario = JSON.parse(stored);
        this.state.next({ user, token, isAuthenticated: true });
      } catch {
        this.logout();
      }
    }
  }
}
