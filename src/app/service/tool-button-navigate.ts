import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuToolService {
  menuToolChange: EventEmitter<number> = new EventEmitter<number>();
}
