export type TicketsTypes = 'feedback'| 'help'| 'error' | 'billing' | 'other';

export interface Tickets{
    id_ticket: number,
    title: string,
    message: string, 
    id_user_primary: number,
    id_user_message: number,
    type: TicketsTypes,
    create_at: Date,
    admin_response: boolean
}