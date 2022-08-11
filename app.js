const mongoose = require('mongoose');
const express = require('express');
const Sneaker = require('./models/sneaker')
const ejs = require('ejs');
const session = require('express-session')
const app = express();
const multer = require('multer')
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(express.json());
const port_number = process.env.PORT || 3000;

const sizes = [3, 4, 5, 6, 7]

const dbUri = `mongodb+srv://admin:%40326CE21S@cluster0.5qfuhwx.mongodb.net/?retryWrites=true&w=majority`

var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname.split(' ').join('_'))
        }
    }),
})

app.get('/', (req, res) => {
    res.render('index', {title: 'Solace | Home'})
})

app.get('/newsneaker', (req, res)=> {
    res.render('new', {sizes: sizes, title: 'Solace | New Sneakers'})
})

app.post('/newsneaker', upload.single('file'), (req, res)=> {
    if (req.file){
        const sneaker = new Sneaker({
            name: req.body.name,
            brand: req.body.brand,
            color: req.body.color,
            gender: Boolean(parseInt(req.body.gender)),
            image: req.file.filename
        });
        sneaker.save()
        .then(()=>{console.log('added sneaker type')})
    }
    res.redirect('/newsneakers')
})

app.get('/filter/:filter', async (req, res) => {
    filter = req.params.filter
    console.log(await Sneaker.find({gender:false}))
    if (filter=='men'){
        res.render('sneakers', {sneakers: await Sneaker.find({gender:false}), title: 'Solace | Sneakers for Men'})
    } else if (filter=='women'){
        res.render('sneakers', {sneakers: await Sneaker.find({gender:true}), title: 'Solace | Sneakers for Women'})
    }
})


mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(
        (res) => {
            console.log('connected to db');
            app.listen(port_number, () => {
                console.log(`listening on port ${port_number}`)
            })
        }
    )
    .catch(
        (err) => {
            console.log(err);
        } // end of catch
    )