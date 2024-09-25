import { FindManyShipmentsQuery, Shipment } from "../../../../types";
import { createUsableQuery } from "../utils/createUsableQuery";

export const findManyShipments = async (query: FindManyShipmentsQuery): Promise<Shipment[]> => {
    const params = new URLSearchParams();
    query.shipmentIds?.map((shipmentId) => params.append('shipmentIds', shipmentId.toString()))
    return (await (await fetch(`/api/shipments?${params.toString()}`, { method: "GET" })).json()).data
}

export const useFindManyShipmentsQuery = createUsableQuery(findManyShipments);

