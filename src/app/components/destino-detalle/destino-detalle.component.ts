import { Component, OnInit, InjectionToken, Inject, Injectable } from '@angular/core';
import { DestinoViaje } from 'src/app/models/destino-viaje.model';
import { ActivatedRoute } from '@angular/router';
import { DestinoApiClient } from 'src/app/models/destino-api-cliente.models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.module';


@Component({
  selector: 'app-destino-detalle',
  templateUrl: './destino-detalle.component.html',
  styleUrls: ['./destino-detalle.component.css'],
  providers: [DestinoApiClient]
})
export class DestinoDetalleComponent implements OnInit {
  destinoViaje;
  style = {

    sources: {

      world: {

        type: 'geojson',

        data: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'

      }

    },

    version: 8,

    layers: [{

      'id': 'countries',

      'type': 'fill',

      'source': 'world',

      'layout': {},

      'paint': {

        'fill-color': '#6F788A'

      }

    }]

  };

  map: any;
  constructor(private router: ActivatedRoute, private destinoViajeApi: DestinoApiClient) { }

  ngOnInit(): void {

    let id = this.router.snapshot.paramMap.get('id');
    this.destinoViaje = this.destinoViajeApi.getById(id);

  }

}

