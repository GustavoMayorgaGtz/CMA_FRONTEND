export interface ICamera_Recive {
    id_camera: number,
    title: string,
    description: string,
    dashboard: number,
    groupname: string,
    x: number,
    y: number,
    width: number,
    height: number
}

export interface ICreate_Camera {
    title: string,
    description: string,
    dashboard: number,
    primary_user: number
}