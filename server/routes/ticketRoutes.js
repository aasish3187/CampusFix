const router = require('express').Router();
const c = require('../controllers/ticketController');
const m = require('../controllers/miscController');
const { protect, allow } = require('../middleware/auth');

router.use(protect);

router.get('/check-duplicates', c.checkDuplicates);
router.get('/staff-list', allow('admin'), c.staffList);
router.get('/', c.list);
router.post('/', allow('student', 'faculty', 'admin'), c.create);
router.get('/:id', c.get);
router.patch('/:id', c.update);
router.post('/:id/reopen', allow('student', 'faculty'), c.reopen);
router.post('/:id/feedback', allow('student', 'faculty'), c.feedback);
router.get('/:id/activities', m.activities);

module.exports = router;
