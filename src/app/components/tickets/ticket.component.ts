import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { Tickets, TicketsTypes } from 'src/app/interfaces/Tickets/tickets.inteface';
import { AlertService } from 'src/app/service/alert.service';
import { TicketsService } from 'src/app/service/tickets.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss', './ticket.component.mobile.scss']
})

export class TicketComponent implements OnInit {
  constructor(private ticketService: TicketsService, private alertService: AlertService) { }

  public isBuldingTicket: boolean = false;

  btn_event(option: number) {
    if (option == 0) {
      //disable ticket
      this.isBuldingTicket = false;
    }
    if (option == 1) {
      //enable ticket
      this.isBuldingTicket = true;
    }
  }

  private title_ticket: string = "";
  getTitleTicket(title: string) {
    this.title_ticket = title;
  }
  private message_ticket: string = "";
  getMessageTicket(message: string) {
    this.message_ticket = message;
  }
  private type_ticket!: TicketsTypes;
  getTypeTicket(type: string) {
    if (type as TicketsTypes) {
      console.log("valido")
      this.type_ticket = type as TicketsTypes;
    } else {
      console.log("no valido")
    }
  }

  /**
   * 
   */
  createTicket() {
    if (this.title_ticket.length > 0 &&
      this.message_ticket.length > 0 &&
      this.type_ticket
    ) {
      this.ticketService.createTickets(this.title_ticket, this.message_ticket, this.type_ticket)
        .subscribe((response) => {
          this.getTickets();
          this.isBuldingTicket = false;
          this.alertService.setMessageAlert("Ticket creado.");
        }, (err: HttpErrorResponse) => {
          console.log(err);
          this.alertService.setMessageAlert("No se puedo crear el ticket.");
        })
    } else {
       this.alertService.setMessageAlert("Faltan datos para mandar el ticket.");
    }
  }

  ngOnInit(): void {
    this.getTickets();
  }


  public tickets: Tickets[] = [];
  getTickets() {
    this.ticketService.tickets().subscribe((tickets) => {
      console.log(tickets)
      this.tickets = tickets;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    })
  }
}
