/**
 * @author Hugo Vicente Peligro
 */

let tablero = [];
let contador = 0;
const perder = 0;
const ganar = 1;
const ponerBandera = 1;
const quitarBandera = 0;

function DificultadError(message) {
    this.message = message;
}
DificultadError.prototype = new Error();
DificultadError.prototype.constructor = Error;

let mostrar = () => {
    console.log("Mostrando tablero");
    console.dir(tablero);
};

let actualizarTableroJuego = () => {
    for (let fila = 0; fila < buscaminas.filas; fila++) {
        for (const columna in tablero[fila]) {
            if (buscaminas.tableroJuego[fila][columna] == -1) {
                if (tablero[fila][columna] == 0) {
                    buscaminas.tableroJuego[fila][columna] = "*";
                }
                else if (tablero[fila][columna] > 0 && tablero[fila][columna] < 9) {
                    buscaminas.tableroJuego[fila][columna] = tablero[fila][columna];
                }
            }
        }
    }
};

function actualizarMinas(){  //Cuando hemos perdido por que hemos picado una bomba
    for (let fila = 0; fila < buscaminas.filas; fila++) {
        for (const columna in tablero[fila]) {
            if (tablero[fila][columna] == 9) {
                if (buscaminas.tableroJuego[fila][columna] != "B") { // si no tenemos una bandera mostramos una bomba
                    buscaminas.tableroJuego[fila][columna] = "9";
                }
            }
            if (buscaminas.tableroJuego[fila][columna] == "B" && tablero[fila][columna] != 9) { // si tenemos una bandera y no hay bomba marcamos una X
                buscaminas.tableroJuego[fila][columna] = "X";
            }
        }
    }
};

export let buscaminas = {
    tableroJuego: [],
    filas: 0,
    columnas: 0,
    bombas: 0,
    banderas: 10,

    init: (dificultad = "facil") => {
        if (dificultad != "facil" && dificultad != "medio" && dificultad != "dificil") {
            throw new DificultadError("La dificultad no es correcta");
        }
        switch (dificultad) {
            case "facil":
                buscaminas.columnas = 5;
                buscaminas.filas = 5;
                buscaminas.bombas =5;
                buscaminas.banderas = buscaminas.bombas;
                break;

            case "medio":
                buscaminas.columnas = 18;
                buscaminas.filas = 14;
                buscaminas.bombas = 40;
                buscaminas.banderas = buscaminas.bombas;
                break;

            case "dificil":
                buscaminas.columnas = 24;
                buscaminas.filas = 20;
                buscaminas.bombas = 99;
                buscaminas.banderas = buscaminas.bombas;
                break;
        }

        buscaminas.tableroJuego = Array.from({ length: buscaminas.filas }, () => Array.from({ length: buscaminas.columnas }, () => 0));
        tablero = Array.from({ length: buscaminas.filas }, () => Array.from({ length: buscaminas.columnas }, () => 0));

        for (let i = 0; i <= buscaminas.bombas - 1; i++) {
            let filaBomba;
            let columnaBomba;
            do { //generamos las bombas.
                filaBomba = Math.floor(Math.random() * buscaminas.filas);
                columnaBomba = Math.floor(Math.random() * buscaminas.columnas);
            } while (tablero[filaBomba][columnaBomba] == 9);
            tablero[filaBomba][columnaBomba] = 9;
            for (let f = Math.max(0, filaBomba - 1); f <= Math.min(buscaminas.filas - 1, filaBomba + 1); f++) { //recorremos las posiciones del array del alredededor de la bomba
                for (let c = Math.max(0, columnaBomba - 1); c <= Math.min(buscaminas.columnas - 1, columnaBomba + 1); c++) {
                    if (tablero[f][c] != 9) {
                        tablero[f][c]++;
                    }
                }
            }
        }
        mostrar();
    },

    esMina(fila, columna) {
        return tablero[fila][columna] == 9;
    },

    picar: (fila, columna) => {
        if (buscaminas.tableroJuego[fila][columna] == 0) {
            buscaminas.tableroJuego[fila][columna] = -1;
            contador++;
            if (tablero[fila][columna] == 9) {
                actualizarMinas();
                return perder; //Si perdemos devolvemos 0
            }
            if (contador == (buscaminas.filas * buscaminas.columnas) - buscaminas.bombas) {
                actualizarTableroJuego()
                return ganar; //Si ganamos devolvemos 1
            }
            if (tablero[fila][columna] == 0) {
                for (let f = Math.max(0, fila - 1); f <= Math.min(buscaminas.filas - 1, fila + 1); f++) { //recorremos las posiciones del array del alredededor de la bomba
                    for (let c = Math.max(0, columna - 1); c <= Math.min(buscaminas.columnas - 1, columna + 1); c++) {
                        if (tablero[f][c] == 0 && buscaminas.tableroJuego[f][c] == 0) {
                            buscaminas.picar(f, c);
                        }
                        else if (tablero[f][c] > 0 && tablero[f][c] < 9 && buscaminas.tableroJuego[f][c] == 0) {
                            contador++;
                            buscaminas.tableroJuego[f][c] = -1;
                        }
                    }
                }
            }
        }
        actualizarTableroJuego();
    },

    marcar: (fila, columna) => {
        
        if (buscaminas.tableroJuego[fila][columna] == 0) {
            if (buscaminas.banderas > 0) {
                buscaminas.tableroJuego[fila][columna] = "B";
                buscaminas.banderas--;
                return ponerBandera;
            }
        } 
        if (buscaminas.tableroJuego[fila][columna] == "B") {
            buscaminas.tableroJuego[fila][columna] = 0;
            buscaminas.banderas++;
            return quitarBandera;
        }  
    },

    despejar: (fila, columna) => {
        let numero = tablero[fila][columna];
        let contador = 0;
        let resultado;
        if (buscaminas.tableroJuego[fila][columna] != "B" && buscaminas.tableroJuego[fila][columna] != "*" && buscaminas.tableroJuego[fila][columna] != 0) {

            for (let f = Math.max(0, fila - 1); f <= Math.min(buscaminas.filas - 1, fila + 1); f++) { //recorremos las posiciones del array del alredededor de la bomba
                for (let c = Math.max(0, columna - 1); c <= Math.min(buscaminas.columnas - 1, columna + 1); c++) {
                    if (buscaminas.tableroJuego[f][c] == "B") {
                        contador++;
                    }
                }

            }
            if (contador == numero) {
                for (let f = Math.max(0, fila - 1); f <= Math.min(buscaminas.filas - 1, fila + 1); f++) { //recorremos las posiciones del array del alredededor de la bomba
                    for (let c = Math.max(0, columna - 1); c <= Math.min(buscaminas.columnas - 1, columna + 1); c++) {
                        if (buscaminas.tableroJuego[f][c] == 0) {
                           resultado = buscaminas.picar(f, c);
                        }
                    }
                }
                return [resultado, true]; // True si se modifica el tablero
            }
            else{
                return [resultado, false]; // False si no se modifica el tablero
            }
        }
    },

    mostrarTableroJuego: () => {
        console.log("Mostrando tablero de juego");
        console.dir(buscaminas.tableroJuego);
    }
}