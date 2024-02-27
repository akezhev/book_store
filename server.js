const express = require('express');
const path = require('path');
const pug = require('pug');
const fs = require("fs");
const bodyParser = require('body-parser');

function error_log(err) {
    let d = new Date();
    let logFile = fs.createWriteStream(__dirname + '/error_debug.log', { flags: 'a' });
    logFile.write(d.toLocaleString() + ' ' + err.message + '/n');
    console.log(err);
}

const app = express();
app.use('/media', express.static('media'));
app.use(bodyParser.json());

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
    res.send(req.body);
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
    console.log(`Server started by address: http://localhost:3000`);
})