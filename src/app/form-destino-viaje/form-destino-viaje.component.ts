import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { DestinoViaje } from '../models/destino-viaje.model';
import { fromEvent } from 'rxjs';
import { map,filter,debounceTime,distinctUntilChanged,switchMap } from 'rxjs/operators';
import {ajax, AjaxResponse} from 'rxjs/ajax';

@Component({
  selector: 'app-form-destino-viaje',
  templateUrl: './form-destino-viaje.component.html',
  styleUrls: ['./form-destino-viaje.component.css']
})
export class FormDestinoViajeComponent implements OnInit {
  @Output() onItemAdded:EventEmitter<DestinoViaje>
  fg:FormGroup;
  minLongitud:number=3;

  searchResults:string[];
  
  constructor(public fb:FormBuilder) { 
      this.onItemAdded=new EventEmitter();
      this.fg=fb.group({
        nombre:['',Validators.compose([Validators.required,
          this.nombreValidatorParametrisable(3)])],
        url:['']
      });
      this.fg.valueChanges.subscribe((form:any)=>{
       // console.log("Cambio en el formulario",form)
      })
  }

  ngOnInit(): void {
    let elemNombre=<HTMLInputElement>document.getElementById('nombre');
    fromEvent(elemNombre,'input').pipe(
      map((e:KeyboardEvent)=>(e.target as HTMLInputElement).value),
      filter(text=>text.length>2),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(()=>ajax('/assets/datos.json'))
      ).subscribe(AjaxResponse=>{
        //console.log(AjaxResponse.response)
        this.searchResults=AjaxResponse.response; 
      });
    
  }

  guardar(nombre:string, url:string):boolean{
    let d= new DestinoViaje(nombre,url);
    this.onItemAdded.emit(d);
    return false;
  }
  nombreValidator(control:FormControl):{[s:string]:boolean}{
    let longitud=control.value.toString().trim().length;
    if(longitud>0 && longitud<5){
      return{invalidNombre:true}
    }

    return null;
  }

  nombreValidatorParametrisable(minLongitud:number):ValidatorFn{
    return (control:FormControl):{[s:string]:boolean}|null=>{
      const longitud=control.value.toString().trim().length;
    if(longitud>0 && longitud<minLongitud){
      return{minLongNombre:true}
    }
      return null;
    }
  }
}
