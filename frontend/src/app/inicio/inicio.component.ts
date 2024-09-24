import { Component, OnInit } from '@angular/core';
import { UrlsServiceService } from '../services/urls-service.service';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  originalUrl: string = '';
  shortenedUrl: string | null = null;
  isAuthenticated: boolean = false; // Estado de autenticación
  userInitial: string = ''; // Inicial del usuario
  usosIniciales: number = 5; // Valor inicial por defecto
  showDropdown: boolean = false;
  idUsuario: any;
  userLinks: any[] = []; // Cambia esto a un array vacío por defecto
  mensajeError: string = '';
  errorLogin: string = '';

  loginData = {
    username: '',
    password: ''
  };

  constructor(
    private urlService: UrlsServiceService,
    private userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication() {
    this.userService.isAuthenticated().subscribe(
      (response: any) => {
        console.log(response);
        if (!response.error) {
          this.isAuthenticated = true;
          this.userInitial = response.user.username[0].toUpperCase();
          this.idUsuario = response.user.id; // Asegúrate de que el id se obtiene correctamente

          // Limpia el número de usos de localStorage al iniciar sesión
          localStorage.removeItem('usosIniciales');

          // Carga los enlaces del usuario
          this.loadUserLinks();
        } else {
          this.isAuthenticated = false;
        }
      }
    );
  }



  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  loginUser() {
    this.userService.login(this.loginData).subscribe(
      (response: any) => {
        if (response.error) {
          this.loginData.password = "";
          this.errorLogin = response.message;
          console.log(response.message);
        } else {
          this.userInitial = response.username[0].toUpperCase();
          this.idUsuario = response.id;
          this.usosIniciales = 5;
          this.isAuthenticated = true;
          this.loginData.password = "";
          this.loginData.username = "";
          this.errorLogin = "";
          this.toggleDropdown();
          // Limpia el número de usos de localStorage al iniciar sesión
          localStorage.removeItem('usosIniciales');

          // Carga los enlaces del usuario
          this.loadUserLinks();
        }
      }
    );
  }

  logout() {
    this.userService.logout();

    this.isAuthenticated = false;
    this.showDropdown = false;
    this.idUsuario = null;
    this.userInitial = '';
    this.userLinks = [];
  }



  shortenUrl() {
    const formData = {
      url: this.originalUrl,
      idUsuario: this.idUsuario
    };

    this.urlService.sendUrl(formData).subscribe(
      (response: any) => {
        if (response.error) {
          console.log(response.message);
        } else {
          this.usosIniciales--; // Actualiza el número de usos
          localStorage.setItem('usosIniciales', this.usosIniciales.toString()); // Guarda el nuevo número de usos en localStorage

          // Actualiza la URL acortada
          this.shortenedUrl = response.urlAcortada;
          console.log(response.urlAcortada);

          // Añade el nuevo enlace al array de enlaces del usuario
          this.userLinks.push({
            original_url: this.originalUrl,
            short_uuid: this.shortenedUrl
          });

          console.log(this.userLinks);

          // Limpia el campo de URL original
          this.originalUrl = '';
        }
      }
    );
  }

  loadUserLinks() {
    if (this.idUsuario) {
      this.urlService.getUrls(this.idUsuario).subscribe(
        (response: any) => {
          if (!response.error) {
            this.userLinks = response.urls;
            console.log(this.userLinks);
          }
        }
      );
    }
  }

  isValidUrl(): boolean {
    return /^https?:\/\//i.test(this.originalUrl);
  }

  validateUrl(url: string): void {
    if (url && !this.isValidUrl()) {
      this.mensajeError = "La URL debe comenzar por https:// o http://";
    }
    else this.mensajeError = "";
  }
}
