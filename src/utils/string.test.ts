import { describe, it, expect } from "vitest";
import { capitalize, truncate, slugify, isEmail, countWords, reverseString } from "./string";

describe("String Utilities", () => {
    describe("capitalize", () => {
        it("should capitalize first letter", () => {
            expect(capitalize("hello")).toBe("Hello");
            expect(capitalize("world")).toBe("World")
        })

        it("should lowercase rest of the string", () => {
            expect(capitalize("HELLO")).toBe("Hello");
            expect(capitalize("hELLO")).toBe("Hello")
        })

        it("should handle empty string", () => {
            expect(capitalize("")).toBe("")
        })

        it("should handle empty string", () => {
            expect(capitalize("")).toBe("")
        })

        it("should handle single character", () => {
            expect(capitalize("a")).toBe("A")
        })

        it("should handle string with spaces", () => {
            expect(capitalize("hello world")).toBe("Hello world")
        })
    })

    describe("truncate", () => {

        it("should truncate long strings", () => {
            expect(truncate("Hello World", 5)).toBe("Hello...");
            expect(truncate("This is a long string", 10)).toBe("This is a ...")
        })

        it("should not truncate short strings", () => {
            expect(truncate("hello", 10)).toBe("hello")
            expect(truncate("Hi", 5)).toBe("Hi")
        })

        it("should handle exact length", () => {
            expect(truncate("Hello", 5)).toBe("Hello")
        })

        it("should handle empty string", () => {
            expect(truncate("", 5)).toBe("")
        })

        it("should handle zero maxLength", () => {
            expect(truncate("Hello", 0)).toBe("...")
        })
    })

    describe('slugify', () => {
        it("should convert to lowercase and replace spaces with hyphens", () => {
            expect(slugify("Hello World")).toBe("hello-world");
            expect(slugify("My Blog Post")).toBe("my-blog-post")
        })

        it("should remove special characters", () => {
            expect(slugify("Hello! World?")).toBe("hello-world");
            expect(slugify("Test@#$%")).toBe("test")
        })

        it("should handle multiple spaces", () => {
            expect(slugify("Hello    World")).toBe("hello-world")
        })

        it("should trim leading/trailing hyphens", () => {
            expect(slugify(" Hello World ")).toBe("hello-world")
            expect(slugify("---Hello---")).toBe("hello")
        })

        it("should handle underscores", () => {
            expect(slugify("hello_world")).toBe("hello-world")
        })

        it("should handle empty string", () => {
            expect(slugify("")).toBe("")
        })
    })

    describe("isEmail", () => {
        it("should return true for valid emails", () => {
            expect(isEmail("test@example.com")).toBe(true);
            expect(isEmail("user.name@domain.co.uk")).toBe(true)
            expect(isEmail("test+tag@email.com")).toBe(true)
        })

        it("should return false for invalid email", () => {
            expect(isEmail("invalid")).toBe(false)
            expect(isEmail("test@")).toBe(false)
            expect(isEmail("@example.com")).toBe(false)
            expect(isEmail('test @example.com')).toBe(false)
        })

        it("should return false for empty string", () => {
            expect(isEmail("")).toBe(false)
        })

        it("should return false for emails without domain extensions", () => {
            expect(isEmail("test@example")).toBe(false)
        })
    })

    describe("countWords", () => {
        it("should count words correctly", () => {
            expect(countWords("Hello World")).toBe(2)
            expect(countWords("One Two Three Four")).toBe(4)
        })

        it("should handle single word", () => {
            expect(countWords("Hello")).toBe(1)
        })

        it("should handle empty string", () => {
            expect(countWords("")).toBe(0)
            expect(countWords("    ")).toBe(0)
        })

        it("should handle multiple spaces", () => {
            expect(countWords('Hello    World')).toBe(2)
        })

        it("should trim leading/trailing spaces", () => {
            expect(countWords("    Hello World   ")).toBe(2)
        })
    })

    describe("reverseString", () => {
        it("should reverse string", () => {
            expect(reverseString("Hello")).toBe("olleH")
            expect(reverseString("World")).toBe("dlroW")
        })

        it("should handle palindromes", () => {
            expect(reverseString("racecar")).toBe("racecar")
        })

        it("should handle empty string", () => {
            expect(reverseString("")).toBe("")
        })

        it("should handle single character", () => {
            expect(reverseString("a")).toBe("a")
        })

        it("should handle strings with spaces", () => {
            expect(reverseString("Hello World")).toBe("dlroW olleH")
        })
    })
})

// 🎓 STRING TESTING BEST PRACTICES:
//
// 1. Test both valid and invalid inputs
// 2. Test empty strings
// 3. Test edge cases (single char, very long strings)
// 4. Test special characters
// 5. Test whitespace handling
// 6. Use descriptive test names