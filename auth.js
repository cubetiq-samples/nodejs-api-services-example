const express = require('express')
const bodyParser = require('body-parser')

const authServer = express()
authServer.use(bodyParser.json())

const validateApiKey = (apiKey) => {
    if (apiKey === '1234') {
        return true
    }

    return false
}

authServer.post('/validate', (req, res) => {
    const isPassed = validateApiKey(req.body.apiKey)
    if (isPassed) {
        return res.status(200).json({
            message: "Passed",
        })
    }

    return res.status(401).json({
        message: "Unauthorized",
    })
})


authServer.listen(3001, () => {
    console.log("Auth Server is running on port 3001")
})