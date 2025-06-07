import { Router } from "express";
import multer from 'multer'
import { getAllCatalogoController } from "../../app/get_all_catalogo/get_all_catalogo_presenter";
import { getCatalogoController } from "../../app/get_catalogo/get_catalogo_presenter";
import { createCatalogoController } from "../../app/create_catalogo/create_catalogo_presenter";
import { deleteCatalogoController } from "../../app/delete_catalogo/delete_catalogo_presenter";
import { updateCatalogoController } from "../../app/update_catalogo/update_catalogo_presenter";

const router: Router = Router()

const upload = multer({storage: multer.memoryStorage()})

router.get('/catalogo', (req, res) => getAllCatalogoController.handle(req, res))
router.get('/catalogo/:id', (req, res) => getCatalogoController.handle(req, res))
router.post('/catalogo', upload.array('pictures', 10), async (req, res) => await createCatalogoController.handle(req, res))
router.delete('/catalogo/:id', async (req, res) => await deleteCatalogoController.handle(req, res))
router.patch('/catalogo/:id', async (req, res) => await updateCatalogoController.handle(req, res))

export { router,  }