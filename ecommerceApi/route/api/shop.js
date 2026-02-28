const express = require('express')
const router = express.Router()

router.get('/product', (req, res) => {
    res.send({
        title: "Ultra-Comfort Cushioned Slides",
        price: "$34.56",
        size: "4.5M/5.5W"
    })
})


module.exports = router