import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import DAOUsuarios from "./daos/UsuariosDAO.js";
import url from 'url'
import { join } from "path";
const MongoUsers = new DAOUsuarios();

const app = express();

const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
const rutaLogin = join(__dirname,"public/login.html")
const rutaBienvenido = join(__dirname,"public/bienvenido.html")
const rutaRegistro= join(__dirname,"public/registro.html")



app.use(session({
    secret:'12354asd223bbthhhasd',
    resave: 'false',
    saveUninitialized: false,
    cookie: {
        maxAge: 10 * 1000 * 60,
    },
    store:MongoStore.create({
        mongoUrl:'mongodb+srv://sebasindahouse:Mosi0310@cluster0.epscnqt.mongodb.net/sesiones',
        mongoOptions
    })
}))


const auth= (req,res,next)=>{
    req.session.isAdmin == true?next():res.status(401).send('sin permisos')
}

app.get('/',(req,res)=>{
    if (req.query.user) req.session.usuario = req.query.user;
    if (req.session.usuario) {
    res.sendFile(rutaBienvenido)
    res.send(
        `Hola ${req.session.usuario} `
    );
    }else {
        res.sendFile(rutaLogin);
    }
    }
)

app.post('/',async(req,res)=>{
    try {
        const { username, password } = req.body;
        const usuario = await MongoUsers.listar(username, password);
        console.log(usuario);
        req.session.usuario = username;
        res.redirect("/");
    } catch (e) {
        res.redirect("/?error=true");
    }
})

app.get('/registro',(req,res)=>{
    res.sendFile(rutaRegistro)
})

app.post('/registro', async(req,res)=>{
    res.sendFile(rutaRegistro)
    const { username, password } = req.body;
    await MongoUsers.guardar({ username, password });
    req.session.usuario = username;
    res.redirect("/");
})

app.get('/logout',(req,res)=>{
    req.session.destroy((err) => {
        res.redirect("/");
    });
})


app.listen(8081, () => console.log("conectados"));






