import * as fs from 'fs';

import { PairData } from "./models";

const storeFileName: string = "tvpair.json";
const defaultEncoding = "utf8";

export class Store {

    private pairData: PairData;

    constructor() {
        this.readFile();
     }

    public getPairData(): PairData {
        
        if (!this.pairData) {
            this.readFile();
        }

        return this.pairData;
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

    private readFile(): void {
        fs.open(storeFileName, 'r', (err, fileData) => {

            if (err) {
                if (err.code === 'ENOENT') {
                    this.pairData = new PairData();
                    return;
                }
            }
            
            fs.readFile(fileData, defaultEncoding, (err, data) => {

                if (err){
                    console.log(err);
                } else {

                    let parsedData = JSON.parse(data);
                    this.pairData = parsedData;
            }});
        });
    }
}