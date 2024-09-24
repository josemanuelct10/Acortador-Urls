import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUsuario } from '../Interfaces/interfaces';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private apiUrl: string = environment.apiUrl + '/user';
  private authStatus = new BehaviorSubject<boolean>(false); // Inicializamos en false


  constructor(
    private httpClient: HttpClient
  ) { }

  registro(usuario: IUsuario){
    return this.httpClient.post(this.apiUrl + '/register', usuario);
  }

  login(usuario: IUsuario){
    return this.httpClient.post(this.apiUrl + '/login', usuario, {withCredentials: true});
  }

  isAuthenticated(){
    return this.httpClient.get(this.apiUrl + '/isAuthenticated', {withCredentials: true});
  }

  checkAuthStatus(): Observable<boolean> {
    return this.httpClient.get<any>(`${this.apiUrl}/isAuthenticated`, { withCredentials: true }).pipe(
      map(response => {
        if (response.isAuthenticated) {
          this.authStatus.next(true);  // Actualiza el estado de autenticación
          return true;
        } else {
          sessionStorage.clear();
          this.authStatus.next(false);
          return false;
        }
      }),
      catchError(() => {
        this.authStatus.next(false);
        return of(false);
      })
    );
  }



  // Método para obtener el estado de autenticación observable
  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  // Método de cierre de sesión
  logout() {
    // Puedes realizar una llamada al backend para limpiar la cookie si es necesario
    this.httpClient.post(`${this.apiUrl}/logout`,{}, { withCredentials: true }).subscribe(
      (response: any) => {
        if (response.error === false){
          sessionStorage.clear();
          this.authStatus.next(false); // Actualiza el estado de autenticación a falso
          console.log(this.authStatus.value);
        }
    });
  }

  isLoggedIn(): boolean{
    // Asegúrate de que authStatus esté definido y devuelve su valor
    console.log(this.authStatus);
    return this.authStatus.value;
  }
}
