import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vuelos-detalle',
  templateUrl: './vuelos-detalle.component.html',
  styleUrls: ['./vuelos-detalle.component.css']
})
export class VuelosDetalleComponent implements OnInit {
  id:any;
  constructor(private router:ActivatedRoute) { 
  router.params.subscribe(params=>{
    this.id=params['id'];
  });
  }

  ngOnInit(): void {
  }

}
