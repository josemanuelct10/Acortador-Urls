import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUsuario } from '../Interfaces/interfaces';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private apiUrl: string = 'https://acortador-url-six.vercel.app/api/user';

  constructor(
    private httpClient: HttpClient
  ) { }

  registro(usuario: IUsuario){
    return this.httpClient.post(this.apiUrl + '/register', usuario);
  }

  login(usuario: IUsuario){
    return this.httpClient.post(this.apiUrl + '/login', usuario);
  }

  isAuthenticated(){
    return this.httpClient.get(this.apiUrl + '/isAuthenticated');
  }

  logout(){
    return this.httpClient.get(this.apiUrl + '/logout');
  }
}
