import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'rm-barra-progresso',
  templateUrl: './barra-progresso.html',
  styleUrls: ['./barra-progresso.scss']
})
export class RmBarraProgresso {
  @Input() valor: number;
  @Input() classe: string;
}
