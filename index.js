const express = require('express');
const app = express();
const fs = require('fs');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    fs.readdir('./data', (err, files) => {
        console.log(files);
        if (err) {
            res.status(500).send('Error reading files');
        } else {
            res.render('index', { files });
        }
    });
});

app.get('/create', (req, res) => {
    let today = new Date();
    let filename = today.toISOString().replace(/[:.]/g, '-');
    fs.writeFile(`./data/${filename}.txt`, '', (err) => {
        if (err) {
            res.status(500).send('Error creating file');
        } else {
            res.redirect('/');
        }
    });
});

app.get('/edit', (req, res) => {
    fs.readdir('./data', (err, files) => {
        console.log(files);
        if (err) {
            res.status(500).send('Error reading files');
        } else {
            let fileName = req.query.file || req.query.fileName;
            if (!fileName) {
                return res.redirect('/');
            }
            fs.readFile(`./data/${fileName}`, 'utf-8', (err, data) => {
                if (err) {
                    return res.status(500).send('Error reading file');
                }
                res.render('edit', { files, data, fileName });
            });
        }
    });
});

app.post('/update', (req, res) => {
    let { fileName, fileData } = req.body;
    console.log(fileName, fileData);
    fileData = fileData.trim();
    fs.writeFile(`./data/${fileName}`, fileData, (err) => {
        if (err) {
            res.status(500).send('Error updating file');
        } else {
            res.redirect(req.get('referer'));
        }
    });
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});