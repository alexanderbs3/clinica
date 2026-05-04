import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "./core/services/auth.service";

/**
 * Componente raiz da aplicação
 * Responsável por renderizar o router outlet e restaurar sessão do usuário
 */
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.restoreSession();
    this.applyStoredTheme();
  }

  private applyStoredTheme() {
    const theme = localStorage.getItem("clinica_theme") || "dark";
    document.body.setAttribute("data-theme", theme);
  }
}
