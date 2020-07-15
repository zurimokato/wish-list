import { DestinoViaje } from './destino-viaje.model';
import { Subject, BehaviorSubject } from 'rxjs';

export class DestinoApiClient{
    destinos:DestinoViaje[];
    current:Subject<DestinoViaje>=new BehaviorSubject<DestinoViaje>(null);
    constructor(){
        this.destinos=[];
    }

    add(d:DestinoViaje){
        this.destinos.push(d);
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