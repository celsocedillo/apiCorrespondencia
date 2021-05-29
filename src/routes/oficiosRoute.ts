import { Router  } from "express";
import { getOficiosSumilla } from '../controllers/oficiosController';

const router = Router();
router.get('/oficios/:anio', getOficiosSumilla);


export default router;


