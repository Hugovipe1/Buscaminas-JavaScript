# Tarea 6.3 Buscaminas (negocio)
## Autor: Hugo Vicente Peligro

Juega al buscaminas y analiza en qué consiste el juego:

- Según el nivel que elijas, tu campo de minas tiene unas dimensiones con un número de minas concreto.
- Al iniciar todo el campo está cubierto. Se pueden realizar las siguientes acciones:
    - Botón izquierdo del ratón: se levanta la casilla. 

        - Si es una mina se pierde el juego. 
        - Si no lo es se despeja indicando el número de minas que hay alrededor (1, 2... 8). En caso de no haber ninguna mina alrededor, el juego despeja las casillas colindantes de forma recurrente.
    - Botón derecho: Se marca/desmarca una mina con bandera.
        - Si la casilla no tiene bandera, entonces se marca.
        - Si la casilla sí tiene bandera, entonces de desmarca.
    - Botones izquierdo y derecho: Da pistas. Se intenta destapar/despejar aquellas casillas de alrededor a una ya destapada:
        - Si falta alguna mina por marcar, se indican las casillas mediante un parpadeo
        - Si están marcadas todas las minas de alrededor:
            - Si están correctas: se despejan las casillas de alrededor.
            - Si hay error: se indica la bomba y el error y se termina el juego.
- Al iniciarse el juego se pone en marcha el temporizador. En caso de superarse el récord, el juego te lo indica.
- Al iniciarse el juego aparece un contador con las minas del campo. Conforme se marca/desmarca una mina, el contador se actualiza.
Aprende a jugar para implementarlo mediante JavaScript.

Sigue los siguientes pasos:

1. Evitando la globalidad (módulos o module pattern), créate un objeto "buscaminas" al que puedas invocar sólo los siguientes métodos (el resto quedará privado):
    1. Buscaminas .init(): genera un campo de minas nuevo y lo muestra por consola.
    1. Buscaminas .mostrar(): muestra el campo de minas por consola. PARA HACER PRUEBAS DEBE MOSTRAR LAS MINAS. 
    1. Buscaminas .picar(x, y): pica en la casilla (x, y) y muestra el campo de minas actualizado. 
       1. En caso de picar una minas se indica que se ha perdido el juego. 
        1. En caso de no quedar casillas por levantar se indica que se ha ganado el juego. Da igual si las minas están marcadas o no.
    1. Buscaminas .marcar(x, y): marca con una bandera la casilla (x, y) y muestra el campo de minas actualizado.
    1. Buscaminas .despejar(x, y): intenta destapar las casillas colindantes, sólo si el número de banderas se corresponden con las que indica la casilla. Entonces muestra el campo de minas actualizado.
        1. En caso de estar las banderas equivocadas se indica que se ha perdido el juego.
1. Después se generará el entorno gráfico. Pero eso no entra en esta entrega. Por eso deberás mostrar por consola el estado del campo de minas ante cada acción. 