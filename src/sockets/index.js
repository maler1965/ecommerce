const PostService = require("../services/post.service");

class Sockets {
  constructor(io){ // el constructor recibe la variable io con los datos de la aplicacion conectada que se hizo en el server.js
    this.io = io;  //creamos una propiedad llamada io que recibe la io con la aplicacion
    this.postService = new PostService(); 

    this.socketEvents();  //escucha los eventos del socket
  }

  socketEvents(){
    this.io.on('connection', (socket) => { //le decimos que escuche (on) todas (io) las conecciones (connection) y que reciba como parametro el socket
      socket.on('new-post', async({ id }) => {
        try {
          const post = await this.postService.findPost(id);

          const newPost = await this.postService.downloadImgsPost(post)

          socket.broadcast.emit('render-new-post', newPost) //broadcast es una funcion para emitir los resultados a todos los clientes conectados execto al cliente que hizo la solicitud
        } catch (error) {
          throw new Error(error);
        }
      })
    });
  }
}

module.exports = Sockets;