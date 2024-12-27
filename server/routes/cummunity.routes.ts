// Basic CRUD operations
router.post('/', authMiddleware, createCommunity);
router.get('/', getAllCommunities);
router.get('/:id', getCommunity);
router.patch('/:id', authMiddleware, updateCommunity);
router.delete('/:id', authMiddleware, deleteCommunity);

// Membership operations
router.post('/:id/join', authMiddleware, joinCommunity);
router.post('/:id/leave', authMiddleware, leaveCommunity);

// Moderation operations
router.post('/:id/moderators', authMiddleware, addModerator);
router.delete('/:id/moderators/:userId', authMiddleware, removeModerator);

// Rules management
router.post('/:id/rules', authMiddleware, addRule);
router.delete('/:id/rules/:ruleId', authMiddleware, deleteRule);