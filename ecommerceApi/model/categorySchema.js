const mongoose = require("mongoose")
const {Schema} = mongoose

const categorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    subcategorylist: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory"
    }
    ]
})

module.exports = mongoose.model("category", categorySchema)