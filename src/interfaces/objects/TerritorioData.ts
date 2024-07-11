
export interface TerritorioData {
    id?: number;
    nombre: string;
    pais: string;
    tipo: string; // 'estado', 'municipio', 'localidad', 'colonia'
    codigoPostal?: string;
    Parent_id?: number;
}
