const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive number'],
        min: [0, 'Amount must be at least 0']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true,
        maxlength: [100, 'Description cannot be more than 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        trim: true,
        enum: [
            'Food',
            'Transportation',
            'Housing',
            'Utilities',
            'Entertainment',
            'Health',
            'Shopping',
            'Education',
            'Others'
        ]
    },
    date: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Expense', expenseSchema);
