import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cidade } from '../models/cidades';
import { map } from 'rxjs/operators';
import { EstadoBr } from '../models/estado-br';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadosBr(){
    return this.http.get<EstadoBr[]>('assets/dados/estadosbr.json');
  }
  
  getCidades(idEstado: number){
    return this.http.get<Cidade[]>('assets/dados/cidades.json')
    .pipe(
      map((cidades: Cidade []) => cidades.filter(c => c.estado == idEstado))
    )
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

  getNewsletter(){
    return [
      { valor: 's', desc: 'Sim'},
      { valor: 'n', desc:'Não' }
    ];
  }
}

