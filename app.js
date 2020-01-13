const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const postRouter = require('./routes/post')
const keys = require('./keys')


const clientPath = path.join(__dirname, 'client')

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => { console.log('MongoDB connected') })
    .catch(err => console.log(err))
const app = express()
app.use(bodyParser.json())
app.use('/api/post', postRouter)

app.use(express.static(clientPath))
const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server has been started on port ${port}`)
})