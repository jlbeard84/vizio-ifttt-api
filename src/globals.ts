import { Store } from "./Store";
import * as smartcast from "vizio-smart-cast";
import { PairData } from "./models/pair-data.model";

const store = new Store();

const Globals = {
    "store": store,
    "tv": null
};

const pairData = store.getPairData().then((pairData: PairData) => {
    let tv = null;
    
    if (pairData && pairData.ip && pairData.token) {
        tv = new smartcast(pairData.ip, pairData.token);
    }   

    Globals.tv = tv;
});

export default Globals;
