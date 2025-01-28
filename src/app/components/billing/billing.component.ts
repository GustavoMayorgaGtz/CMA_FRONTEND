import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

declare var Stripe: any; // Asegúrate de que esta línea esté aquí

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  stripe: any;
  card: any;
  errorMessage: string | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.stripe = Stripe('pk_live_51Q3J2IGjikWMLoVQ6Kb3bCHZ0gfVvlwPP7Ep5wn6U0f5bLp6zmtdnmOVIOwf7h2xJvRyrpAu3BiJNH42vCvo8yml00IktEx2lh'); // Reemplaza con tu clave pública de Stripe
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  async pay() {
    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
    });

    if (error) {
      this.errorMessage = error.message; // Maneja el error
      console.error(error);
    } else {
      // Aquí obtienes el payment_method.id que necesitas enviar al servidor
      console.log('Payment Method ID:', paymentMethod.id);
      
      // Enviar paymentMethod.id al servidor para usarlo en la creación de un cliente o suscripción
      this.http.post('https://www.gustvomayorga.com.mx/cma_server_development/payments/create-customer', { paymentMethodId: paymentMethod.id, email: 'goglege2@gmail.com', userId: '28'})
        .subscribe(
          response => {
            console.log('Cliente creado:', response);
            // Maneja la respuesta del servidor
          },
          error => {
            console.error('Error al crear cliente:', error);
          }
        );
    }
  }
}
