import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = "";
  showPassword = false;
  hints = [
    { role: "Admin", user: "admin", pass: "admin123" },
    { role: "Profissional", user: "profissional", pass: "profissional123" },
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

    if (this.auth.isAuthenticated) this.redirect();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = "";
    const { username, password } = this.form.value;

    this.auth.login(username, password).subscribe({
      next: () => this.redirect(),
      error: (e: Error) => {
        this.error = e.message;
        this.loading = false;
      },
    });
  }

  private redirect() {
    this.router.navigate(
      this.auth.isAdmin ? ["/admin/dashboard"] : ["/profissional/pacientes"],
    );
  }

  fillHint(user: string, pass: string) {
    this.form.setValue({ username: user, password: pass });
  }
}
