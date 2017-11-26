import { Router, Request, Response, NextFunction, json } from 'express';
import * as BodyParser from "body-parser";
import * as smartcast from "vizio-smart-cast";

import { Pair, PairRequest } from '../models';
import Globals from "../globals";
import { currentId } from 'async_hooks';

export class PairRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public init(): void {
        this.router.post("/init", this.initPair);
        this.router.post("/complete", this.pair);
    }

    public initPair(
        request: Request,
        response: Response,
        next: NextFunction): void {

        let pairRequest = request.body as PairRequest;

        if (!pairRequest) {
            response.sendStatus(400);
        }

        const vizioCast = new smartcast(pairRequest.ip) as any;

        vizioCast.pairing.initiate().then((pairResponse) => {
            Globals.store.updatePairData(pairRequest.ip, "");
            
            console.log(pairResponse);
            response.send(pairResponse);
        });
    }

    public pair(
        request: Request,
        response: Response,
        next: NextFunction): void {

        let pair = request.body as Pair;

        if (!pair) {
            response.sendStatus(400);
        }

        const currentIP = Globals.store.getPairData().ip;
        const vizioCast = new smartcast(currentIP);

        console.log(currentIP);

        vizioCast.pairing.pair(pair.pin).then((pairResponse: any) => {
            
            Globals.store.updatePairData(
                currentIP,
                pairResponse.ITEM.AUTH_TOKEN);

            response.send(Globals.store.getPairData());
        }, (reason: any) => {
            console.log(reason);
            console.log(pair);
            response.sendStatus(500);
        });
    }
}

const pairRoutes: PairRouter = new PairRouter();
pairRoutes.init();

export default pairRoutes.router;