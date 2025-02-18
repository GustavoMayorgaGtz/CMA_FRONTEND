import { Input } from '@angular/core';
import { AlertService } from 'src/app/service/alert.service';
import { ExitService } from 'src/app/service/exit.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { auth_class } from 'src/app/graphs_class/auth_class';
import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
@Component({
  selector: 'app-configure-image',
  templateUrl: './configure-image.component.html',
  styleUrls: ['./configure-image.component.scss']
})

export class ConfigureImageComponent implements AfterViewInit {
  @ViewChild('threeCanvas', { static: true }) private canvasRef!: ElementRef;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;

  public width = 0;
  public height = 0;
  loadSizeShadow(width: number, height: number){

  }

  ngAfterViewInit() {
    this.initScene();
    this.loadModel();
    this.animate();
  }

  private initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(100, 100, 500);
    // this.camera.zoom =  0.5;
    this.camera.zoom = 0.5; // Alejar
    this.camera.updateProjectionMatrix();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // this.renderer.setSize(100, 200, true);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.canvasRef.nativeElement.appendChild(this.renderer.domElement);

    // Luz ambiental y direccional
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 20);
    this.scene.add(directionalLight);

    // Controles de cámara
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  private loadModel() {
    const objLoader = new OBJLoader();

    objLoader.load('./assets/Images/modelo.obj', (obj) => {
      // Aplicar un material simple si el modelo no tiene materiales
      const material = new THREE.MeshStandardMaterial({ color: THREE.Color.NAMES.lightgray, metalness: 0.5, roughness: 0.5 });

      obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = material;
        }
      });

      this.scene.add(obj);
      obj.position.set(0, 0, 0);
      obj.scale.set(0.3, 0.3, 0.3); // Ajusta la escala si el modelo es muy grande o pequeño
    }, undefined, (error) => {
      console.error('Error al cargar el modelo:', error);
    });
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  @Input() id_dashboard_selected!: number | undefined;
  public show_save_button: boolean = true;
  public authClass = new auth_class(this.router, this.authService, this.alertService);
  constructor(
    private alertService: AlertService,
    private exitService: ExitService,
    private router: Router,

    private authService: AuthService) {
    this.authClass.validateUser();
  }

  /**
  * Funcion para regresar al menu principal y salir del modo configuracion
  */
  return() {
    this.exitService.setExitConfigurationGraphLine(false);
  }
}
