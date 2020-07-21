import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservasApiClientService {

  constructor() { }

  getAll(){
    return [{id:1, nombre:'Uno'}, {id:2, nombre:'Dos'}]
  }
}
