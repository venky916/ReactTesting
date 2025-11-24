import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";


describe("UseCounter Hook", () => {

    // TEST 1: Does it initialize with default value?
    it("should initialize with default value of 0", () => {
        const { result } = renderHook(() => useCounter())
        expect(result.current.count).toBe(0)
    })

    // TEST 2: Does it initialize with custom value?
    it("should initialize with provided initial value", () => {
        const { result } = renderHook(() => useCounter(10))
        expect(result.current.count).toBe(10)
    })

    // TEST 3: Does increment work?
    it("should increment count", () => {
        const { result } = renderHook(() => useCounter(5))
        act(() => {
            result.current.increment();
        })

        expect(result.current.count).toBe(6)
    })

    // TEST 5: Does reset work?
    it("should reset count to initial value", () => {
        const { result } = renderHook(() => useCounter(10))

        act(() => {
            result.current.increment();
            result.current.increment()
        })

        expect(result.current.count).toBe(12)

        act(() => {
            result.current.reset()
        })

        expect(result.current.count).toBe(10)
    })

    // TEST 6: Does setCount work?
    it("should set count to specific value", () => {
        const { result } = renderHook(() => useCounter())

        act(() => {
            result.current.setCount(50)
        })

        expect(result.current.count).toBe(50)
    })

    // TEST 7: Multiple operations
    it("should handle multiple operations correctly", () => {
        const { result } = renderHook(() => useCounter(0))

        act(() => {
            result.current.increment();
            result.current.increment();
            result.current.increment();
            result.current.decrement();
        })

        expect(result.current.count).toBe(2)
    })

    // TEST 8: Can we batch operations?
    it("should handle batched operations", () => {
        const { result } = renderHook(() => useCounter(0))

        act(() => {
            result.current.increment()
            result.current.increment()
            result.current.setCount(100)
            result.current.decrement()
        })

        expect(result.current.count).toBe(99)
    })

    // TEST 9: Negative numbers
    it("should handle negative numbers", () => {
        const { result } = renderHook(() => useCounter(-5))

        expect(result.current.count).toBe(-5)

        act(() => {
            result.current.increment()
        })

        expect(result.current.count).toBe(-4)
    })
})

// 🎓 NEW HOOK TESTING CONCEPTS:
//
// 1. renderHook() - Renders a hook in a test environment
//    - Returns { result } object
//    - result.current contains hook's return value
//
// 2. act() - Wrap state updates
//    - Ensures React processes updates
//    - Required for any state changes
//    - Can batch multiple operations
//
// 3. result.current - Access hook's current state
//    - Gets updated after each act()
//    - Contains all return values from hook
//
// 4. Testing pattern:
//    const { result } = renderHook(() => useYourHook())
//    act(() => { result.current.someFunction() })
//    expect(result.current.someValue).toBe(expected)