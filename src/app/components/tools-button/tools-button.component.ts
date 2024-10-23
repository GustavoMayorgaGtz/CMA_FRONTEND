import { Component,ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MenuToolService } from 'src/app/service/tool-button-navigate';
@Component({
  selector: 'app-tools-button',
  templateUrl: './tools-button.component.html',
  styleUrls: ['./tools-button.component.scss']
})
export class ToolsButtonComponent {
  constructor(private menuToolService: MenuToolService) {}
  setMenuTool(tool: number) {
    this.menuToolService.menuToolChange.emit(tool); // Emitir el nuevo valor
  }
  showTools = false;
  buttonOpacity = 0.3;
  buttonPosition = { x: 10, y: 10 };
  timeoutId: any;

  onDragStart(event: MouseEvent) {
    const initialX = event.clientX;
    const initialY = event.clientY;
    const initialButtonX = this.buttonPosition.x;
    const initialButtonY = this.buttonPosition.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - initialX;
      const deltaY = moveEvent.clientY - initialY;
      this.buttonPosition = {
        x: initialButtonX + deltaX,
        y: initialButtonY + deltaY
      };
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    this.resetTransparencyTimer();
  }

  toggleTools() {
    this.showTools = !this.showTools;
    this.resetTransparencyTimer();
  }

  useTool(tool: any) {
    console.log(`Using ${tool.name}`);
  }

  resetTransparencyTimer() {
    this.buttonOpacity = 1;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.buttonOpacity = 0.3; // Hacer transparente
    }, 5000); // 5 segundos de inactividad
  }
}
