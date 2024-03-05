const express = require('express');
const path = require('path');
const pug = require('pug');
const fs = require("fs");
const bodyParser = require('body-parser');
const session = require('express-session');
const auth = require('auth');


function error_log(err) {
    let d = new Date();
    let logFile = fs.createWriteStream(__dirname + '/error_debug.log', { flags: 'a' });
    logFile.write(d.toLocaleString() + ' ' + err.message + '/n');
    console.log(err);
}

const app = express();
app.use('/media', express.static('media'));
app.use(bodyParser.json());
app.set('trust proxy', 1);
app.use(session({
    secret: 'j46eMKWwUFn3aWE252*Q24Y4XqKAGSGS',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
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
  
    req.session.book_id = req.body.book_id;
    console.log(req.session);
    res.sendStatus(200);
});

app.get('/auth', (req, res) => {
    let filepath = path.join(__dirname, "views", "auth.pug");
    let template = pug.renderFile(filepath, {page: "auth"});
    res.send(template);
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
    res.send("Profile page will be soon added!");
});

app.get('/icons.css', (req, res) => {
    res.sendFile(path.join(__dirname, "node_modules/bootstrap-icons/font/bootsrap-icons.min.css"));
});


app.listen(3000, () => {
    console.log(`Server started by address: http://bookshop.local:3000`);
})