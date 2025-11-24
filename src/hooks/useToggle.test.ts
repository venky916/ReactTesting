import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToggle } from "./useToggle";


describe("useToggle Hook", () => {

    it("should initialize with false by default", () => {
        const { result } = renderHook(() => useToggle())

        expect(result.current.value).toBe(false)
    })

    it("should initialize with provided value", () => {
        const { result } = renderHook(() => useToggle(true))

        expect(result.current.value).toBe(true)
    })

    it("should toggle from false to true", () => {
        const { result } = renderHook(() => useToggle(false))

        act(() => {
            result.current.toggle()
        })

        expect(result.current.value).toBe(true)
    })

    it("should toggle from true to false", () => {
        const { result } = renderHook(() => useToggle(true))
        act(() => {
            result.current.toggle()
        })
        expect(result.current.value).toBe(false)
    })

    it("should toggle multiple times", () => {
        const { result } = renderHook(() => useToggle(false))

        act(() => {
            result.current.toggle();
            result.current.toggle()
            result.current.toggle()
        })

        expect(result.current.value).toBe(true)
    })

    it("should set to true", () => {
        const { result } = renderHook(() => useToggle(false))

        act(() => {
            result.current.setFalse()
        })

        expect(result.current.value).toBe(false)
    })

    it("should set value directly", () => {
        const { result } = renderHook(() => useToggle())

        act(() => {
            result.current.setValue(true)
        })

        expect(result.current.value).toBe(true)

        act(() => {
            result.current.setValue(false)
        })

        expect(result.current.value).toBe(false)
    })

    it("should maintain idempotency", () => {
        const { result } = renderHook(() => useToggle(false))
        act(() => {
            result.current.setTrue()
            result.current.setTrue()
            result.current.setTrue()
        })

        expect(result.current.value).toBe(true)
    })
})

// 🎓 TESTING BOOLEAN HOOKS:
// - Test default state
// - Test toggling back and forth
// - Test idempotency (calling setTrue multiple times)
// - Test all exposed functions