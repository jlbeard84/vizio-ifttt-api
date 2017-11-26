import { Router, Request, Response, NextFunction } from 'express';
import * as smartcast from "vizio-smart-cast";

export class DiscoverRouter {

    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public init(): void {
        this.router.get("/", this.getAll);
    }

    public getAll(
        request: Request,
        response: Response,
        next: NextFunction): void {

        smartcast.discover((device) => {
            response.send(device);
        });
    }
}

const discoverRoutes: DiscoverRouter = new DiscoverRouter();
discoverRoutes.init();

export default discoverRoutes.router;