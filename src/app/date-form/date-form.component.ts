import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-date-form',
  templateUrl: './date-form.component.html',
  styleUrls: ['./date-form.component.css']
})
export class DateFormComponent implements OnInit {

  formulario: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
    ) { }

  ngOnInit(): void {

    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null)
    //   endereco: new FormGroup({
    //    cep: new FormGroup(null)
    //   })
    // });


    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]], 
      endereco: this.formBuilder.group({

      cep:[null, [Validators.required]],
      numero:[null, [Validators.required]],
      complemento:[null],
      rua:[null, [Validators.required]],
      bairro:[null, [Validators.required]],
      cidade:[null, [Validators.required]],
      estado:[null, [Validators.required]]
    }) 

      // Validators.minLength(3), Validators.maxLength(20)
      //  pattern="[a-z0-9._%+-]{1,40}[@]{1}[a-z]{1,10}[.]{1}[a-z]{3}" 

    });
  }

  onSubmit(){
    console.log(this.formulario);

    this.http.post('https://httpbin.org/post',JSON.stringify(this.formulario.value))
      .subscribe(dados => {
        console.log(dados);
        // reset o form
        this.formulario.reset();
      },
      (error: any) => alert('erro'));
  }

  resetar(){
    this.formulario.reset()
  }

  verificaValidTouched(campo: string){

    return !this.formulario.get(campo).valid && this.formulario.get(campo).touched; 
  }

  verificaEmailInvalido(){
    let campoEmail = this.formulario.get('email');
    if(campoEmail.errors){
      return campoEmail.errors['email'] && campoEmail.touched;
    }
  }
  
  aplicaCssErro(campo: string){
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    }
  }
  consultaCEP(){
    let cep = this.formulario.get('endereco.cep').value;
    //Nova variavel "cep" somente com digitos
    cep = cep.replace(/\D/g, '');

    //Verificar se campo cep possui valor informado.
    if(cep != ""){

      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

      //Valida o formato do CEP.
      if(validacep.test(cep)){

        this.resetaDadosForm();
        
        this.http.get(`//viacep.com.br/ws/${cep}/json`)
        .subscribe(dados => this.populaDadosForm(dados));
      }
    }
  }
  populaDadosForm(dados){
          this.formulario.patchValue({
        endereco: {
          cep: dados.cep,
          complemento: dados.complemento,
          rua: dados.logradouro,
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf 
          }
      
      })     
      this.formulario.get('nome').setValue('Danlei');
    }
    resetaDadosForm(){
      this.formulario.patchValue({
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


