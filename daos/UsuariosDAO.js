import ContenedorMongoDb from "../contenedores/contenedorMongoDb.js";

class DAOUsuarios extends ContenedorMongoDb {
  constructor() {
    super("usuarios", {
      username: { type: String },
      password: { type: String },     
    });
  }
}
export default DAOUsuarios;
