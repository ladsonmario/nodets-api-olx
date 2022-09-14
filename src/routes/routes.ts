import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';
import { AdController } from '../controllers/AdController';
import { StateController } from '../controllers/StateController';
import { CategoryController } from '../controllers/CategoryController';
import { Validator } from '../validators/Validator';
import { privateRouteJwt } from '../middlewares/AuthPassport';
import { UploadFiles } from '../middlewares/UploadFile';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
    res.json({ pong: true });;
});

router.get('/states/list', StateController.getStates);
router.post('/states/add', privateRouteJwt, Validator.addState, StateController.addState);
router.delete('/states/:id', privateRouteJwt, StateController.delState);

router.post('/user/signin', Validator.signin, AuthController.signin);
router.post('/user/signup', Validator.signup, AuthController.signup);

router.get('/user/me', privateRouteJwt, UserController.infoUser);
router.put('/user/me', privateRouteJwt, Validator.editUser, UserController.editUser);
router.delete('/user/:id', privateRouteJwt, UserController.delUser);

router.get('/category/list', CategoryController.getCategories);
router.post('/category/add', privateRouteJwt, UploadFiles.single('img'), CategoryController.addCategory);
router.delete('/category/:id', privateRouteJwt, CategoryController.delCategory);

router.post('/ad/add', privateRouteJwt, UploadFiles.array('img'), AdController.addAd);
router.get('/ad/list', AdController.getAds);
router.get('/ad/:id', AdController.getAd);
router.post('/ad/:id', privateRouteJwt, UploadFiles.array('img'), AdController.editAd);
router.delete('/ad/:id', privateRouteJwt, AdController.delAd);

export default router;