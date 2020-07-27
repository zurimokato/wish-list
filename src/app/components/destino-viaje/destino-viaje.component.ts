import { Component, OnInit, Input, HostBinding, Output } from '@angular/core';
import { DestinoViaje } from '../../models/destino-viaje.model';
import { EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.module';
import { VoteUpAction, VoteDownAction } from '../../models/destino-viaje-state.models';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css'],
  animations:[
    trigger('esFavorito',[
      state('estadoFavorito',style({
        backgroundColor:'PaleTurquoise'
      })),
      state('estadoNoFavorito',style({
        backgroundColor:'WhiteSmoke'
      })),
      transition('estadoFavorito=> estadoNoFavorito',[
        animate(3)
      ]),
      transition('estadoNoFavorito =>estadoFavorito',[
        animate(3)
      ]),
    ])
  ]
})
export class DestinoViajeComponent implements OnInit {
  @Input() destino: DestinoViaje;
  @Input() position:number;
  @Output() clicked:EventEmitter<DestinoViaje>;

  @HostBinding('attr.class') cssClass ="col-md-4";
  constructor(private store:Store<AppState>) { 
    this.clicked=new EventEmitter();
  }

  ngOnInit(): void {
  }
  ir(){
    this.clicked.emit(this.destino);
    return false;
  }

  voteUp(){
    this.store.dispatch(new VoteUpAction(this.destino));
    return false;
  }

  voteDown(){
    this.store.dispatch(new VoteDownAction(this.destino));
    return false;
  }
}
