export interface access_functions {
    edit_json_connection: boolean,
    drop_json_connection: boolean,
    modify_json_connection: boolean,
    use_json_connection: boolean,
    edit_modbus_connection: boolean,
    drop_modbus_connection: boolean,
    modify_modbus_connection: boolean,
    use_modbus_connection: boolean,
    edit_memory_connection: boolean,
    drop_memory_connection: boolean,
    modify_memory_connection: boolean,
    use_memory_connection: boolean,
    edit_endpoint_connection: boolean,
    drop_endpoint_connection: boolean,
    modify_endpoint_connection: boolean,
    use_endpoint_connection: boolean,
    create_line_graph: boolean,
    drop_line_graph: boolean,
    edit_line_graph: boolean,
    modify_line_graph: boolean,
    create_simple_button: boolean,
    drop_simple_button: boolean,
    edit_simple_button: boolean,
    modify_simple_button: boolean,
    create_alert_sms: boolean,
    edit_alert_sms: boolean,
    drop_alert_sms: boolean,
    view_alert_sms_logs: boolean,
    modify_tieldmap: boolean
}


export interface UsersRecive{
    nombre_usuario: string,
    access_functions: string,
    correo: string,
    id_usuario: number,
    primary_id_user: number,
    role: 'PRIMARY' | 'SECONDARY',
    telefono: string
}

export interface Users{
    nombre_usuario: string,
    access_functions: access_functions,
    correo: string,
    id_usuario: number,
    primary_id_user: number,
    role: 'PRIMARY' | 'SECONDARY',
    telefono: string
}