export interface Pagina<T> {
    contenido: T[];
    pagina: number;
    tamano: number;
    totalElementos: number;
    totalPaginas: number;
}

export interface PageRequest { page: number; size: number; }
export type PageQuery<F extends object> = F & PageRequest;

export interface Option<T extends string = string> { value: T; label: string; }
export type Tone = 'green' | 'red' | 'blue' | 'amber' | 'gray';