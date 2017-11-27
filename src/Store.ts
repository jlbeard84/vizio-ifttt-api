import * as fs from 'fs';

import { PairData } from "./models";

const storeFileName: string = "tvpair.json";
const defaultEncoding = "utf8";

export class Store {

    private pairData: PairData;

    constructor() {
        this.readFile().then(() => {
            console.log("Store created");
        });
     }

    public getPairData(): Promise<PairData> {
        
        const promise = new Promise<PairData>((resolve, reject) => {
            if (!this.pairData) {
                this.readFile().then(() => {
                    resolve(this.pairData);
                }, (err) => {
                    reject(err);
                });
            }
        });
        
        return promise;
    }

    public updatePairData(
        ip: string,
        token: string) {

        this.pairData.ip = ip;
        this.pairData.token = token;

        this.writeFile(this.pairData);
    }

    private writeFile(pairData: PairData): void {
        let jsonFile = JSON.stringify(pairData);
        
        fs.writeFileSync(
            storeFileName, 
            jsonFile, 
            defaultEncoding
        );
    }

    private generateDeviceId(): string {
        const id = `tv-${new Date().getTime()}`;
        return id;
    }

    private readFile(): Promise<{}> {

        const promise = new Promise((resolve, reject) => {
            
            fs.open(storeFileName, 'r', (err, fileData) => {

                if (err) {
                    if (err.code === 'ENOENT') {
                        this.pairData = new PairData();
                        resolve();
                    }
                }
                
                fs.readFile(fileData, defaultEncoding, (err, data) => {

                    if (err){
                        reject(err);
                    } else {
                        const parsedData = JSON.parse(data);
                        this.pairData = parsedData;
                        resolve();
                }});
            });
        });

        return promise;
    }
}