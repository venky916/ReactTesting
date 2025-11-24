import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage Hook", () => {

    const localStorageMock = (() => {
        let store: Record<string, string> = {};

        return {
            getItem: (key: string) => store[key] || null,
            setItem: (key: string, value: string) => {
                store[key] = value
            },
            removeItem: (key: string) => {
                delete store[key]
            },
            clear: () => {
                store = {}
            }
        }
    })();

    beforeEach(() => {
        Object.defineProperty(window, "localStorage", {
            value: localStorageMock,
            writable: true
        });
        localStorageMock.clear()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    // TEST 1: Initialize with initial value
    it("should initialize with initial value", () => {
        const { result } = renderHook(() => useLocalStorage("testKey", "initial"))
        expect(result.current[0]).toBe("initial")
    })


    // TEST 2: Read from localStorage on mount
    it("should read from localStorage if value exists", () => {
        localStorageMock.setItem("testKey", JSON.stringify("stored value"))

        const { result } = renderHook(() => useLocalStorage("testKey", "initial"))
        expect(result.current[0]).toBe("stored value")
    })

    // TEST 3: Update localStorage when value changes
    it("should update localStorage when value changes", () => {
        const { result } = renderHook(() => useLocalStorage("testKey", "initial"))

        act(() => {
            result.current[1]("new value")
        })

        expect(result.current[0]).toBe("new value")
        expect(localStorage.getItem("testKey")).toBe(JSON.stringify("new value"))
    })

    // TEST 4: Handle objects
    it("should handle objects", () => {
        const initialObj = { name: "john", age: 30 }

        const { result } = renderHook(() => useLocalStorage("user", initialObj))

        const newObj = { name: "john", age: 25 }

        act(() => {
            result.current[1](newObj)
        })

        expect(result.current[0]).toEqual(newObj)

        expect(JSON.parse(localStorage.getItem("user")!)).toEqual(newObj)
    })


    // TEST 5: Handle arrays
    it("should handle arrays", () => {
        const initialArray = [1, 2, 3]
        const { result } = renderHook(() => useLocalStorage("numbers", initialArray))

        expect(result.current[0]).toEqual(initialArray)

        act(() => {
            result.current[1]([4, 5, 6])
        })

        expect(result.current[0]).toEqual([4, 5, 6])
    })

    // TEST 6: Handle numbers
    it("should handle numbers", () => {
        const { result } = renderHook(() => useLocalStorage("count", 0))

        act(() => {
            result.current[1](42)
        })
        expect(result.current[0]).toBe(42)

        expect(localStorage.getItem("count")).toBe("42")
    })

    // TEST 7: Handle booleans
    it("should handle boolean", () => {
        const { result } = renderHook(() => useLocalStorage("isActive", false))

        act(() => {
            result.current[1](true)
        })

        expect(result.current[0]).toBe(true)
        expect(localStorage.getItem("isActive")).toBe("true")
    })

    // TEST 8: Different keys don't interfere
    it("should handle multiple keys independently", () => {
        const { result: result1 } = renderHook(() => useLocalStorage("key1", "value1"))
        const { result: result2 } = renderHook(() => useLocalStorage("key2", "value2"))

        act(() => {
            result1.current[1]("updated1")
        })

        expect(result1.current[0]).toBe("updated1")
        expect(result2.current[0]).toBe("value2")
    })

    // TEST 9: Handle invalid JSON gracefully
    it("should use initial value if localStorage contains invalid json", () => {
        localStorageMock.setItem("badKey", "invalid jsonc{")

        const { result } = renderHook(() => useLocalStorage("badKey", "fallback"))

        expect(result.current[0]).toBe("fallback")
    })

    // TEST 10: Update multiple times
    it("should handle multiple updates", () => {
        const { result } = renderHook(() => useLocalStorage("counter", 0))

        act(() => {
            result.current[1](1)
        })
        expect(result.current[0]).toBe(1)
        act(() => {
            result.current[1](2)
        })
        expect(result.current[0]).toBe(2)
        act(() => {
            result.current[1](3)
        })
        expect(result.current[0]).toBe(3)

        expect(localStorage.getItem("counter")).toBe("3")
    })
})

// 🎓 TESTING HOOKS WITH SIDE EFFECTS:
//
// 1. Mock localStorage
//    - Create mock implementation
//    - Control storage behavior
//    - Test without real browser storage
//
// 2. Object.defineProperty()
//    - Mock global objects (window.localStorage)
//    - Make mocks available to hooks
//
// 3. Test data types
//    - Strings, numbers, booleans
//    - Objects, arrays
//    - Ensure JSON serialization works
//
// 4. Test error handling
//    - Invalid JSON
//    - Storage errors
//    - Graceful fallbacks
//
// 5. Test isolation
//    - Clear storage between tests
//    - Ensure tests don't interfere
//    - Use beforeEach/afterEach