export class Cliente {
    constructor(
        public id: number | null,
        public nombre: string,
        public genero: string,
        public edad: number,
        public identificacion: string,
        public direccion: string,
        public telefono: string,
        public estado: boolean,
        public contrasena: string
    ){}
}
