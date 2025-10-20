import { Router } from "express"
import { getAllPropertyController } from "../../../app/getAllProperty/get_all_property_presenter"
import { getPropertyController } from "../../../app/getProperty/get_property_presenter"



const router: Router = Router()

router.get('/property/:id', (req, res) => getAllPropertyController.handle(req, res))
router.get('/property', (req, res) => getPropertyController.handle(req, res))

export { router,  }