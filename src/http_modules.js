const http = require('http');

const PORT = 8080; // CONSTANTE CON EL PUERTO, 8080 ES EL UTILIZADO POR DEFAULT EN HTTP

const server = http.createServer((req, res) =>{
    res.end('Hola mundo desde el backend!!');
});

server.listen(PORT, () =>{
    console.log(`Servidor escuchando en puerto ${PORT}`);
});