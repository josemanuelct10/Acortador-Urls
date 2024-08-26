import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsServiceService {

  private apiUrl: string = 'https://acortador-url-six.vercel.app/api/url';

  constructor(
    private httpClient: HttpClient
  ) { }

  sendUrl(url: any){
    return this.httpClient.post(this.apiUrl + '/sendUrl', url);
  }


  getUrls(idUsuario: string){
    return this.httpClient.get<any>(`${this.apiUrl}/getUrls/${idUsuario}`);  }


}
