import { Router  } from "express";
import { getSumillasEnEspera, getUltimosOficios, getOficio, getOficiosByFiltro,
         getDepartamentos, getSumillasEnEsperaDireccion,
         getEstadoUsuarios, insertSumilla, deleteSumilla, getFiltroUsuarios, 
         updateSumilla } from '../controllers/oficiosController';
import {verificar}  from '../middlewares/verificarToken';         
import { getConnection} from 'typeorm';

const router = Router();
router.get('/oficiosEnEspera', verificar, getSumillasEnEspera);
router.get('/oficiosEnEsperaDireccion/:direccionId', verificar, getSumillasEnEsperaDireccion);
router.get('/oficiosByFiltro/:anio/:registro', verificar, getOficiosByFiltro);
router.get('/oficio/:id', verificar, getOficio);
router.get('/departamentos', verificar, getDepartamentos);
router.get('/estadoUsuarios', verificar, getEstadoUsuarios);
router.get('/filtroUsuarios/:buscar', verificar, getFiltroUsuarios);
router.post('/sumilla', verificar, insertSumilla);
router.delete('/sumilla/:id', verificar, deleteSumilla);
router.put('/sumilla/', verificar, updateSumilla);

//getConnection().close();

export default router;


