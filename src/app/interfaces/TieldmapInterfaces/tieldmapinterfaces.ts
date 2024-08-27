export interface IConfigurationShadow{
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'linechart' | 'simplebutton' | 'indicator' | 'streaming',
    id: number
}