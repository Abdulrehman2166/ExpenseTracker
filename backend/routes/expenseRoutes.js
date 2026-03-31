const express = require('express');
const { 
    getExpenses, 
    getExpense, 
    addExpense, 
    updateExpense, 
    deleteExpense,
    getSummary
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protection to all routes below
router.use(protect);

router
    .route('/')
    .get(getExpenses)
    .post(addExpense);

router.get('/summary', getSummary);

router
    .route('/:id')
    .get(getExpense)
    .put(updateExpense)
    .delete(deleteExpense);

module.exports = router;
