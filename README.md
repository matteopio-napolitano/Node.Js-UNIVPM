Node.Js-UNIVPM - Seminario UNIVPM
=======

Descrizione
-------

Questo repository contiene un progetto di esempio in cui viene dimostrato l'utilizzo della tecnologia Node.JS.
La web application è realizzata per mezzo del framework MVC [Locomotive.js ](https://github.com/jaredhanson/locomotive) e mostra l'implementazione di una semplice piattaforma per lo storage online di contenuti multimediali.

Installazione
-------

Installare il framework MVC Locomotive.js seguendo le [istruzioni qui riportate](https://github.com/jaredhanson/locomotive/blob/master/README.md)
Si consiglia di effettuare l'installazione del framework come di seguito riportato:

	$ npm install locomotive -g

Scaricare il pacchetto compresso di questo repository e decomprimerlo, poi raggiungere tramite terminale la cartella appena estratta

	$ cd /your/path/to/docus/

Infine eseguire le seguenti istruzioni per installare tutte le dipendenze necessarie al corretto funzionamento della web application ed avviare la piattaforma

	$ npm install
	$ lcm server

Aprire il browser e collegarsi all'indirizzo [localhost:3000](http://localhost:3000).

In alternativa, è possibile avviare il web server node in modalità debug

	$ lcm server --debug (node --debug mode)
	$ lcm server --debug-brk (node --debug-brk mode)

Autore
-------
Matteo Pio Napolitano - matteopio.napolitano@gmail.com