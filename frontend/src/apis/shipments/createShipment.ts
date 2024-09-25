import { CreateShipmentBody } from "../../../../types";

export const createShipment = async (body: CreateShipmentBody) => {
    return await fetch('/api/shipments', { 
        method: 'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}
