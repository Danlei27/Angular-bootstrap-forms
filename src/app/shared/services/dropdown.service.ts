import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadosBr(){
    return this.http.get('assets/dados/estadosbr.json');
  }
  
  getCargos(){
    return [
      { nome: 'Dev', nivel: 'Junior', desc: 'Dev Jr'},
      { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl'},
      { nome: 'Dev', nivel: 'Sernior', desc: 'Dev Sr'}
    ];
  }
  getTecnoligias(){
    return [
    { nome: 'java', desc: 'Java'},
    { nome: 'javascript', desc: 'JavaScript'},
    { nome: 'php', desc: 'PHP'},
    { nome: 'ruby', desc: 'Ruby'}
  ]
  }
}

