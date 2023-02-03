const express = require('express')
const { db, addFile, getFileByFilename, loadFilesFromDisk, saveFilesToDisk, DATA_DIR } = require('./db')

const uploader = express()

const multer = require('multer')
const upload = multer({ dest: `${DATA_DIR}/uploads/` })

uploader.post('/upload', upload.single('file'), (req, res) => {
    addFile(req.file)

    const file = req.file
    const filename = file.filename
    const path = `http://localhost:3002/resource/${filename}`
    return res.json({
        path
    })
})

uploader.get('/resource/:filename', (req, res) => {
    const filename = req.params.filename
    const path = `${DATA_DIR}/uploads/${filename}`
    const file = getFileByFilename(filename)
    if (!file) {
        return res.status(404).json({
            message: "File not found"
        })
    }

    res.setHeader('Content-Type', file.mimetype)
    res.setHeader('Content-Length', file.size)
    res.setHeader('Content-Disposition', `inline; filename=${encodeURIComponent(file.originalname)}`)

    res.sendFile(path, { root: __dirname })
})

uploader.get('/files', (req, res) => {
    const filesWithURL = db.files.map(file => {
        const filename = file.filename
        const url = `http://localhost:3002/resource/${filename}`
        return {
            ...file,
            url,
        }
    })

    return res.json(filesWithURL)
})

uploader.get('/save', (req, res) => {
    saveFilesToDisk()

    return res.json({
        message: "Files saved to disk"
    })
})


uploader.listen(3002, () => {
    loadFilesFromDisk()

    console.log("Uploader is running on port 3002")
})