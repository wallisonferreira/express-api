const express = require('express')
const { body, validationResult } = require('express-validator')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const DB_CONNECT = process.env.DB_CONNECT
mongoose.connect(DB_CONNECT, {
    authSource: 'admin',
    useNewUrlParser: 'true',
    useUnifiedTopology: 'true'  
}).then(() => {
    console.log('[INFO] Database connected successfully')
}).catch(error => {
    console.error('[ERROR] Database error:', error)
})

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

const UserModel = mongoose.model('User', UserSchema)

app.use(express.json())

// Routes
app.get('/',function (req, res) {
    res.status(201).json({'message':'Hello World'})
})

const userDataValidation = [
    body('username').exists(),
    body('name').exists(),
    body('email').exists()
]

app.get('/users', function (req, res) {
    UserModel.find({})
        .then(users => {
            res.json(users)
        })
        .catch(error => {
            console.error('[ERROR} Error while fetching data:', error)
            res.status(500).json({ error })
        })
})

app.post('/users', userDataValidation, function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()})
    }
    const userData = req.body

    UserModel.create(userData)
        .then(userDoc => {
            res.json(userDoc)
        }).catch(error => {
            console.error('[ERROR] Error while saving data:', error)
            res.status(500).json({ error })
        })
})

app.listen(3000, function() {
    console.log('Started listening on port 3000')
}) 