const express = require('express')
const fetch = require('node-fetch')

const app = express()

const AUTH_URL = 'http://localhost:3001/validate'

const validateApiKey = async (apiKey) => {
    // request to auth service
    const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apiKey
        }),
    })

    const data = await response.json()
    if (data.message === 'Passed' && response.status === 200) {
        return true
    }

    return false
}

const MyAPIMiddleware = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey
    if (await validateApiKey(apiKey)) {
        next()
        return
    }

    return res.status(401).json({
        message: "Unauthorized"
    })
}

app.use(MyAPIMiddleware)

app.get('/', (req, res) => {
    const token = req.query.token
    const apiKey = req.headers['x-api-key'] || req.query.apiKey
    return res.json({
        name: "Hello My Service API",
        token,
        apiKey
    })
})

app.get('/resource/:filename', (req, res) => {
    const filename = req.params.filename
    const path = `./uploads/${filename}`
    res.sendFile(path, { root: __dirname })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})