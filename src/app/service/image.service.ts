import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { server } from 'src/environments/environment';
import { IImage, IImageCreate, IImageRecive } from '../interfaces/ImagesInterface/image.interface.';
import { IConfigurationShadow } from '../interfaces/TieldmapInterfaces/tieldmapinterfaces';

@Injectable({
  providedIn: 'root'
})
export class ImageService {


  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Sube una nueva imagen al servidor.
   * @param imageData Datos de la imagen a subir.
   * @returns Observable con la respuesta del servidor.
   */
  createImage(imagePayload: IImageCreate): Observable<string> {
    const token = this.getToken();
    const primary_user = this.getUser();
    if (!token && !primary_user) {
      this.router.navigate(['/login']);
      return new Observable<string>();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<string>(`${server}images/create`, { ...imagePayload, primary_user }, { headers });
  }

    /**
   * Sube una nueva imagen al servidor.
   * @param imageData Datos de la imagen a subir.
   * @returns Observable con la respuesta del servidor.
   */
    updateImage(imagePayload: IImageCreate, id_image: number): Observable<string> {
      const token = this.getToken();
      var primary_user_str = this.getUser();
  
      if (token && primary_user_str) {
        let primary_user = parseInt(primary_user_str);
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
  
      return this.http.post<string>(`${server}images/update`, { ...imagePayload, primary_user, id_image }, { headers });
      }else {
        this.router.navigate(['/login']);
        return new Observable<string>();
      }
    }


  /**
   * Obtiene todas las imágenes asociadas a un usuario específico.
   * @returns Observable con un arreglo de imágenes.
   */
  getAll_Dashboard(id_dashboard: number): Observable<IImageRecive[]> {
    const token = this.getToken();
    const primary_user = this.getUser();
    if (!token && !primary_user) {
      this.router.navigate(['/login']);
      return new Observable<IImageRecive[]>();
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<IImageRecive[]>(`${server}images/getAll`, { id_dashboard, primary_user }, { headers });
  }

  /**
   * Obtiene una imagen específica por su ID.
   * @param imageId ID de la imagen.
   * @returns Observable con los datos de la imagen.
   */
  getImageById(imageId: number): Observable<IImage> {
    const token = this.getToken();
    const primary_user = this.getUser();
    if (!token && !primary_user) {
      this.router.navigate(['/login']);
      return new Observable<IImage>();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<IImage>(`${server}images/getOneById`, { primary_user, id: imageId }, { headers });
  }

  /**
   * Elimina una imagen por su ID.
   * @param imageId ID de la imagen a eliminar.
   * @returns Observable con la respuesta del servidor.
   */
  deleteImage(imageId: number): Observable<string> {
    const token = this.getToken();
    const primary_user = this.getUser();
    if (!token && !primary_user) {
      this.router.navigate(['/login']);
      return new Observable<string>();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<string>(`${server}images/delete`, { id: imageId, primary_user }, { headers });
  }

  updatePositionAndSizeImages(params: IConfigurationShadow) {
    const token = this.getToken();
    var primary_user_str = this.getUser();

    if (token && primary_user_str) {
      let primary_user = parseInt(primary_user_str);
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      return this.http.post(server + "images/positions", { ...params, primary_user }, { headers });
    } else {
      this.router.navigate(['/login']);
      return new Observable<string>();
    }
  }

  /**
   * Obtiene el token de autenticación almacenado en el sessionStorage.
   * @returns El token de autenticación o null si no existe.
   */
  private getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  /**
  * Obtiene el id de usuario de autenticación almacenado en el sessionStorage.
  * @returns El id user de autenticación o null si no existe.
  */
  private getUser(): string | null {
    return sessionStorage.getItem('idUser')
  }
}

