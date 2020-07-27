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
import { DestinosViajesEffects, InitMyDataAction, DestinosViajesState, reducerDestinosViajes, initializeDestinosViajesState } from './models/destino-viaje-state.models';
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
import {map, flatMap } from 'rxjs/operators';
import { NgxMapboxGLModule } from "ngx-mapbox-gl";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EspiameDirective } from './espiame.directive';
import { TrackearClickDirective } from './trackear-click.directive';


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

// redux init
export interface AppState {
  destinos: DestinosViajesState;
}

const reducers: ActionReducerMap<AppState> = {
  destinos: reducerDestinosViajes
};

const reducersInitialState = {
  destinos: initializeDestinosViajesState()
}
// redux fin init


// app init
export function init_app(appLoadService: AppLoadService): () => Promise<any>  {
  return () => appLoadService.intializeDestinosViajesState();
}

@Injectable()
export class AppLoadService {
  constructor(private store: Store<AppState>, private http: HttpClient) { }
  async intializeDestinosViajesState(): Promise<any> {
    const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
    const req = new HttpRequest('GET', APP_CONFIG_VALUE.apiEndPoint + '/my', { headers: headers });
    const response: any = await this.http.request(req).toPromise();
    this.store.dispatch(new InitMyDataAction(response.body));
  }
}

// fin app init
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
      destinos:'++id, nombre,imageUrl, selected',
      translations:'++id,lang,key,value'
    })
  }
}
//

// i18n ini
class TranslationLoader implements TranslateLoader {
  constructor(private http: HttpClient) { }

  getTranslation(lang: string): Observable<any> {
    const promise = db.translations
                      .where('lang')
                      .equals(lang)
                      .toArray()
                      .then(results => {
                                        if (results.length === 0) {
                                          return this.http
                                            .get<Translation[]>(APP_CONFIG_VALUE.apiEndPoint + '/api/translation?lang=' + lang)
                                            .toPromise()
                                            .then(apiResults => {
                                              db.translations.bulkAdd(apiResults);
                                              return apiResults;
                                            });
                                        }
                                        return results;
                                      }).then((traducciones) => {
                                        console.log('traducciones cargadas:');
                                        console.log(traducciones);
                                        return traducciones;
                                      }).then((traducciones) => {
                                        return traducciones.map((t) => ({ [t.key]: t.value}));
                                      });
   return from(promise).pipe(flatMap((elems) => from(elems)));
  }
}

function HttpLoaderFactory(http: HttpClient) {
  return new TranslationLoader(http);
}
// i18n fin


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
    EspiameDirective,
    TrackearClickDirective,

    
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    NgRxStoreModule.forRoot(reducers,{initialState:reducersInitialState, runtimeChecks:{
      strictStateImmutability: false,
      strictActionImmutability: false
    }}),
    EffectsModule.forRoot([DestinosViajesEffects]),
    ReservasModule,
    HttpClientModule,
    NgxMapboxGLModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader:{
        provide:TranslateLoader,
        useFactory:(HttpLoaderFactory),
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
