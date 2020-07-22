import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken, Injectable, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinoComponent } from './components/lista-destino/lista-destino.component';

import {RouterModule, Routes} from "@angular/router";
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
import {TranslateService, TranslateLoader} from '@ngx-translate/core'; 
import {StoreModule as NgRxStoreModule,ActionReducerMap, Store} from '@ngrx/store'
import {EffectsModule} from '@ngrx/effects';
import Dexie from 'dexie';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormDestinoViajeComponent } from './components/form-destino-viaje/form-destino-viaje.component'
import { HttpClientModule, HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { DestinoViajeState, reduceDestinoViaje, initializeDestinosViajeStates, DestinoViajeEffects, InitMyDataAction } from './models/destino-viaje-state.models';
import { LoginComponent } from './components/login/login.component';
import { ProtectedComponent } from './components/protected/protected.component';
import { UsuarioLogeadoGuard } from './guards/usuario-logeado/usuario-logeado.guard';
import { AuthService } from './services/auth.service';
import { VuelosComponent } from './components/vuelos/vuelos/vuelos.component';
import { VuelosMainComponent } from './components/vuelos/vuelos-main/vuelos-main.component';
import { VuelosMasInfoComponent } from './components/vuelos/vuelos-mas-info/vuelos-mas-info.component';
import { VuelosDetalleComponent } from './components/vuelos/vuelos-detalle/vuelos-detalle.component';
import { ReservasModule } from './reservas/reservas.module';
import { DestinoViaje } from './models/destino-viaje.model';
import {TranslateModule} from '@ngx-translate/core';
import { Observable, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';

export interface AppConfig{
  apiEndPoint:string
}

const APP_CONFIG_VALUE:AppConfig={
  apiEndPoint:'http://localhost:3000'
}
export const APP_CONFIG=new InjectionToken<AppConfig>('app.config');

export const childrenRouterVuelos:Routes=[
  {path:'',redirectTo:'main',pathMatch:'full'},
  {path:'main', component:VuelosMainComponent},
  {path:'mas-info',component:VuelosMasInfoComponent},
  {path:':id', component:VuelosDetalleComponent}
]

const routes:Routes=[
  {path:'home', component:ListaDestinoComponent},
  {path:'',redirectTo:'home', pathMatch:"full"},
  {path:'destino',component:DestinoDetalleComponent},
  {path:'login', component:LoginComponent},
  {path:'destinodetalle/:id', component:DestinoDetalleComponent},
  {
    path:'protected',
    component:ProtectedComponent,
    canActivate:[UsuarioLogeadoGuard]
  },
  {
    path:'vuelos',
    component:VuelosComponent,
    canActivate:[UsuarioLogeadoGuard],
    children:childrenRouterVuelos
  }
 
];

//redux init
export interface AppState{
  destinos:DestinoViajeState
}

const reduces:ActionReducerMap<AppState>={
  destinos:reduceDestinoViaje
};

let reducersInitialState={
  destinos:initializeDestinosViajeStates()
}


//redux fin init


export function init_app(appLoadService:AppLoadService):()=>Promise<any>{
  return ()=> appLoadService.initializeDestinosViajeStates();
  
}

@Injectable()
export class AppLoadService{
  constructor(private store:Store<AppState>,private http:HttpClient){

  }
  async initializeDestinosViajeStates():Promise<any>{
    const headers:HttpHeaders= new HttpHeaders({'X-API-TOKEN':'token-seguridad'});
    const req= new HttpRequest('GET',APP_CONFIG_VALUE.apiEndPoint+'/my',{headers:headers});
    const response:any=await this.http.request(req).toPromise();
    this.store.dispatch(new InitMyDataAction(response.body))
  }
}

export class Translation{
  constructor(public id:number,public lang:string, public key:string,public value:string){

  }
}

@Injectable({
  providedIn:'root'
})
export class MyDataBase  extends Dexie{
  destinos:Dexie.Table<DestinoViaje, number>
  translations:Dexie.Table<Translation,number>

  constructor(){
    super('MyDataBase');
    this.version(1).stores({
      destinos:'++id, nombre,imgaeUrl'
    })
    this.version(2).stores({
      destinos:'++id, nombre,imgaeUrl',
      translations:'++id,lang,key,value'
    })
  }
}
//

class TranslationLoader implements TranslateLoader{
  constructor(private http:HttpClient){

  }
  getTranslation(lang:string):Observable<any>{
    const promise=db.translations.where('lang')
    .equals(lang)
    .toArray()
    .then(results=>{
      if(results.length==0){
        return this.http.get<Translation[]>(APP_CONFIG_VALUE.apiEndPoint+'/api/translation?lang='+lang)
        .toPromise().then(apiResulst=>{
          db.translations.bulkAdd(apiResulst);
          return apiResulst;
        });
      }
      return results;
    }).then(traducciones=>{
      console.log('traducciones cargadas');
      console.log(traducciones);
      return traducciones
    }).then(traducciones=>{
      return traducciones.map((t)=>({[t.key]:t.value}))
    });
    return from(promise).pipe(flatMap((elements)=>from(elements)))
  }
}

function httpLoadFactory(http:HttpClient) {
    return new TranslationLoader(http);
}


export const db = new MyDataBase();
@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinoComponent,
    DestinoDetalleComponent,
    FormDestinoViajeComponent,
    LoginComponent,
    ProtectedComponent,
    VuelosComponent,
    VuelosMainComponent,
    VuelosMasInfoComponent,
    VuelosDetalleComponent,

    
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    NgRxStoreModule.forRoot(reduces,{initialState:reducersInitialState}),
    EffectsModule.forRoot([DestinoViajeEffects]),
    ReservasModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader:{
        provide:TranslateLoader,
        useFactory:(httpLoadFactory),
        deps:[HttpClient]
      }
    })

  ],
  providers: [AuthService,UsuarioLogeadoGuard,
  {provide:APP_CONFIG, useValue:APP_CONFIG_VALUE},
  AppLoadService,{provide:APP_INITIALIZER,useFactory:init_app, deps:[AppLoadService],multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
