export interface ICreate_Indicator {
    title: string,
    description: string,
    symbol: string,
    type_data_in: string,
    type_data_design: string,
    dashboard: number,
    issaveblobdata: boolean,
    primary_user: number
}



export interface IRecive_Indicator {
    dashboard: number,
    description: string,
    groupname: string,
    height: number
    id_indicator: number,
    idblobdata: number | null,
    issaveblobdata: boolean,
    primary_user: number,
    symbol: string,
    title: string,
    type_data_design: string,
    type_data_in: string,
    width: number,
    x: number,
    y: number
}