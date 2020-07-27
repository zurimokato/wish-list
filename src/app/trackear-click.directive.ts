import { Directive, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[appTrackearClick]'
})
export class TrackearClickDirective {
  private element:HTMLInputElement;
  constructor(private elRef:ElementRef) {
    this.element=elRef.nativeElement;
    fromEvent(this.element,'click').subscribe(event=>this.track(event))
   }
   track(event){
    const elemTag=this.element.attributes.getNamedItem('data-trackear-tags').value.split(' ');
    console.log(`||||||||||||| track envento: ${elemTag}`)
   }
}
