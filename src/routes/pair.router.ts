import { Router, Request, Response, NextFunction, json } from 'express';
import * as BodyParser from "body-parser";
import * as smartcast from "vizio-smart-cast";

import { Pair, PairRequest } from '../models';
import Globals from "../globals";
import { PairData } from '../models/pair-data.model';

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

        const pairRequest = request.body as PairRequest;

        if (!pairRequest) {
            response.sendStatus(400);
        }

        const vizioCast = new smartcast(pairRequest.ip) as any;
        Globals.tv = vizioCast;

        //TODO: handle error
        Globals.tv.pairing.initiate().then((pairResponse) => {
            Globals.store.updatePairData(pairRequest.ip, "");
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

        if (!Globals.tv) {
            response.sendStatus(500);
        }

        const currentIP = Globals.store.getPairData().then((pairData: PairData) => {

            Globals.tv.pairing.pair(pair.pin).then((pairResponse: any) => {
                
                Globals.store.updatePairData(
                    pairData.ip,
                    pairResponse.ITEM.AUTH_TOKEN);
    
                Globals.tv = new smartcast(pairData.ip, pairResponse.ITEM.AUTH_TOKEN);
    
                response.send(Globals.store.getPairData());
            }, (reason: any) => {
                console.log(reason);
                console.log(pair);
                response.sendStatus(500);
            });
        });
    }
}

const pairRoutes: PairRouter = new PairRouter();
pairRoutes.init();

export default pairRoutes.router;