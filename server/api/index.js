const router = require('express').Router();
const { levelsRouter } = require('./levels');

router.use('/users', require('./users'));
router.use('/levels', levelsRouter);

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

module.exports = router;
