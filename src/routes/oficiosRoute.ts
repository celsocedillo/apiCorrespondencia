import { Router  } from "express";
import { getSumillasEnEspera, getUltimosOficios, getOficio, getOficiosByFiltro,
         getDepartamentos, 
         getEstadoUsuarios, insertSumilla, deleteSumilla, getFiltroUsuarios, 
         updateSumilla } from '../controllers/oficiosController';

const router = Router();
router.get('/oficiosEnEspera', getSumillasEnEspera);
router.get('/oficiosByFiltro/:anio/:registro', getOficiosByFiltro);
router.get('/oficio/:id', getOficio);
router.get('/departamentos', getDepartamentos);
router.get('/estadoUsuarios', getEstadoUsuarios);
router.get('/filtroUsuarios/:buscar', getFiltroUsuarios);
router.post('/sumilla', insertSumilla);
router.delete('/sumilla/:id', deleteSumilla);
router.put('/sumilla/', updateSumilla);

export default router;


