const router = require('express').Router();
const m = require('../controllers/miscController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/notifications', m.notifications);
router.patch('/notifications/mark-all-read', m.markAllRead);
router.patch('/notifications/:id/read', m.markRead);

module.exports = router;
