import { Component, OnInit } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  }
  
  onSubmit(form){
    console.log(form);
    // console.log(this.usuario);

    this.http.post('https://httpbin.org/post',JSON.stringify(form.value))
    .subscribe(dados => {
      console.log(dados);
      // resetar formulario
      form.form.reset();
    });
    
  }
  constructor(
    private http: HttpClient,
    private cepService: ConsultaCepService
    
    ) { }

  ngOnInit(): void {
  }

  verificaValidTouched(campo){
    return !campo.valid && campo.touched;
  }
  
  aplicaCssErro(campo){
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    }
  }
  consultaCEP(cep, form){
     //Nova variavel "cep" somente com digitos
    cep = cep.replace(/\D/g, '');

    if(cep != null && cep !== ''){
      this.cepService.consultaCEP(cep)
      .subscribe(dados => this.populaDadosForm(dados, form));
    }
  }

  populaDadosForm(dados, formulario){
  //   formulario.setValue({
  //     nome: formulario.value.nome,
  //     email: formulario.value.nome,
  //  endereco: {
  //   cep: dados.cep,
  //   numero: '',
  //   complemento: dados.complemento,
  //   rua: dados.logradouro,
  //   bairro: dados.bairro,
  //   cidade: dados.localidade,
  //   estado: dados.uf 
  //   }
  //   })
    formulario.form.patchValue({
      endereco: {
        cep: dados.cep,
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf 
        }
    
    })     
  }
  resetaDadosForm(formulario){
    formulario.form.patchValue({
      endereco: {
        cep: null,
        complemento: null,
        rua: null,
        bairro: null,
        cidade: null,
        estado: null 
        }
    
    })
  }
}
