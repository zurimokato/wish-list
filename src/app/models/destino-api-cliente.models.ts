import { DestinoViaje } from './destino-viaje.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppLoadService, APP_CONFIG, AppConfig } from '../app.module';
import { Inject, forwardRef, Injectable } from '@angular/core';
import { NuevoDestinoAction } from './destino-viaje-state.models';

@Injectable({ providedIn: 'root' })
export class DestinoApiClient{
    destinos:DestinoViaje[];
    current:Subject<DestinoViaje>=new BehaviorSubject<DestinoViaje>(null);
    constructor(private store:Store<AppLoadService>,
        @Inject(forwardRef(()=>APP_CONFIG)) private config:AppConfig,private httpClient:HttpClient){
        this.destinos=[];
    }

    add(d:DestinoViaje){
       const headers=new HttpHeaders({'X-APi-TOKEN':'token-seguridad'});
       const req=new HttpRequest('POST',this.config.apiEndPoint+'/my',{nevo:d.nombre},{headers:headers});
       this.httpClient.request(req).subscribe((data:HttpResponse<{}>)=>{
           if(data.status==200){
            this.store.dispatch(new NuevoDestinoAction(d));
           }
       })
    }

    getAll():DestinoViaje[]{
        return this.destinos;
    }

    getById(id:string):DestinoViaje{
        return this.destinos.filter(function(d){return d.id.toString() === id})[0];
    }

    elegir(d:DestinoViaje){
        this.destinos.forEach(x=>x.setSelected(false));
        d.setSelected(true);
        this.current.next(d);
    }

    susbcribeOnchange(fn){
        this.current.subscribe(fn);
    }
}