const fs = require('fs')
const path = require('path')

const { DATA_DIR } = require('./constant')
const DB_FILE_PATH = `${DATA_DIR}/db.json`

const validateDataDir = () => {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true })
    }
}

const db = {
    files: [],
}

const addFile = (file) => {
    db.files.push({
        originalname: file.originalname,
        path: file.path,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
    })
}

const getFileByFilename = (filename) => {
    return db.files.find(file => file.filename === filename)
}

const saveFilesToDisk = () => {
    const filePath = path.join(__dirname, DB_FILE_PATH)
    validateDataDir()

    const data = JSON.stringify(db)

    fs.writeFileSync(filePath, data, { encoding: 'utf-8' })
    console.log("Files saved to disk")
}

const loadFilesFromDisk = () => {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(__dirname, DB_FILE_PATH)

    if (!fs.existsSync(filePath)) {
        console.log("File not found")
        return
    }

    const data = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const parsedData = JSON.parse(data)
    db.files = parsedData.files
    console.log("Files loaded from disk")
}

module.exports = {
    db,
    addFile,
    getFileByFilename,
    saveFilesToDisk,
    loadFilesFromDisk,
    validateDataDir,
    DATA_DIR,
}