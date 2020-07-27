import { DestinosViajesState, initializeDestinosViajesState, InitMyDataAction, reducerDestinosViajes, NuevoDestinoAction } from "./destino-viaje-state.models"
import { DestinoViaje } from './destino-viaje.model';


describe('reducerDestinosViajes',()=>{
    it('should reduce init data',()=>{
       const prevState:DestinosViajesState=initializeDestinosViajesState();
       const action:InitMyDataAction=new InitMyDataAction(['destino 1', 'destino 2']);
       const newState:DestinosViajesState=reducerDestinosViajes(prevState,action);

       expect(newState.items.length).toEqual(2);
       expect(newState.items[0].nombre).toEqual('destino 1');

    })

    it('Should reduce new item addes',()=>{
        const prevState:DestinosViajesState=initializeDestinosViajesState();
        const action:NuevoDestinoAction=new NuevoDestinoAction(new DestinoViaje('Barranquilla','url'));
        const newState:DestinosViajesState=reducerDestinosViajes(prevState,action);

        expect(newState.items.length).toEqual(1);
        expect(newState.items[0].nombre).toEqual('Barranquilla');
 

    })
})