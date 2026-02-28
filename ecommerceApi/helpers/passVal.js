function passVal(password) {
    const passReg = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/
    return passReg.test(password)
}

module.exports = passVal