import { Router, Request, Response, NextFunction, json } from 'express';
import * as BodyParser from "body-parser";
import * as smartcast from "vizio-smart-cast";

import { PairRequest } from '../models';
import Globals from "../globals";

export class PowerRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public init(): void {
        this.router.post("/on", this.powerOn);
        this.router.post("/off", this.powerOff);
    }

    public powerOn(        
        request: Request,
        response: Response,
        next: NextFunction): void {

        if(!Globals.tv) {
            response.sendStatus(500);
        }

        Globals.tv.control.power.on().then(() => {
            response.sendStatus(200);
        }, (err) => {
            response.sendStatus(500);
        });
    }

    public powerOff(        
        request: Request,
        response: Response,
        next: NextFunction): void {

        if(!Globals.tv) {
            response.sendStatus(500);
        }

        Globals.tv.control.power.off().then(() => {
            response.sendStatus(200);
        }, (err) => {
            response.sendStatus(500);
        });
    }
}

const powerRoutes: PowerRouter = new PowerRouter();
powerRoutes.init();

export default powerRoutes.router;