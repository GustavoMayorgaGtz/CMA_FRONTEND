import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
import { PaymentServices } from 'src/app/service/payments.services';

declare var Stripe: any;

interface Plan {
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
  priceId: string
}

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit, AfterViewInit {
  @ViewChild('rendererContainer', { static: false }) rendererContainer!: ElementRef;

  plans: Plan[] = [
    {
      name: 'CMA BASIC',
      price: 199.00,
      features: [
        'Gestión de 5 usuarios',
        '7 herramientas',
        'Aplicación móvil',
        'Históricos 1000 datos',
        'Actualizaciones constantes'
      ],
      priceId: 'price_1Qtv2MGjikWMLoVQa0ZAGFrq'
    },
    {
      name: 'CMA BASIC ALERTS',
      price: 365.25,
      features: [
        'Gestión de 5 usuarios',
        '7 herramientas',
        'Aplicación móvil',
        'Históricos 1000 datos',
        'Actualizaciones constantes',
        'Alertas SMS (Numero compartido)'
      ],
      priceId: 'price_1Qtut8GjikWMLoVQZIhnXwkx',
      recommended: true
    },
    {
      name: 'CMA ADVANCE',
      price: 691.00,
      features: [
        'Gestión de 10 usuarios',
        '15 herramientas',
        'Aplicación móvil',
        'Históricos 3000 datos',
        'Acceso a 2 cámaras en vivo configurables',
        'Actualizaciones constantes',
        'Alertas SMS (Numero compartido)'
      ],
      priceId: 'price_1QtupOGjikWMLoVQccRyRZfw'
    },
    {
      name: 'CMA PREMIUM',
      price: 1132.00,
      features: [
        'Gestión de 30 usuarios',
        '25 herramientas',
        'Aplicación móvil',
        'Históricos 6000 datos',
        'Acceso a 4 cámaras en vivo configurables',
        'Actualizaciones constantes',
        'Alertas SMS (Numero dedicado)',
        'Acceso a API',
        'Acceso anticipado'
      ],
      priceId: 'price_1QtuoSGjikWMLoVQe7uCjnTL'
    }
  ];

  ngAfterViewInit() {
    // this.initThreeJS();
  }

  // private initThreeJS() {
  //   // Crear la escena
  //   const scene = new THREE.Scene();

  //   // Crear la cámara
  //   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  //   camera.position.z = 5;

  //   // Crear el renderizador
  //   const renderer = new THREE.WebGLRenderer();
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   this.rendererContainer.nativeElement.appendChild(renderer.domElement);

  //   // Crear un cubo
  //   const geometry = new THREE.BoxGeometry();
  //   const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  //   const cube = new THREE.Mesh(geometry, material);
  //   scene.add(cube);

  //   // Función de animación
  //   const animate = () => {
  //     requestAnimationFrame(animate);
  //     cube.rotation.x += 0.01;
  //     cube.rotation.y += 0.01;
  //     renderer.render(scene, camera);
  //   };

  //   animate();
  // }


  stripe: any;
  card: any;
  errorMessage: string | undefined;

  constructor(private http: HttpClient,
    private paymentService: PaymentServices,
    private router: Router,
    private alertsService: AlertService
  ) { }

  ngOnInit(): void {

  }

  async pay() {
    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card
    });

    if (error) {
      this.errorMessage = error.message; // Maneja el error
      console.error(error);
    } else {

      this.paymentService.createCustomer(paymentMethod.id, this.price_id)
        .subscribe((response) => {
          console.log(response);
          this.alertsService.setMessageAlert("Suscripcion creada exitosamente");
        }, (err: HttpErrorResponse) => {
          console.log(err);
          this.alertsService.setMessageAlert("Suscripcion no creada");
        })
      // Aquí obtienes el payment_method.id que necesitas enviar al servidor
      console.log('Payment Method ID:', paymentMethod.id);

      // Enviar paymentMethod.id al servidor para usarlo en la creación de un cliente o suscripción
      // this.http.post('http://localhost:5000/cma_server_development/payments/create-customer', { paymentMethodId: paymentMethod.id, email: 'mayte.cldr@gmail.com', userId: '28', price_id: 'price_1QtxNvGjikWMLoVQJLQeeLJC' })
      //   .subscribe(
      //     response => {
      //       console.log('Cliente creado:', response);
      //       // Maneja la respuesta del servidor
      //     },
      //     error => {
      //       console.error('Error al crear cliente:', error);
      //     }
      //   );
    }
  }


  public menu: 'prices' | 'payment' = 'prices';
  private price_id = "";
  seleccionar_precio(priceId: string) {
    this.price_id = priceId;
    this.menu = 'payment';
    setTimeout(() => {
      this.stripe = Stripe('pk_test_51Q3J2IGjikWMLoVQhx4fZlMJNlF6bgullenj553cBV9wGB5JMCAdxf0UA7uU2Dtnv5woPIEnSy2ltfm6VtxfIN7c004TTVbYzu'); // Reemplaza con tu clave pública de Stripe
      const elements = this.stripe.elements();
      this.card = elements.create('card');
      this.card.mount('#card-element');
    }, 3000)
  }
}
