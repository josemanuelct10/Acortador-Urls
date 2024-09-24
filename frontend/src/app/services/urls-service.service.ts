import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlsServiceService {

  private apiUrl: string = environment.apiUrl + '/url';

  constructor(
    private httpClient: HttpClient
  ) { }

  sendUrl(url: any){
    return this.httpClient.post(this.apiUrl + '/sendUrl', url);
  }


  getUrls(idUsuario: string){
    return this.httpClient.get<any>(`${this.apiUrl}/getUrls/${idUsuario}`);  }


}
