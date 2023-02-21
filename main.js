/**
 * @author Hugo Vicente Peligro
 */
import { buscaminas } from "./buscaminas.js";

document.addEventListener("DOMContentLoaded", function () {
    let tableroJuego = document.getElementById("tableroJuego")
    let minasRestantes = document.getElementById("minasRestantes");
    let tiempo = document.getElementById("tiempo");
    let cabecera = document.getElementById("cabecera");
    let contador = 0;

    tableroJuego.addEventListener("click", clickTablero);
    tableroJuego.addEventListener("contextmenu", clickBandera);

    let contadorInterval = setInterval(function () {
        tiempo.innerHTML = contador++;
    }, 1000, contador);
    pintarTablero();

    document.getElementById("select").addEventListener("change", function (e) { //Cuando cambia el select(dificultad)
        contador = 0;
        contadorInterval;
        tableroJuego.addEventListener("click", clickTablero);
        tableroJuego.addEventListener("contextmenu", clickBandera);
        pintarTablero(e.target.value);
    });



    let resultadoHtml = document.getElementById("resultado");
    function pintarTablero(dificultad = "facil") {
        tableroJuego.innerHTML = "";
        buscaminas.init(dificultad);
        let celda;
        let numeroCelda;
        minasRestantes.innerHTML = buscaminas.banderas;
        tableroJuego.className = dificultad;
        tableroJuego.classList.add("width" + dificultad);
        cabecera.className = "width" + dificultad;
        for (let fila = 0; fila < buscaminas.filas; fila++) {
            for (let columna = 0; columna < buscaminas.columnas; columna++) {
                celda = document.createElement("div");
                if (fila % 2 == 0) {
                    if (columna % 2 == 0) {
                        celda.classList.add("inicioPar");
                    }
                    else {
                        celda.classList.add("inicioImpar");
                    }
                }
                else {
                    if (columna % 2 != 0) {
                        celda.classList.add("inicioPar");
                    }
                    else {
                        celda.classList.add("inicioImpar");
                    }

                }
                numeroCelda = document.createTextNode("");
                celda.appendChild(numeroCelda);
                celda.dataset.posicion = fila + "-" + columna;
                tableroJuego.appendChild(celda);
            }

        }
    }

    function clickTablero(e) {
        let posicion = e.target.getAttribute("data-posicion").split("-");
        let fila = parseInt(posicion[0]);
        let columna = parseInt(posicion[1]);
        let resultado;
        if (e.buttons == 0) {
            resultado = buscaminas.picar(fila, columna);
            actualizarTableroDom();
            if (resultado == 0 || resultado == 1) {
                ganarOperder(resultado);
            }
            buscaminas.mostrarTableroJuego();
        }
        else if (e.buttons == 3) {
            resultado = buscaminas.despejar(fila, columna);
            if (resultado[1]) { // Si se ha modificado el tablero
                actualizarTableroDom();
                if (resultado[0] == 0 || resultado[0] == 1) {
                    ganarOperder(resultado[0]);
                }
            }
            
        }
    }

    function actualizarTableroDom() {
        let celda;
        for (let fila = 0; fila < buscaminas.filas; fila++) {
            for (let columna = 0; columna < buscaminas.columnas; columna++) {
                if (buscaminas.tableroJuego[fila][columna]!= 0) {
                    celda = document.querySelector(`[data-posicion="${fila}-${columna}"]`);
                    if (buscaminas.tableroJuego[fila][columna] != "B" && buscaminas.tableroJuego[fila][columna] != "9") {
                        celda.classList.remove("inicioPar");
                        celda.classList.remove("inicioImpar");
                        if (fila % 2 == 0) {
                            if (columna % 2 == 0) {
                                celda.classList.add("despejadoPar");
                            }
                            else {
                                celda.classList.add("despejadoImpar");
                            }
                        }
                        else {
                            if (columna % 2 != 0) {
                                celda.classList.add("despejadoPar");
                            }
                            else {
                                celda.classList.add("despejadoImpar");
                            }
    
                        }
                        if (buscaminas.tableroJuego[fila][columna] == "*") {
                            celda.classList.add("cero");
                            celda.innerHTML = "";
                        }
                        else if (buscaminas.tableroJuego[fila][columna] > 0 && buscaminas.tableroJuego[fila][columna] < 9) {
                            celda.classList.add(elegirClase(buscaminas.tableroJuego[fila][columna]));
                            celda.innerHTML = buscaminas.tableroJuego[fila][columna];
                        }
                    }
                    
                    
                    
                }
            }
        }
    }

    function mostrarMinas(){
        let celda;
        for (let fila = 0; fila < buscaminas.filas; fila++) {
            for (let columna = 0; columna < buscaminas.columnas; columna++) {
                if (buscaminas.tableroJuego[fila][columna] == "9") {
                    celda = document.querySelector(`[data-posicion="${fila}-${columna}"]`);
                    celda.innerHTML = "💣";
                }
                else if (buscaminas.tableroJuego[fila][columna] == "X") {
                    celda = document.querySelector(`[data-posicion="${fila}-${columna}"]`);
                    celda.innerHTML = "❌";
                }
            }
        }
    }

    function elegirClase(filaColumna) {
        switch (filaColumna) {
            case 1:
                return "uno";
            case 2:
                return "dos";
            case 3:
                return "tres";
            case 4:
                return "cuatro";
            case 5:
                return "cinco";
            case 6:
                return "seis";
            case 7:
                return "siete";
            case 8:
                return "ocho";
        }
    }

    


    function clickBandera(e) {
        e.preventDefault();
        let resultado;
        let posicion = e.target.getAttribute("data-posicion").split("-");
        let celda = document.querySelector(`[data-posicion="${posicion[0]}-${posicion[1]}"]`);
        let fila = parseInt(posicion[0]);
        let columna = parseInt(posicion[1]);
        resultado = buscaminas.marcar(fila, columna);
        if (resultado == 1) { // Si se ha puesto una bandera
            celda.innerHTML = "🚩";
        }
        else if (resultado == 0){ // Si se ha quitado una bandera
            celda.innerHTML = "";
        }

        
        minasRestantes.innerHTML = buscaminas.banderas;
    }

    function ganarOperder(resultado) {
        if (resultado == 0) {
            mostrarMinas();
            resultadoHtml.innerHTML = "<h2>Has perdido</h2>";
            tableroJuego.removeEventListener("click", clickTablero);
            tableroJuego.removeEventListener("contextmenu", clickBandera);
        }
        else if (resultado == 1) {
            resultadoHtml.innerHTML = "<h2>Has ganado</h2>";
            tableroJuego.removeEventListener("click", clickTablero);
            tableroJuego.removeEventListener("contextmenu", clickBandera);
        }
    }

    






});
