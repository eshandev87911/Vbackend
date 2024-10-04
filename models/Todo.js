const mongoose = require('mongoose');

let todoSchema = new mongoose.Schema({
    task: {
        type: String,
        trim: true,
        required: true
    },
    isComp: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date,
        default: new Date(),
    },
    owner: {
        type: String,
        required: true,
        trim:true,
   }
})

let Todo = mongoose.model("todo", todoSchema);
module.exports = Todo;