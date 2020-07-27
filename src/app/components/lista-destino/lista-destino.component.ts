import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DestinoViaje } from '../../models/destino-viaje.model';
import { DestinoApiClient } from '../../models/destino-api-cliente.models';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.module';
import { ElegidoFavoritoAction, NuevoDestinoAction } from '../../models/destino-viaje-state.models';

@Component({
  selector: 'app-lista-destino',
  templateUrl: './lista-destino.component.html',
  styleUrls: ['./lista-destino.component.css'],
  providers:[DestinoApiClient]
})
export class ListaDestinoComponent implements OnInit {
  @Output() onItemAdded:EventEmitter<DestinoViaje>;

  destinos;
  updates:string[];

  constructor(private destinoApiClient:DestinoApiClient, private store:Store<AppState>) { 
    this.onItemAdded =new EventEmitter();
    this.updates = [];
    this.store.select(state => state.destinos.favorito)
      .subscribe(data => {
        if (data != null) {
          this.updates.push('Se a elegido a ' + data.nombre);
        }
      });
    store.select(state => state.destinos.items).subscribe(items => this.destinos = items);
  }

  ngOnInit(): void {
    
  }

  agregado(d:DestinoViaje){
    this.destinoApiClient.add(d);
    this.onItemAdded.emit(d);
    this.store.dispatch(new NuevoDestinoAction(d));
  }
  elegido(d:DestinoViaje){
    this.destinoApiClient.elegir(d);
    this.store.dispatch(new ElegidoFavoritoAction(d));

  }

}
