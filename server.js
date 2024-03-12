const express = require('express');
const path = require('path');
const pug = require('pug');
const fs = require("fs");
const bodyParser = require('body-parser');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis').default

function error_log(err) {
    let d = new Date();
    let logFile = fs.createWriteStream(__dirname + '/error_debug.log', { flags: 'a' });
    logFile.write(d.toLocaleString() + ' ' + err.message + '/n');
    console.log(err);
}

// настройка клиент Redis
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});
redisClient.connect().catch(console.error);

// создание хранилища
let redisStore = new RedisStore({
    client: redisClient,
    prefix: "bookshop:",
});

const app = express();
app.set('view engine', 'pug');
app.use('/media', express.static('media'));
app.use(bodyParser.json());
app.use(session({
    store: redisStore,
    secret: 'j46eMKWwUFn3aWE252*Q24Y4XqKAGSGS',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

app.get('/', (req, res) => {
    fs.readFile("books.json", (err, data) => {
        if (err) {
            error_log(err);
        }
        let filename = path.join(__dirname, "views", "catalog.pug");
        let template = pug.renderFile(
            filename,
            {
                cards: JSON.parse(data),
                page: "main"
            }
        )
        res.send(template);
    })
});


// добавление книги в корзину
// @param {Request} req
app.post('/buy', (req, res) => {
    // // 1. синхронная запись в файл:
    // fs.writeFileSync("users_books.csv", "test");

    // // 2. асинхронная запись в файл с фунцией обратного вызова:
    // // fs.writeFile("users_books.csv", "test", function() {
    // //     console.log("File has been writed");
    // // });

    // // 3. promise
    // // const promise = writeFile("users_books.csv", "test");
    // // promise.then(() => console.log("File has been writed"));
    
    // const userId = Math.ceil(Math.random() * 1000);
    // const d = new Date();
    // d.setHours(d.getHours() + 5);
    // const expires = d.toUTCString();
    // res.setHeader("Set-Cookie", "user=" + userId + "; expires=" + expires);
    // res.send(req.body);
    
    if (!req.session.books) {
        req.session.books = { [req.body.book_id]: 1 };
    } else {
        req.session.books[req.body.book_id] = 1;
    }
    res.sendStatus(200);
});

app.get('/auth', (req, res) => {
    res.render('auth', { page: 'auth' });
});

app.post('/auth', (req, res) => {
    res.sendStatus(200);
});

app.get('/order', (req, res) => {
    let filepath = path.join(__dirname, "views", "order.pug");
    let template = pug.renderFile(filepath, 
        {
            page: "order"
        });
        res.send(template);

});

app.get('/profile', (req,res) => {
    res.render('profile');
});

app.get('/icons.css', (req, res) => {
    res.sendFile(path.join(__dirname, "node_modules/bootstrap-icons/font/bootsrap-icons.min.css"));
});


app.listen(3000, () => {
    console.log(`Server started by address: http://bookshop.local:3000`);
})