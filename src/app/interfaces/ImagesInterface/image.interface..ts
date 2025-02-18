// imagen.modelo.ts
export interface IImage {
    id: number;
    title: string;
    url: string;
    contorno: boolean;
  }

export interface IImageCreate extends Omit<IImage, 'id'> {
    id_dashboard: number
}

export interface IImageRecive extends Omit<IImage, 'id'> {
  id_imagen: number,
  x: number,
  y: number,
  width: number,
  height: number
}