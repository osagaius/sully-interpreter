import { FindManyStopsParams, Stop } from "../../../../types";
import { createUsableQuery } from "../utils/createUsableQuery";


export const findManyStops = async (query: FindManyStopsParams): Promise<Stop[]> => {
    const params = new URLSearchParams();
    if (query.shipmentId) {
        params.append('shipmentId', query.shipmentId.toString());
    }
    if (query.stopIds) {
        query.stopIds.map((stopId) => params.append('stopIds', stopId.toString()))
    }
    return (await (await fetch(`/api/stops?${params.toString()}`, { method: 'GET' })).json()).data
}

export const useFindManyStopsQuery = createUsableQuery(findManyStops);
