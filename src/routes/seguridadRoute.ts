import { Router  } from "express";
import { login } from '../controllers/seguridadController'

const router = Router();
router.get('/login/:user/:password', login);

export default router;
