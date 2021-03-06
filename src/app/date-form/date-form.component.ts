import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DropdownService } from '../shared/services/dropdown.service';
import { EstadoBr } from '../shared/models/estado-br';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { Observable, empty } from 'rxjs';
import { map, distinctUntilChanged, tap, switchMap } from 'rxjs/operators'
import { FormValidations } from '../shared/form-validations';
import { VerificaEmailService } from './services/verifica-email.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { Cidade } from '../shared/models/cidades';
// import { EstadosBr } from './estados-br';

@Component({
  selector: 'app-date-form',
  templateUrl: './date-form.component.html',
  styleUrls: ['./date-form.component.css']
})
export class DateFormComponent extends BaseFormComponent implements OnInit {
  
  // formulario: FormGroup;
  
  // estados: Observable<{}> ;
  cidades: Cidade[];
  cargos: any[];
  tecnologias: any[];
  newsletterOp: any[];  
  estados: EstadoBr[];
  frameworks: string[] = ['Angular', 'React', 'Vue', 'Sencha'];
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService
    ) { 
      super();
    }
    
    ngOnInit(): void {
      // this.dropdownService.getEstadosBr()
      // .subscribe((dados: EstadoBr[]) => {
        // this.estados = dados; console.log(dados);});
        // this.verificaEmailService.verificarEmail('email@email.com').subscribe();
        
        // this.estados = this.dropdownService.getEstadosBr();
        
      this.dropdownService.getEstadosBr()
      .subscribe(dados => this.estados = dados);
      
      this.cargos = this.dropdownService.getCargos();
      
      this.tecnologias = this.dropdownService.getTecnoligias(); 
      
      this.newsletterOp = this.dropdownService.getNewsletter();
    
    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null)
    //   endereco: new FormGroup({
    //    cep: new FormGroup(null)
    //   })
    // });


    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3),Validators.maxLength(30)]],
      email: [null, [Validators.required, Validators.email],[this.validarEmail.bind(this)]], 
      confirmarEmail: [null, [FormValidations.equalsTo('email')]], 
      endereco: this.formBuilder.group({

      cep:[null, [Validators.required, FormValidations.cepValidator]],
      numero:[null, [Validators.required]],
      complemento:[null],
      rua:[null, [Validators.required]],
      bairro:[null, [Validators.required]],
      cidade:[null, [Validators.required]],
      estado:[null, [Validators.required]]
    }), 
    cargo: [null],
    tecnologias: [null],
    newsletter: ['s'],
    termos: [null, Validators.pattern('true')],
    frameworks: this.buildFrameworks()
      // Validators.minLength(3), Validators.maxLength(20)
      //  pattern="[a-z0-9._%+-]{1,40}[@]{1}[a-z]{1,10}[.]{1}[a-z]{3}" 

    });

    this.formulario.get('endereco.cep').statusChanges
      .pipe(
        distinctUntilChanged(),
        tap(value => console.log('status CEP:', value)),
        switchMap(status => status === 'VALID' ?
        this.cepService.consultaCEP(this.formulario.get('endereco.cep').value)
        : empty())
      )
      .subscribe(dados => dados ? this.populaDadosForm(dados) : {});
      
      this.formulario.get('endereco.estado').valueChanges
      .pipe(
        tap(estado => console.log('Novo estado: ', estado)),
        map(estado => this.estados.filter(e => e.sigla === estado)),
        map(estados => estados && estados.length > 0 ? estados[0].id : empty()),
        switchMap((estadoId: number) => this.dropdownService.getCidades(estadoId)),
        tap(console.log)
      )
      .subscribe(cidades => this.cidades = cidades); 
      // this.dropdownService.getCidades(8).subscribe(console.log);
        
  }

  buildFrameworks(){
    const values = this.frameworks.map(v => new FormControl(false));
    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(2));
  //  this.formBuilder.array( [
  //   new FormControl(false),
  //   new FormControl(false),
  //   new FormControl(false),
  //   new FormControl(false)
  //  ]);
  }
  
  
  submit(){
    console.log(this.formulario);

    let valueSubmit = Object.assign({}, this.formulario.value);
    
    valueSubmit =  Object.assign(valueSubmit,{
      frameworks: valueSubmit.frameworks
      .map((v, i) => v ? this.frameworks[i] : null)
      .filter(v => v !== null)
    });
    console.log(valueSubmit);
    this.http.post('https://httpbin.org/post',JSON.stringify({}))
    .subscribe(dados => {
      console.log(dados);
      // reset o form
      this.formulario.reset();
    },
    (error: any) => alert('erro'));
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
    
    validarEmail(formControl: FormControl){
      return this.verificaEmailService.verificarEmail(formControl.value)
      .pipe(map(emailExiste => emailExiste ? { emailInvalido: true } : null));
    }
}


