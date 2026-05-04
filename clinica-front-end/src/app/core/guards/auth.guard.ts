import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { map, catchError, of } from "rxjs";
import { AuthService } from "../services/auth.service";
import { ApiService } from "../services/api.service";

/** Protege qualquer rota autenticada. Redireciona para /login se não houver sessão. */
export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated) return true;
  router.navigate(["/login"]);
  return false;
};

/** Protege rotas exclusivas de administrador. */
export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin) return true;
  router.navigate(["/profissional/pacientes"]);
  return false;
};

/**
 * Guard RN013: bloqueia acesso a pacientes/atendimentos enquanto o profissional
 * não tiver cadastro completo.
 * Se o backend estiver offline (erro HTTP), permite o acesso para não bloquear
 * o uso do sistema em desenvolvimento / sem backend.
 */
export const profissionalCadastroGuard: CanActivateFn = () => {
  const api    = inject(ApiService);
  const router = inject(Router);
  const auth   = inject(AuthService);

  // Se não está autenticado, o authGuard já cuida — libera aqui
  if (!auth.isAuthenticated) return true;

  return api.getMeuPerfil().pipe(
    map((perfil) => {
      if (perfil.cadastroCompleto) return true;
      router.navigate(["/profissional/meu-cadastro"]);
      return false;
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        router.navigate(["/login"]);
        return of(false);
      }

      // Backend offline ou erro de infraestrutura: permite acesso para não travar o sistema
      return of(true);
    })
  );
};
