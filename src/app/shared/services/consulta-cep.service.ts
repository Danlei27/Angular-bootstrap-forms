import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }

  consultaCEP(cep: string){
    //Nova variavel "cep" somente com digitos
    cep = cep.replace(/\D/g, '');

    //Verificar se campo cep possui valor informado.
    if(cep != ""){

      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

      //Valida o formato do CEP.
      if(validacep.test(cep)){
        return this.http.get(`//viacep.com.br/ws/${cep}/json`);
      }
    }
    return of({});
  }
}
