import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservasRoutingModule } from './reservas-routing.module';
import { ReservasDetalleComponent } from './reservas-detalle/reservas-detalle.component';
import { ReservasListadoComponent } from './reservas-listado/reservas-listado.component';
import { ReservasApiClientService } from './reservas-api-client.service';


@NgModule({
  declarations: [ReservasDetalleComponent, ReservasListadoComponent],
  imports: [
    CommonModule,
   
    ReservasRoutingModule,
  ],
  exports:[],
  providers:[ReservasApiClientService] 
})
export class ReservasModule { }
