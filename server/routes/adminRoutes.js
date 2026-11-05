const router = require('express').Router();
const m = require('../controllers/miscController');
const { protect, allow } = require('../middleware/auth');

router.use(protect, allow('admin'));
router.get('/users', m.users);
router.post('/users', m.createUser);
router.patch('/users/:id/status', m.userStatus);
router.get('/analytics', m.analytics);

module.exports = router;
