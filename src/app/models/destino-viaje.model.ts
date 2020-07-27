import {v4 as uuid} from 'uuid';

export class DestinoViaje{
    selected: boolean=true;
    servicios: string[];
    id=uuid();
    constructor(public nombre:String,public imageUrl:String, public votes:number=0){
        this.servicios=['Desayuno','Piscina'];
    }

    isSelected():boolean{
        return this.selected;
    }

    setSelected(value:boolean):void{
        this.selected=value;
    }

    voteUp(){
        this.votes++;
    }
    voteDown(){
        this.votes--;
    }
    
}