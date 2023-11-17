const express = require('express')
const path = require('path')

const app = express()

//SETTERS

app.set('PORT', 3000)
app.set('viewscl', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

//MIDDLEWARE

app.use(express.static(path.join(__dirname, '/public')))
app.use('/', require('./routes/index'))

app.listen(app.get('PORT'), ()=> console.log(`Server listen at port ${app.get('PORT')}`))