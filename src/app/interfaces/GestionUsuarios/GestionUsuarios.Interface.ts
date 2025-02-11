export interface access_functions {
    modify_position_tools: boolean,
    edit_tools: boolean,
    create_tools: boolean,
    alerts: boolean,
    watch_variables: boolean
}


export interface UsersRecive{
    nombre_usuario: string,
    zona_horaria: string,
    access_functions: string,
    correo: string,
    id_usuario: number,
    primary_id_user: number,
    role: 'PRIMARY' | 'SECONDARY',
    telefono: string,
    enabled: boolean
}

export interface Users{
    nombre_usuario: string,
    zona_horaria: string,
    access_functions: access_functions,
    correo: string,
    id_usuario: number,
    primary_id_user: number,
    role: 'PRIMARY' | 'SECONDARY',
    telefono: string,
    enabled: boolean
}