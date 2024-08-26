import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registrationForm: FormGroup;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserServiceService
  ) {
    // Inicializa el formulario con validaciones
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  // Valida si las contraseñas coinciden
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  // Maneja el envío del formulario
  registerUser() {
    if (this.registrationForm.valid) {
      let user = {
        username: this.registrationForm.get('username')?.value,
        password: this.registrationForm.get('password')?.value
      }

      this.userService.registro(user).subscribe(
        (response: any) => {
          if (response.error === true){
            console.log(response.message);
            this.mensajeError = response.message;
          }
          else {
            console.log(response.message);
            this.router.navigate(['/']);
          }
        }
      )
    } else {
      console.log('Formulario inválido');
    }
  }
}
