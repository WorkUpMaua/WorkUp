import { Router } from "express";
import { getAllCatalogoController } from "./app/get_all_catalogo/get_all_catalogo_presenter";
import { CatalogoRepositoryMock } from "./repo/catalogoRepositoryMock";
import { createCatalogoController } from "./app/create_catalogo/create_catalogo_presenter";

const router: Router = Router()

router.get('/catalogo', (req, res) => getAllCatalogoController.handle(req, res))
router.post('/catalogo', (req, res) => createCatalogoController.handle(req, res))

export { router,  }