import { describe, it, expect } from "vitest";
import { add, multiply, divide, remainder, percentage, clamp, average } from "./math"


describe('Math utilities', () => {

    describe("add", () => {
        it("should add two positive numbers", () => {
            expect(add(2, 3)).toBe(5)
        })
        it("should add negative numbers", () => {
            expect(add(-1, 1)).toBe(0);
            expect(add(-5, 3)).toBe(-2)
        })

        it("should handle zero", () => {
            expect(add(5, 0)).toBe(5);
            expect(add(0, 0)).toBe(0)
        })

        it("should handle decimals", () => {
            expect(add(1.5, 2.3)).toBeCloseTo(3.8)
        })
    })

    describe("multiply", () => {
        it("should multiply two numbers", () => {
            expect(multiply(2, 3)).toBe(6)
            expect(multiply(5, 4)).toBe(20)
        })

        it("should return zero when multiply by zero", () => {
            expect(multiply(5, 0)).toBe(0)
            expect(multiply(0, 10)).toBe(0)
        })

        it("should handle negative numbers", () => {
            expect(multiply(-2, 3)).toBe(-6)
            expect(multiply(-2, -3)).toBe(6)
        })


    })

    describe("divide", () => {
        it("should divide two numbers", () => {
            expect(divide(10, 2)).toBe(5);
            expect(divide(9, 3)).toBe(3)
        })

        it("should throw error when dividing by zero", () => {
            expect(() => divide(5, 0)).toThrow("Cannot divide by zero")
        })

        it("should throw error with exact message", () => {
            expect(() => divide(10, 0)).toThrow("Cannot divide by zero")
        })

        it("should handle negative division", () => {
            expect(divide(-10, 2)).toBe(-5)
            expect(divide(10, -2)).toBe(-5)
        })
    })

    describe("remainder (mod)",()=>{
        it("should return remainder for positive numbers",()=>{
            expect(remainder(10,3)).toBe(1);
            expect(remainder(20,6)).toBe(2)
        })

        it("should follow Javascript % behavior with negatives",()=>{
            expect(remainder(-10,3)).toBe(-1);
            expect(remainder(10,-3)).toBe(1);
            expect(remainder(-10,-3)).toBe(-1)
        })  

        it("should throw error when divisor is zero",()=>{
            expect(()=>remainder(5,0)).toThrow("Cannot divide by zero")
        })

    })

    describe("percentage", () => {
        it("should calculate percentage correctly", () => {
            expect(percentage(25, 100)).toBe(25);
            expect(percentage(50, 200)).toBe(25)
        })

        it("should handle decimal results", () => {
            expect(percentage(1, 3)).toBeCloseTo(33.33, 2)
        })

        it("should throw error when total is zero", () => {
            expect(() => percentage(5, 0)).toThrow("Total cannot be zero")
        })

        it("should handle 100% case", () => {
            expect(percentage(100, 100)).toBe(100)
        })
    })

    describe("clamp", () => {
        it("should return value when within range", () => {
            expect(clamp(5, 0, 10)).toBe(5)
            expect(clamp(7, 5, 10)).toBe(7)
        })
        it("should return min when value is below range", () => {
            expect(clamp(-5, 0, 10)).toBe(0)
            expect(clamp(2, 5, 10)).toBe(5)
        })

        it("should return max value when above the range", () => {
            expect(clamp(15, 0, 10)).toBe(10)
            expect(clamp(100, 0, 10)).toBe(10)
        })

        it("should handle boundary values", () => {
            expect(clamp(0, 0, 10)).toBe(0)
            expect(clamp(10, 0, 10)).toBe(10)
        })

        it("should work with negative ranges", () => {
            expect(clamp(-5, -10, -1)).toBe(-5)
            expect(clamp(-15, -10, -1)).toBe(-10)
        })

    })

    describe("average", () => {

        it("should calculate average of numbers", () => {
            expect(average([1, 2, 3, 4, 5])).toBe(3);
            expect(average([10, 20, 30])).toBe(20)
        })

        it("should handle single number", () => {
            expect(average([5])).toBe(5)
        })

        it("should throw error for empty array", () => {
            expect(() => average([])).toThrow("Array cannot be empty")
        })

        it("should handle negative numbers", () => {
            expect(average([-1, -2, -3])).toBe(-2)
            expect(average([-5, 5])).toBe(0)
        })

        it("should handle decimals", () => {
            expect(average([1.5, 2.5, 3.5])).toBeCloseTo(2.5)
        })

        it("should handle large arrays", () => {
            const largeArray = Array.from({ length: 1000 }, (_, i) => i + 1)
            expect(average(largeArray)).toBe(500.5)
        })
    })

})
// JavaScript uses remainder operator(%):

// Result has the same sign as the dividend(left operand)

// Python uses true modulo operator(%):

// Result has the same sign as the divisor(right operand)

// For positive divisor, result is always non - negative
// JavaScript: dividend % divisor = remainder

// Python: dividend % divisor = dividend - divisor * floor(dividend / divisor)



// 🎓 KEY TESTING CONCEPTS FOR UTILITIES:
//
// 1. toBe() - For exact equality (primitives)
//    - Numbers, strings, booleans
//
// 2. toBeCloseTo() - For floating point numbers
//    - Handles JavaScript decimal precision issues
//    - toBeCloseTo(3.8, 1) means "close to 3.8 with 1 decimal"
//
// 3. toThrow() - For testing errors
//    - Wrap function in arrow function: () => divide(5, 0)
//    - Can check exact error message
//
// 4. Test Categories:
//    - Happy path (normal cases)
//    - Edge cases (boundaries, limits)
//    - Error cases (invalid inputs)
//    - Negative cases (negative numbers, empty arrays)
//
// 5. Organize with describe() blocks:
//    - One describe per function
//    - Groups related tests together
//    - Makes test output readable