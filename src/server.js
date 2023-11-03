require('dotenv').config();
const initModel = require('./models/initModels');
const app = require('./app');
const { db } = require('./database/config');
const { Server } = require('socket.io');  // para tener websocket y conectarse con el front end
const Sockets = require('./sockets'); //importa la clase que se construyo en el index.js

db.authenticate()
  .then(() => console.log('Database connected✌️...'))
  .catch((err) => console.log(err));

initModel();

db.sync({ force: false })
  .then(() => console.log('Database synced✌️...'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {  //app.listen(PORT....) trae cualquier aplicacion de express que este escuchando o conectado a ese puerto
  console.log(`Server is up on port ${PORT}`);
});

const io = new Server(server, {  // el io llama a la clase Server y le pasa la aplicacion que esta conectada en server arriba por el puerto
  cors: {  //cors son como protocolos de comunicacion, que se configura para que acepte solo lo que queremos
    origin: '*',  //con esto acepta todas las rutas
    methods: ['GET', 'POST'], //acepta solo get y postl
  }
})

new Sockets(io) //llama a la clase que se construyo en el index.js y se le pasa el io como parametro
