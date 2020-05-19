import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DropdownService } from '../shared/services/dropdown.service';
import { EstadoBr } from '../shared/models/estado-br';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-date-form',
  templateUrl: './date-form.component.html',
  styleUrls: ['./date-form.component.css']
})
export class DateFormComponent implements OnInit {

  formulario: FormGroup;
  // estados: EstadoBr[];

  estados: Observable<{}> ;
  cargos: any[];
  tecnologias: any[];
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService
    ) { }

  ngOnInit(): void {
    // this.dropdownService.getEstadosBr()
    // .subscribe((dados: EstadoBr[]) => {
      // this.estados = dados; console.log(dados);});
    this.estados = this.dropdownService.getEstadosBr();

    this.cargos = this.dropdownService.getCargos();

    this.tecnologias = this.dropdownService.getTecnoligias(); 
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
    }), 
    cargo: [null],
    tecnologias: [null]
      // Validators.minLength(3), Validators.maxLength(20)
      //  pattern="[a-z0-9._%+-]{1,40}[@]{1}[a-z]{1,10}[.]{1}[a-z]{3}" 

    });
  }

  onSubmit(){
    if(this.formulario.valid){

      console.log(this.formulario);
      
      this.http.post('https://httpbin.org/post',JSON.stringify(this.formulario.value))
      .subscribe(dados => {
        console.log(dados);
        // reset o form
        this.formulario.reset();
      },
      (error: any) => alert('erro'));
    }else{
      console.log('formulário invalido!')
      this.verificaValidacoesForm(this.formulario);
      }
  }

  verificaValidacoesForm(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);         
      const  controle = formGroup.get(campo);
      controle.markAsDirty(); 
      if(controle instanceof FormGroup){
         this.verificaValidacoesForm(controle);
      }
   }); 

  }
  
  resetar(){
    this.formulario.reset()
  }

  verificaValidTouched(campo: string){

    return !this.formulario.get(campo).valid && (this.formulario.get(campo).touched || this.formulario.get(campo).dirty); 
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
    if(cep != null && cep !== ''){
      this.cepService.consultaCEP(cep)
      .subscribe(dados => this.populaDadosForm(dados));
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
      // this.formulario.get('nome').setValue('Danlei');
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
   
    setarCargo(){
      const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' };
      this.formulario.get('cargo').setValue(cargo);
    }

    compararCargos(obj1, obj2){
      return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel): obj1 === obj2;
    }
    setarTecnologias(){
      this.formulario.get('tecnologias').setValue(['java','javascript','php']);
    }
}


