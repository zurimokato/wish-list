import { Component } from '@angular/core';
import { DestinoViaje } from './models/destino-viaje.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-wishlist';

  time=new Observable(obeserver=>{
    setInterval(()=>obeserver.next(new Date().toString()),1000);
  })

  constructor(){

  }

  destinoAgregado(d){

  }
  
}
