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
    res.render('index', { title: 'Solace | Home' })
})

app.get('/filter/:filter', async (req, res) => {
    filter = req.params.filter
    if (filter == 'men') {
        sneakers = await Sneaker.find({ gender: false });
        res.render('sneakers', { sneakers: sneakers, title: 'Solace | Sneakers for Men', filter: 'Gender (Men)' })
    } else if (filter == 'women') {
        sneakers = await Sneaker.find({ gender: true });
        res.render('sneakers', { sneakers: sneakers, title: 'Solace | Sneakers for Women', filter: 'Gender (Women)' })
    } else if (filter == 'color') {
        paramColor = req.query.c
        if (paramColor) {

            sneakers = await Sneaker.find({ color: paramColor })
            res.render('sneakers', { sneakers: sneakers, title: 'Solace | ' + paramColor + ' Sneakers', filter: `Color(${paramColor})` })
        } else {
            let colors = new Set()
            sneakers = await Sneaker.find();
            for (sneaker of sneakers) {
                colors.add(sneaker.color);
            }
            res.render('choice', { title: 'Solace | Sort by Colour', colors: colors })
        }
    } else if (filter == 'brand') {
        paramBrand = req.query.b
        if (paramBrand) {
            console.log(paramBrand)
            sneakers = await Sneaker.find({ brand: paramBrand })
            res.render('sneakers', { sneakers: sneakers, title: 'Solace |  Sneakers by ' + paramBrand, filter: `Brand(${paramBrand})` })
        } else {
            let brands = new Set()
            sneakers = await Sneaker.find();
            for (sneaker of sneakers) {
                brands.add(sneaker.brand);
            }
            console.log(brands)
            res.render('choice', { title: 'Solace | Sort by Brand', colors: false, brands: brands })
        }
    }
})

app.get('/sneaker/:id', async (req, res)=> {
    sneaker = await Sneaker.findOne({_id: req.params.id})
    console.log(sneaker)
    sneaker.click += 1;
    sneaker.save()
    .then(()=>{
        console.log('click updated')
    })
    res.render('product', {title: `Solace | ${sneaker.name}`, sneaker:sneaker})
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