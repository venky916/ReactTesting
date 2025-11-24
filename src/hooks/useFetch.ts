import { useEffect, useState } from "react"

interface UseFetchReturn<T> {
    data: T | null,
    loading: boolean,
    error: string | null,
    refetch: () => void
}

export function useFetch<T>(url: string): UseFetchReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [refetchIndex, setRefetchIndex] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const json = await response.json()
                setData(json)
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [url, refetchIndex])

    const refetch = () => {
        setRefetchIndex(prev => prev + 1)
    }

    return {
        data,
        loading,
        error,
        refetch
    }
}