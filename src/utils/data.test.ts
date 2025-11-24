import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate, isWeekend, addDays, daysBetween, getRelativeTime } from "./date";


describe("Date Utilities", () => {

    describe("formatDate", () => {

        it("should format date as YYYY-MM-DD", () => {
            const date = new Date("2024-01-15");
            expect(formatDate(date)).toBe("2024-01-15")
        })

        it("should pad single digit months and days", () => {
            const date = new Date("2024-03-05");
            expect(formatDate(date)).toBe("2024-03-05")
        })

        it("should handle different years", () => {
            const date1 = new Date("2023-12-31");
            const date2 = new Date("2025-01-01");

            expect(formatDate(date1)).toBe("2023-12-31");
            expect(formatDate(date2)).toBe("2025-01-01")
        })

        it("should format today's date", () => {
            const today = new Date();
            const formatted = formatDate(today);

            // Extract year, month, day from formatted string
            expect(formatted).toMatch(/\d{4}-\d{2}-\d{2}/); // Regex pattern
        })


    })

    describe("isWeekend", () => {

        it("should return true for Saturday", () => {
            const saturday = new Date("2024-01-13");
            expect(isWeekend(saturday)).toBe(true)
        })

        it("should return true for Sunday", () => {
            const sunday = new Date("2024-01-14");
            expect(isWeekend(sunday)).toBe(true)
        })

        it("should return false for weekdays", () => {
            const monday = new Date("2024-01-15");
            const friday = new Date("2024-101-19")
            expect(isWeekend(monday)).toBe(false)
            expect(isWeekend(friday)).toBe(false)
        })
    })

    describe("addDays", () => {

        it("should add days to a date", () => {
            const date = new Date("2024-01-15")
            const result = addDays(date, 5)

            expect(formatDate(result)).toBe("2024-01-20")
        })

        it("should handle adding zero days", () => {
            const date = new Date("2024-01-15");
            const result = addDays(date, 0);

            expect(formatDate(result)).toBe("2024-01-15")
        })

        it("should handle negative days (subtract)", () => {
            const date = new Date("2024-01-15");
            const result = addDays(date, -5);

            expect(formatDate(result)).toBe("2024-01-10")
        })

        it("should handle month boundaries", () => {
            const date = new Date("2024-01-30");
            const result = addDays(date, 5);

            expect(formatDate(result)).toBe("2024-02-04")
        })

        it("should not mutate original date", () => {
            const original = new Date("2024-01-15");
            const originalTime = original.getTime();

            addDays(original, 5)

            expect(original.getTime()).toBe(originalTime)
        })
    })

    describe("daysBetween", () => {

        it("should calculate days between two dates", () => {
            const date1 = new Date("2024-01-01");
            const date2 = new Date("2024-01-10");

            expect(daysBetween(date1, date2)).toBe(9)
        })

        it("should work regardless of order", () => {
            const date1 = new Date("2024-01-10");
            const date2 = new Date("2024-01-01");

            expect(daysBetween(date1, date2)).toBe(9)
        })

        it("should return 0 for same dates", () => {
            const date = new Date("2024-01-15");

            expect(daysBetween(date, date)).toBe(0)
        })

        it("should handle dates across years", () => {
            const date1 = new Date("2023-12-25");
            const date2 = new Date("2024-01-05");

            expect(daysBetween(date1, date2)).toBe(11)
        })
    })

    // TESTING TIME-DEPENDENT FUNCTIONS
    describe("getRelativeTime", () => {
        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date("2024-01-15T12:00:00"))
        })

        afterEach(() => {
            vi.useRealTimers()
        })

        it("should return 'just now' for very recent dates", () => {
            const date = new Date("2024-01-15T11:59:30");
            expect(getRelativeTime(date)).toBe("just now")
        })

        it("should return minutes ago", () => {
            const date = new Date("2024-01-15T11:45:00");
            expect(getRelativeTime(date)).toBe("15 minutes ago")
        })

        it("should return hours ago", () => {
            const date = new Date("2024-01-15T09:00:00");
            expect(getRelativeTime(date)).toBe("3 hours ago")
        })

        it("should return 'yesterday' for yesterday", () => {
            const date = new Date("2024-01-14T12:00:00");
            expect(getRelativeTime(date)).toBe("yesterday")
        })

        it("should return days ago for older dates", () => {
            const date = new Date("2024-01-10T12:00:00")
            expect(getRelativeTime(date)).toBe("5 days ago")
        })
    })
})

// 🎓 DATE TESTING CONCEPTS:
//
// 1. Use specific dates in tests (not new Date())
//    - Makes tests predictable
//    - Prevents timezone issues
//
// 2. vi.useFakeTimers() - Mock time
//    - Control "current time" in tests
//    - Test time-dependent functions
//    - Always restore with vi.useRealTimers()
//
// 3. Test immutability
//    - Ensure functions don't mutate input dates
//    - Compare before/after values
//
// 4. Test edge cases:
//    - Month boundaries
//    - Year boundaries
//    - Leap years
//    - Timezones (if applicable)
//
// 5. beforeEach/afterEach:
//    - Setup fake timers before each test
//    - Cleanup after each test
//    - Keeps tests independent