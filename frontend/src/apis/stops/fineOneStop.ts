import { FindOneStopParams, Stop } from "../../../../types";
import { createUsableQuery } from "../utils/createUsableQuery";


export const findOneStop = async (params: FindOneStopParams): Promise<Stop> => {
    return (await (await fetch(`/api/stops/${params.stopId}`, { method: 'GET' })).json()).data
}

export const useFindOneStopQuery = createUsableQuery(findOneStop);
