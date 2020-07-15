import { Injectable } from '@angular/core';
import { DestinoViaje } from './destino-viaje.model';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface DestinoViajeState {
    items: DestinoViaje[];
    loading: boolean;
    favorito: DestinoViaje;
}

export const initializeDestinosViajeStates = function () {
    return {
        items: [],
        loading: false,
        favorito: null
    }
}


export enum DestinoViajeActionTypes {
    NUEVO_DESTINO = '[Destinos viajes] Nuevo',
    ELEGIDO_FAVORITO = '[Destinos viajes] Favorito',
    VOTE_UP = '[Destinos viajes] Vote up',
    VOTE_DOWN = '[Destinos viajes] Vote Down'
}

export class NuevoDestinoAction implements Action {
    type = DestinoViajeActionTypes.NUEVO_DESTINO;
    constructor(public destino: DestinoViaje) {}
}


export class ElegidoFavoritoAction implements Action {
    type = DestinoViajeActionTypes.ELEGIDO_FAVORITO;
    constructor(public destino: DestinoViaje) {}
}

export class VoteUpAction implements Action {
    type = DestinoViajeActionTypes.VOTE_UP;
    constructor(public destino: DestinoViaje) {}
}

export class VoteDownAction implements Action {
    type = DestinoViajeActionTypes.VOTE_DOWN;
    constructor(public destino: DestinoViaje) {}
}

export type DestinoViajeActions = NuevoDestinoAction | ElegidoFavoritoAction | VoteUpAction | VoteDownAction;

export function reduceDestinoViaje(
    state: DestinoViajeState,
    action: DestinoViajeActions
): DestinoViajeState {
    switch (action.type) {
        case DestinoViajeActionTypes.NUEVO_DESTINO: {
            
            return {
                ...state,
                items: [...state.items, (action as NuevoDestinoAction).destino ]
            };
            break; 
        }
        case DestinoViajeActionTypes.ELEGIDO_FAVORITO: {
            
            state.items.forEach(x =>  x.setSelected(false) );
            const fav: DestinoViaje = (action as ElegidoFavoritoAction).destino;
            fav.setSelected(true);
            return {
                ...state,
                favorito: fav
            };
            break; 
        }
        case DestinoViajeActionTypes.VOTE_UP:{
            const d:DestinoViaje=(action as VoteUpAction).destino;
            d.voteUp();
            return{
                ...state
            };
        }
        case DestinoViajeActionTypes.VOTE_DOWN:{
            const d:DestinoViaje=(action as VoteDownAction).destino;
            d.voteDown();
            return{
                ...state
            };
        }
    }
   
    return state;
}

@Injectable()
export class DestinoViajeEffects {
    @Effect()
    nuevoAgregado$: Observable<Action> = this.action$.pipe(
        ofType(DestinoViajeActionTypes.NUEVO_DESTINO),
        map((action: NuevoDestinoAction) => new ElegidoFavoritoAction(action.destino))
    );

    constructor(private action$: Actions) { }
}