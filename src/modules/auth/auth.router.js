import {Router} from 'express'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as controller from './auth.controller.js'
import { multerCloudinary } from '../../services/multer.js'
import { auth } from '../../middleware/auth.js'
const router = Router()


router.post('/',multerCloudinary().single('pic'),asyncHandler(controller.signup))
router.post('/login',asyncHandler(controller.login))
router.get('/search',auth(),asyncHandler(controller.searchUser))



export default router