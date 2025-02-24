export interface ISuscription {
    enabled: boolean,
    suscription_id: string,
    active_in: string,
    expire_in: string,
    tools_capacity: number,
    tools_used: number,
    camara_capacity: number, 
    camara_used: number,
    alerts_enabled: boolean,
    alerts_number_dedicated: boolean,
    historical_data: number,
    manageable_users: number,
    manageable_users_used: number,
    access_api: boolean
}