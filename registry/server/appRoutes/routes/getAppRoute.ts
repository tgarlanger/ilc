import {
    Request,
    Response,
} from 'express';
import Joi from '@hapi/joi';

import db from '../../db';
import AppRoute from '../interfaces';
import validateRequest, {
    selectParamsToValidate,
} from '../../common/services/validateRequest';
import {
    prepareAppRoutesToRespond,
} from '../services/prepareAppRoute';

type GetAppRouteRequestParams = {
    id: string
};

const validateRequestBeforeGetAppRoute = validateRequest(new Map([
    [Joi.object({
        id: Joi.string().trim().required(),
    }), selectParamsToValidate],
]));

const getAppRoute = async (req: Request<GetAppRouteRequestParams>, res: Response): Promise<void> => {
    await validateRequestBeforeGetAppRoute(req, res);

    const {
        id: appRouteId,
    } = req.params;

    const appRoutes = await db
        .select('routes.id as routeId', '*')
        .from<AppRoute>('routes')
        .where('routeId', appRouteId)
        .join('route_slots', {
            'route_slots.routeId': 'routes.id'
        });
    const [appRoute] = prepareAppRoutesToRespond(appRoutes);

    res.status(200).send(appRoute);
};

export default getAppRoute;
