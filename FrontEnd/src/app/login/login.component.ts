import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showLoginError: boolean = false;
  showPassword: boolean = false;
  private baseUrl = 'http://localhost:3000/api'; // Updated API endpoint

  constructor(private formbuilder: FormBuilder, private _http: HttpClient, private _router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  logIn() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      alert('Please fill all the required fields correctly before submitting');
      return;
    }

    // Updated to use new API endpoint
    this._http.post<any>(`${this.baseUrl}/login`, this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login successful');
        this._router.navigate(['/restaurent']);
        this.loginForm.reset();
      },
      error: (error) => {
        console.error('Login error:', error);
        this.showLoginError = true;
        setTimeout(() => this.showLoginError = false, 3000);
        
        if (error.status === 401) {
          alert('Invalid email or password');
        } else {
          alert('Login failed. Please try again later.');
        }
      }
    });
  }
}