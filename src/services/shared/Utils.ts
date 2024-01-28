import { APIGatewayProxyResult } from "aws-lambda";
import { JsonError } from "./Validator";
import { randomUUID } from "crypto";

export function createRandoId() {
    return randomUUID()
}

export function addCoresHeadher(arg: APIGatewayProxyResult) {
    if(!arg.headers) {
        arg.headers = {}
    }   
    arg.headers['Access-Control-Allow-Origin'] = '*';
    arg.headers['Access-Control-Allow-Methods'] = '*';
}

export function parseJSON(arg: string){
    try {
        return JSON.parse(arg);
    } catch (error) {
        throw new JsonError(error.message);
    }
}
