// extracting logging into its owm module
// info for printing normal log messages
// error for priting all error messages

const info = (...params) => {
    console.log(...params)
}

const error = (...params) => {
    console.error(...params)
}

module.exports = { 
    info, error
}