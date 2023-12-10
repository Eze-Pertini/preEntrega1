import ProductManager from "./ProductManager.js";
import express from 'express';
import { inflateRaw } from 'zlib';

const productManager = new ProductManager('./products.json');
const PORT = 8080;
const app = express(); 
app.use(express.urlencoded({extended:true})); // PERMITE OBTENER LAS QUERYS



app.get('/saludo', (req, res) => {
    res.send('Hola mundo desde el servidor');
})



const user = {
    name: 'Ezequiel',
    lastName: 'Pertini',
    age: 32,
    mail: 'epertini00@gmail.com',
    gender: 'M'
}

const users = [
    {
        id: 1,
        name: 'Ezequiel',
        lastName: 'Pertini',
        age: 32,
        mail: 'epertini00@gmail.com',
        gender: 'M'
    },

    {
        id: 2,
        name: 'Carolina',
        lastName: 'Tanco',
        age: 329,
        mail: 'carotanco00@gmail.com',
        gender: 'F'
    },

    {
        id: 3,
        name: 'Tobias',
        lastName: 'Pertini',
        age: 13,
        mail: 'tobipertini@gmail.com',
        gender: 'M'
    },

    {
        id: 4,
        name: 'Mora',
        lastName: 'Pertini',
        age: 3,
        mail: 'morapertini@gmail.com',
        gender: 'F'
    }
];



app.get('/bienvenida', (req, res) => {
    res.send('<h1 style="color:blue"> Bienvenidos!</h1>');
});


app.get('/user', (req, res) => {
    res.send(user);
});

// app.get('/users', (req, res) => {
//     res.send(users);
// });

app.get('/users/:id', (req, res) => {
    // EL ID LO RECIBIMOS COMO STRING ---> HAY QUE CONVERTIRLO A ENTERO (INT)
    const {id} = req.params;
    const user = users.find(u => u.id === parseInt(id));
    if(!user){
        res.send({error: 'user nor found'});
    }
    res.send(user);
});


// CONSULTA POR QUERY

app.get('/users', (req, res) => {
    const {gender} = req.query;
    if(!gender){
        return res.send({users});
    }
    if(gender.toUpperCase() !== 'F' && gender.toUpperCase() !== 'M' && gender.toUpperCase() !== 'X'){
        return res.send({error: 'Genero inexistente'});
    }
    const filteredUsers = users.filter(u => u.gender === gender.toUpperCase());
    res.send(filteredUsers);
        
});


app.get('/user-param/:name/:lastName', (req, res) => {
    const {name, lastName} = req.params;
    res.send(`Hola ${name} ${lastName}`);
});



app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});

// app.get('/products', async(req, res) => {
//     const products = await productManager.getProducts();
//     res.send(products);
// });

app.get('/products', async (req, res) => {

    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if(!limit){
        res.send(products);
    }else{
        // Si se proporciona un límite, convertirlo a un número
        const limitNumber = parseInt(limit, 10);

        // Verificar si el límite es un número válido
        if (!isNaN(limitNumber) && limitNumber > 0) {
            // Devolver solo el número de productos solicitados
            res.send(products.slice(0, limitNumber));
        } else {
            // Si el límite no es válido, devolver un error o manejar según sea necesario
            res.status(400).send('Parámetro de límite no válido');
        }
    }
});


