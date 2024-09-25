import { UpdateManyStopsBody } from "../../../../types";

export const updateManyStops = async (body: UpdateManyStopsBody) => {
    return await fetch('/api/stops', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}
