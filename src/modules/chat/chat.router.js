import {Router} from 'express'
import { auth } from './../../middleware/auth.js';
import * as chatcontroller from './chat.controller.js'
import { asyncHandler } from '../../utils/errorhandling.js';
const router = Router()

router.post('/',auth(),asyncHandler(chatcontroller.sendMessage))
router.get('/ovo/:destId',auth(),asyncHandler(chatcontroller.getchat))
router.get('/allchats',auth(),asyncHandler(chatcontroller.getUserchats))
router.post('/group',auth(),asyncHandler(chatcontroller.creatgroup))
router.put('/group/:chatId',auth(),asyncHandler(chatcontroller.renameGroup))
router.put('/addgroup/:chatId/:userId',auth(),asyncHandler(chatcontroller.addUsertoGroup))
router.delete('/remove/:chatId/:userId',auth(),asyncHandler(chatcontroller.removeUserfromGroup))



export default router