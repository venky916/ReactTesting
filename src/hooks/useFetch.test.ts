import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useFetch } from "./useFetch";

globalThis.fetch = vi.fn();

describe("useFetch Hook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    // TEST 1: Initial loading state
    it("should start with loading true", () => {
        vi.mocked(fetch).mockImplementation(() => new Promise(() => { }))

        const { result } = renderHook(() => useFetch("https://api.example.com/data"));
        expect(result.current.loading).toBe(true)
        expect(result.current.data).toBeNull()
        expect(result.current.error).toBeNull()
    })

    // TEST 2: Successful data fetch
    it("should fetch and return data successfully", async () => {
        const mockData = { id: 1, name: "Test User" };

        const mockResponse = {
            ok: true,
            status: 200,
            statusText: 'OK',
            json: async () => mockData,
        } as Response;

        vi.mocked(fetch).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useFetch("https://api.example.com/data"))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.data).toEqual(mockData)
        expect(result.current.error).toBeNull()
    })

    // TEST 3: Error handling
    it("should handle fetch errors", async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 404
        } as Response)

        const { result } = renderHook(() => useFetch('https://api.example.com/notfound'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.error).toBe("HTTP error! status: 404")
        expect(result.current.data).toBeNull()
    })

    // TEST 4: Network error
    it("should handle network errors", async () => {
        vi.mocked(fetch).mockRejectedValue(new Error("Network Error"))

        const { result } = renderHook(() => useFetch('https://api.example.com/data'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.error).toBe("Network Error")
        expect(result.current.data).toBeNull()
    })

    // TEST 5: Refetch functionality
    it("should refetch data when refetch is called", async () => {
        const mockData1 = { id: 1, name: "First" }
        const mockData2 = { id: 2, name: "Second" }

        vi.mocked(fetch)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockData1
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockData2
            } as Response)

        const { result } = renderHook(() => useFetch('https://api.example.com/data'))

        await waitFor(() => {
            expect(result.current.data).toEqual(mockData1)
        })

        result.current.refetch()

        await waitFor(() => {
            expect(result.current.data).toEqual(mockData2)
        })

        expect(fetch).toHaveBeenCalledTimes(2)
    })

    // TEST 6: URL change triggers new fetch
    it("should fetch new data when URL changes", async () => {
        const mockData1 = { id: 1 };
        const mockData2 = { id: 2 };

        vi.mocked(fetch)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockData1
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockData2
            } as Response)

        const { result, rerender } = renderHook(
            ({ url }) => useFetch(url),
            { initialProps: { url: "https://api.example.com/user/1" } }
        )

        await waitFor(() => {
            expect(result.current.data).toEqual(mockData1)
        })

        rerender({ url: "https://api.example.com/user/2" })

        await waitFor(() => {
            expect(result.current.data).toEqual(mockData2)
        })
        expect(fetch).toHaveBeenCalledTimes(2)
    })

    // TEST 7: Loading state during refetch
    it("should set loading to true during refetch", async () => {
        // vi.mocked(fetch).mockResolvedValue({
        //     ok: true,
        //     json: async () => ({ data: "test" })
        // } as Response)
        vi.mocked(fetch).mockImplementation(() =>
            new Promise(resolve =>
                setTimeout(() => resolve({
                    ok: true,
                    json: async () => ({ data: "test" })
                } as Response), 100) // Delay to keep loading true
            )
        )

        const { result } = renderHook(() => useFetch('https://api.example.com/data'))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        // result.current.refetch();
        await act(async () => {
            result.current.refetch();
        });

        expect(result.current.loading).toBe(true)

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })
    })

    // TEST 8: Clear error on successful refetch
    it("should clear error on successful refetch", async () => {
        vi.mocked(fetch)
            .mockRejectedValueOnce({
                ok: false,
                status: 500
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: "success" })
            } as Response)

        const { result } = renderHook(() => useFetch('https://api.example.com/data'));

        await waitFor(() => {
            expect(result.current.error).toBeTruthy()
        })

        result.current.refetch()

        await waitFor(() => {
            expect(result.current.error).toBeNull()
            expect(result.current.data).toEqual({ data: "success" })
        })
    })
})
// 🎓 ASYNC HOOK TESTING CONCEPTS:
//
// 1. Mock global fetch
//    - global.fetch = vi.fn()
//    - Mock different responses for different scenarios
//
// 2. waitFor() - Wait for async updates
//    - Essential for hooks with useEffect
//    - Waits until condition is true
//
// 3. mockResolvedValue() - Mock successful response
//    - Returns fake data
//    - Simulates successful API call
//
// 4. mockRejectedValue() - Mock error
//    - Throws error
//    - Simulates failed API call
//
// 5. mockResolvedValueOnce() - Sequential responses
//    - Different responses for each call
//    - Perfect for refetch testing
//
// 6. rerender() with props
//    - Pass initialProps
//    - Call rerender() with new props
//    - Tests prop changes (like URL change)