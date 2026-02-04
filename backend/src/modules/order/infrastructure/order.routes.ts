import { Router } from 'express';
import { OrderController } from './order.controller';

const router = Router();

// POST /api/orders
router.post('/', OrderController.create);

// GET /api/orders
router.get('/', OrderController.list);

// GET /api/orders/:id
router.get('/:id', OrderController.getById);

// PATCH /api/orders/:id/status
router.patch('/:id/status', OrderController.updateStatus);

// POST /api/orders/:id/cancel
router.post('/:id/cancel', OrderController.cancel);

export default router;