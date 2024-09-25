import { CreateStopBody } from "../../../../types";

export const createStop = async (body: CreateStopBody) => {
    return await fetch('/api/stops', { 
        method: 'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}
