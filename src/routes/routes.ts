import { Router, Request, Response } from 'express';

import * as AuthController from '../controllers/AuthController';
import * as UserController from '../controllers/UserController';
import * as AdsController from '../controllers/AdsController';

import { privateRouteJwt } from '../middlewares/AuthPassport';
import { AuthValidator } from '../validators/AuthValidator';
import { UserValidator } from '../validators/UserValidator';
import { UploadFiles } from '../services/AdsService';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
    res.json({ pong: true });
});

router.get('/states', UserController.getStates);

router.post('/user/signin', AuthValidator.signin, AuthController.signin);
router.post('/user/signup', AuthValidator.signup, AuthController.signup);

router.get('/user/me', privateRouteJwt, UserController.info);
router.put('/user/me', privateRouteJwt, UserValidator.editAction, UserController.editAction);

router.get('/categories', AdsController.getCategories);

router.post('/ads/add', privateRouteJwt, UploadFiles.array('photos'), AdsController.addAction);
router.get('/ads/list', AdsController.getList);
router.get('/ads/item', AdsController.getItem);
router.post('/ads/:id', privateRouteJwt, AdsController.editAction);

export default router;