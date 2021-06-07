import { Router  } from "express";
import { getOficiosSumilla, getUltimosOficios, getOficio } from '../controllers/oficiosController';

const router = Router();
router.get('/oficios/:anio', getOficiosSumilla);
router.get('/ultimoOficios/', getUltimosOficios);
router.get('/oficio/:id', getOficio);

export default router;


