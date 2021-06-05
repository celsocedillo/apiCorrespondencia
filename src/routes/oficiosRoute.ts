import { Router  } from "express";
import { getOficiosSumilla, getUltimosOficios } from '../controllers/oficiosController';

const router = Router();
router.get('/oficios/:anio', getOficiosSumilla);
router.get('/ultimoOficios/', getUltimosOficios);


export default router;


