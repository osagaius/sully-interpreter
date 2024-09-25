import { UpdateShipmentBody } from "../../../../types";

export const updateShipment = async (shipmentId: number | string, body: UpdateShipmentBody) => {
    return await fetch(`/api/shipments/${shipmentId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });
};
