import { describe, it, expect } from "vitest"
import { unique, groupBy, chunk, sortBy, findDuplicates } from "./array"

describe("Array Utilities", () => {

    describe("unique", () => {
        it("should remove duplicate numbers", () => {
            expect(unique([1, 2, 2, 3, 3, 3, 4])).toEqual([1, 2, 3, 4])
        })

        it("should remove duplicate strings", () => {
            expect(unique(["a", "b", "c", "b"])).toEqual(["a", "b", "c"])
        })

        it("should handle empty array", () => {
            expect(unique([])).toEqual([])
        })

        it("should handle array with no duplicates", () => {
            expect(unique([1, 2, 3])).toEqual([1, 2, 3])
        })

        it("should preserve order of first occurrence", () => {
            expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2])
        })
    })

    describe("groupBy", () => {

        it("should group objects by key", () => {

            const users = [
                { name: "John", role: "admin" },
                { name: "Jane", role: "user" },
                { name: "Bob", role: "admin" },
            ]

            const result = groupBy(users, "role")

            expect(result).toEqual({
                admin: [
                    { name: "John", role: "admin" },
                    { name: "Bob", role: "admin" }
                ],
                user: [{ name: "Jane", role: "user" },]
            })
        })

        it("should handle empty array", () => {
            expect(groupBy([], "key")).toEqual({})
        })

        it("should group by numeric values", () => {
            const items = [
                { id: 1, value: 10 },
                { id: 2, value: 10 },
                { id: 3, value: 20 },
            ]

            const result = groupBy(items, "value")

            expect(result["10"]).toHaveLength(2)
            expect(result["20"]).toHaveLength(1)
        })
    })

    describe("chunk", () => {
        it("should split array into chunks", () => {
            expect(chunk([1, 2, 3, 4, 5, 6], 2)).toEqual([
                [1, 2],
                [3, 4],
                [5, 6],
            ])
        })

        it("should handle uneven chunks", () => {
            expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([
                [1, 2],
                [3, 4],
                [5],
            ])
        })

        it("should handle chunk size larger than array", () => {
            expect(chunk([1, 2, 3], 10)).toEqual([[1, 2, 3]])
        })

        it("should handle empty array", () => {
            expect(chunk([], 2)).toEqual([])
        })

        it("should throw error for invalid chunk size", () => {
            expect(() => chunk([1, 2, 3], 0)).toThrow("Chunk size must be greater than 0")
            expect(() => chunk([1, 2, 3], -1)).toThrow("Chunk size must be greater than 0")
        })

        it("should handle chunk size of 1", () => {
            expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]])
        })
    })

    describe("sortBy", () => {
        const users = [
            { name: "Charlie", age: 30 },
            { name: "Alice", age: 25 },
            { name: "Bob", age: 35 },
        ]

        it("should sort by key in ascending order", () => {
            const result = sortBy(users, "age", "asc")

            expect(result[0].age).toBe(25)
            expect(result[1].age).toBe(30)
            expect(result[2].age).toBe(35)
        })


        it("should sort by key in descending order", () => {
            const result = sortBy(users, "age", "desc")

            expect(result[0].age).toBe(35);
            expect(result[1].age).toBe(30)
            expect(result[2].age).toBe(25)
        })

        it("should sort strings alphabetically", () => {
            const result = sortBy(users, "name", "asc")

            expect(result[0].name).toBe("Alice")
            expect(result[1].name).toBe("Bob")
            expect(result[2].name).toBe("Charlie")
        })

        it("should not mutate original array", () => {
            const original = [...users]
            sortBy(users, "age", "asc")

            expect(users).toEqual(original)
        })

        it("should be default to ascending order", () => {
            const result = sortBy(users, "age")

            expect(result[0].age).toBe(25)
        })
    })

    describe("findDuplicates", () => {
        it("should find duplicate numbers", () => {
            expect(findDuplicates([1, 2, 2, 3, 3, 4])).toEqual([2, 3])
        })

        it("should find duplicate string", () => {
            expect(findDuplicates(["a", "b", "b", "c", "c"])).toEqual(["b", "c"])
        })

        it("should return empty array when no duplicates", () => {
            expect(findDuplicates([1, 2, 3, 4])).toEqual([])
        })

        it("should handle empty array", () => {
            expect(findDuplicates([])).toEqual([])
        })

        it("should handle multiple occurrences", () => {
            expect(findDuplicates([1, 1, 1, 2, 2, 2])).toEqual([1, 2])
        })
    })

})

// 🎓 ARRAY/OBJECT TESTING CONCEPTS:
//
// 1. toEqual() vs toBe()
//    - toBe() - For primitives (same reference)
//    - toEqual() - For objects/arrays (deep equality)
//
// 2. Test immutability
//    - Ensure original array isn't modified
//    - Store original, then compare after function call
//
// 3. Test with different data types
//    - Numbers, strings, objects
//    - Ensures generic functions work correctly
//
// 4. Test edge cases
//    - Empty arrays
//    - Single item arrays
//    - Very large arrays
//
// 5. Test error cases
//    - Invalid inputs
//    - Boundary conditions