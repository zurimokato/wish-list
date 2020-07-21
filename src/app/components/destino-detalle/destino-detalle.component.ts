import { Component, OnInit, InjectionToken, Inject, Injectable } from '@angular/core';
import { DestinoViaje } from 'src/app/models/destino-viaje.model';
import { ActivatedRoute } from '@angular/router';
import { DestinoApiClient } from 'src/app/models/destino-api-cliente.models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.module';

class DestinoApiclientViejo{
  getById(id:string):DestinoViaje{
    console.log('llamado por la clase vieja');
    return null
  }
}


interface AppConfig{
  apiEndPoint:string;
}

const APP_CONFIG_VALUE:AppConfig={
  apiEndPoint:'mi-end-point'
}
const APP_CONFIG=new InjectionToken<AppConfig>('app-config');

@Injectable({
  providedIn: 'root'
})
class DestinoViajeDecorated extends DestinoApiClient{
 
  constructor( @Inject(APP_CONFIG) private config:AppConfig,store:Store<AppState>){
    super();
  }

  getById(id:string){
    console.log('llamado por la clase decorada');
    console.log('´config '+this.config.apiEndPoint)
    return super.getById(id);
  }
}

@Component({
  selector: 'app-destino-detalle',
  templateUrl: './destino-detalle.component.html',
  styleUrls: ['./destino-detalle.component.css'],
  providers:[
  {provide:APP_CONFIG, useValue:APP_CONFIG_VALUE},
  {provide:DestinoApiClient,useClass:DestinoViajeDecorated},
  {provide:DestinoApiclientViejo, useExisting:DestinoApiClient}
 ]
})
export class DestinoDetalleComponent implements OnInit {
  destinoViaje:DestinoViaje;
  
  constructor(private router:ActivatedRoute, private destinoViajeApi:DestinoApiclientViejo) { }

  ngOnInit(): void {

    let id = this.router.snapshot.paramMap.get('id');
    this.destinoViaje=this.destinoViajeApi.getById(id);

  }

}

