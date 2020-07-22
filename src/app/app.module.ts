import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken, Injectable, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinoComponent } from './components/lista-destino/lista-destino.component';

import {RouterModule, Routes} from "@angular/router";
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';

import {StoreModule as NgRxStoreModule,ActionReducerMap, Store} from '@ngrx/store'
import {EffectsModule} from '@ngrx/effects';

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
    HttpClientModule

  ],
  providers: [AuthService,UsuarioLogeadoGuard,
  {provide:APP_CONFIG, useValue:APP_CONFIG_VALUE},
  AppLoadService,{provide:APP_INITIALIZER,useFactory:init_app, deps:[AppLoadService],multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
