/**
 * @author Hugo Vicente Peligro
 */
import { buscaminas } from "./buscaminas.js";

document.addEventListener("DOMContentLoaded", function () {
    let tableroJuego = document.getElementById("tableroJuego")
    let minasRestantes = document.getElementById("minasRestantes");
    let tiempo = document.getElementById("tiempo");
    let cabecera = document.getElementById("cabecera");
    let resultadoHtml = document.getElementById("resultado");
    let contadorClick = 0;
    let contador = 0;
    let interval;

    tableroJuego.addEventListener("click", clickTablero);
    tableroJuego.addEventListener("contextmenu", clickBandera);


    pintarTablero();

    document.getElementById("select").addEventListener("change", function (e) { //Cuando cambia el select(dificultad)
        clearInterval(interval);
        tiempo.innerHTML = "";
        contadorClick = 0;
        contador = 0;
        tableroJuego.addEventListener("click", clickTablero);
        tableroJuego.addEventListener("contextmenu", clickBandera);
        resultadoHtml.innerHTML = "";
        pintarTablero(e.target.value);
    });

    function pintarTablero(dificultad = "facil") {
        tableroJuego.innerHTML = "";
        try {
            buscaminas.init(dificultad);
        } catch (error) {
            console.error(error.message);
        }
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
        if (e.target.id != "tableroJuego") {
            let posicion = e.target.dataset.posicion.split("-");
            let fila = parseInt(posicion[0]);
            let columna = parseInt(posicion[1]);
            let resultado;
            if (e.buttons == 0) {
                resultado = buscaminas.picar(fila, columna);
                actualizarTableroDom();
                ganarOperder(resultado); //Comprueba si se ha ganado o perdido
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
            if (contadorClick == 0) {
                interval = setInterval(function () {
                    contador++;
                    tiempo.innerHTML = contador;
                }, 1000);
                contadorClick++;
            }
        }
    }

    function actualizarTableroDom() {
        let celda;
        for (let fila = 0; fila < buscaminas.filas; fila++) {
            for (let columna = 0; columna < buscaminas.columnas; columna++) {
                if (buscaminas.tableroJuego[fila][columna] != 0) {
                    celda = document.querySelector(`[data-posicion="${fila}-${columna}"]`);
                    if (buscaminas.tableroJuego[fila][columna] != "B" && buscaminas.tableroJuego[fila][columna] != "9" && buscaminas.tableroJuego[fila][columna] != "X") {
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

    function mostrarMinas() {
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
        console.log(e.target.tagName);
        if (e.target.id != "tableroJuego") {
            let resultado;
            let posicion = e.target.getAttribute("data-posicion").split("-");
            let celda = document.querySelector(`[data-posicion="${posicion[0]}-${posicion[1]}"]`);
            let fila = parseInt(posicion[0]);
            let columna = parseInt(posicion[1]);
            resultado = buscaminas.marcar(fila, columna);
            resultado == 1 ? celda.innerHTML = "🚩" : resultado == 0 ? celda.innerHTML = "" : null; // Si se ha puesto una bandera o se ha quitado    
            minasRestantes.innerHTML = buscaminas.banderas;
        }

    }

    function ganarOperder(resultado) {
        if (resultado == 0) {
            mostrarMinas(); // Al haber perdido, se muestran todas las minas
            resultadoHtml.innerHTML = "<h2>Has perdido</h2>";
            tableroJuego.removeEventListener("click", clickTablero);
            tableroJuego.removeEventListener("contextmenu", clickBandera);
            clearInterval(interval);
        }
        else if (resultado == 1) {
            resultadoHtml.innerHTML = "<h2>Has ganado</h2>";
            if (localStorage.getItem("tiempoPartida") == null || (localStorage.getItem("tiempoPartida") > tiempo.innerHTML)) {
                localStorage.setItem("tiempoPartida", tiempo.innerHTML)
                resultadoHtml.innerHTML += `<h3>Has conseguido el mejor tiempo ${tiempo.innerHTML} segundos</h3>`;
            }
            else {
                resultadoHtml.innerHTML += `<h3>Mejor tiempo: ${localStorage.getItem("tiempoPartida")} segundos.  Tiempo actual: ${tiempo.innerHTML} segundos</h3>`;
            }
            clearInterval(interval);
            tableroJuego.removeEventListener("click", clickTablero);
            tableroJuego.removeEventListener("contextmenu", clickBandera);
        }
    }
});