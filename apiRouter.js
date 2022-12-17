import Router from 'express';
import apiRequestController from './apiRequestController.js';

const apiRouter = Router();

apiRouter.post('/register', apiRequestController.register);
apiRouter.post('/auth', apiRequestController.auth);
apiRouter.get('/getUserById', apiRequestController.getUserById);
apiRouter.post('/getUserByToken', apiRequestController.getUserByToken);
apiRouter.post('/setDescription', apiRequestController.setDescription);
apiRouter.post('/setImageLink', apiRequestController.setImageLink);

apiRouter.post('/createTheme', apiRequestController.createTheme);
apiRouter.get('/getTheme', apiRequestController.getTheme);
apiRouter.get('/getThemes', apiRequestController.getThemes);
apiRouter.post('/editTheme', apiRequestController.editTheme);
apiRouter.post('/deleteTheme', apiRequestController.deleteTheme);

export default apiRouter;