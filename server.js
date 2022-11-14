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

res.sendFile( rutaLogin)
})

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

app.post('/registro', async(req,res)=>{
    const { username, password } = req.body;
    await MongoUsers.guardar({ username, password });
    req.session.usuario = username;
    req.session.rank = 0;
    res.redirect("/");
})

app.get('/logout',(req,res)=>{
    req.session.destroy((err) => {
        res.redirect("/");
    });
})


app.listen(8081, () => console.log("conectados"));






