import moment from "moment";
import { parseBody } from "../utils/helpers.js";

export const log = (req, res, next) => {
    req.body = parseBody(req.body);
    console.log("\n\n<<<< Request Logs >>>>".cyan);
    console.log(moment().utcOffset("+0500").format("DD-MMM-YYYY hh:mm:ss a"));
    console.log("req.originalUrl: ", req.originalUrl);
    console.log('client ip: ', req.clientIp);
    console.log("req.body: ", JSON.stringify(req.body));
    next();
}