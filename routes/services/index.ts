import { Router } from 'express';
import { adminOrHigher } from '../mw';
import {
  deleteServiceBySpidCtrl,
  getServiceBySpidCtrl,
  getServicesCtrl,
  postServiceCtrl,
  putServiceBySpidCtrl,
} from './ctrl';

const servicesRouter = Router();

servicesRouter.use(adminOrHigher);

servicesRouter.get('/', getServicesCtrl);
servicesRouter.post('/', postServiceCtrl);
servicesRouter.get('/:spid', getServiceBySpidCtrl);
servicesRouter.put('/:spid', putServiceBySpidCtrl);
servicesRouter.delete('/:spid', deleteServiceBySpidCtrl);

export default servicesRouter;
