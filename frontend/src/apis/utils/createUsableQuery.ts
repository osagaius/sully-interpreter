import { useEffect, useState } from "react";

export const createUsableQuery = <Args extends unknown[], Response>(fetchFunction: (...args: Args) => Promise<Response>) => (...args: Args) => {
    const [data, setData] = useState<Response>();

    // Note that useEffect isn't really practical for real applications
    // and a custom hook utilizing refs would be better.
    useEffect(() => {
        fetchFunction(...args).then((data) => setData(data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const refetch = () => {
        fetchFunction(...args).then((data) => setData(data))
    }

    return { data, refetch };
}
