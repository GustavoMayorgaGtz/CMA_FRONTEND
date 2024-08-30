export interface IPulsacion_Recive {
    id_pulsacion: number,
    title: string,
    description: string,
    dashboard: number,
    text_color: string,
    fill_color: string,
    bold: boolean,
    icon: string,
    border_radius: number,
    groupname: string,
    x: number,
    y: number,
    width: number,
    height: number
}

export interface ICreate_Pulsacion {
    title: string,
    description: string,
    dashboard: number,
    primary_user: number,
    text_color: string,
    fill_color: string,
    bold: boolean,
    icon: string,
    border_radius: number
}