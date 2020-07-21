import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinoComponent } from './components/lista-destino/lista-destino.component';

import {RouterModule, Routes} from "@angular/router";
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';

import {StoreModule as NgRxStoreModule,ActionReducerMap} from '@ngrx/store'
import {EffectsModule} from '@ngrx/effects';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormDestinoViajeComponent } from './components/form-destino-viaje/form-destino-viaje.component'
import { DestinoApiClient } from './models/destino-api-cliente.models';
import { DestinoViajeState, reduceDestinoViaje, initializeDestinosViajeStates, DestinoViajeEffects } from './models/destino-viaje-state.models';
import { LoginComponent } from './components/login/login.component';
import { ProtectedComponent } from './components/protected/protected.component';
import { UsuarioLogeadoGuard } from './guards/usuario-logeado/usuario-logeado.guard';
import { AuthService } from './services/auth.service';
import { VuelosComponent } from './components/vuelos/vuelos/vuelos.component';
import { VuelosMainComponent } from './components/vuelos/vuelos-main/vuelos-main.component';
import { VuelosMasInfoComponent } from './components/vuelos/vuelos-mas-info/vuelos-mas-info.component';
import { VuelosDetalleComponent } from './components/vuelos/vuelos-detalle/vuelos-detalle.component';
import { ReservasModule } from './reservas/reservas.module';



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
    ReservasModule

  ],
  providers: [DestinoApiClient,AuthService,UsuarioLogeadoGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
