import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

describe("LoginForm Component", () => {
  // TEST 1: Does the form render all elements?
  it("should render email input, password input, and submit button", () => {
    render(<LoginForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  // TEST 2: Can user type in email field?
  it("should allow user to type in the email field", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={() => {}} />);
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "test@example.com");
    expect(emailInput).toHaveValue("test@example.com");
  });

  // TEST 3: Can user type in password field?
  it("should allow user to type in password field", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={() => {}} />);
    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, "mypassword123");

    expect(passwordInput).toHaveValue("mypassword123");
  });

  // TEST 4: Does it submit with valid data?
  it("should call onSubmit with email and password when form is valid", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      "test@example.com",
      "password123"
    );
  });

  // TEST 5: Does it show error when email is empty?
  it("should show error when email is empty", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  // TEST 6: Does it show error when email is invalid?
  it("should show error when email is invalid", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "invalid-email@gmail");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  // TEST 7: Does it show error when password is empty?
  it("should show error when password is empty", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  // TEST 8: Does it show error when password is too short?
  it("should show error when password is less than 6 characters", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "12345");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(
      screen.getByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  // TEST 9: Does it clear form after successful submission?
  it("should clear form after successful submission", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "text@example.com");
    await user.type(passwordInput, "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });

  // TEST 10: Does it show multiple errors at once?
  it("should show multiple errors when both fields are invalid", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});


// 🎓 NEW CONCEPTS LEARNED:
//
// 1. Testing Forms:
//    - getByLabelText() - Best way to find form inputs
//    - user.type() - Simulates typing in an input
//    - toHaveValue() - Checks input value
//
// 2. Testing Validation:
//    - Test both valid and invalid scenarios
//    - Check error messages appear
//    - Verify onSubmit is NOT called when invalid
//
// 3. Testing Error Messages:
//    - role="alert" makes error messages testable
//    - Use getByRole('alert') to find error messages
//
// 4. Form Submission:
//    - user.click() on submit button
//    - OR user.keyboard('{Enter}') to submit
//    - Check if callback was called with correct data
//
// 5. Regex in queries:
//    - /email/i - case insensitive search
//    - Useful when exact text might vary

//
// 1. ❌ expect(element) without assertion
//    ✅ expect(element).toBeInTheDocument()
//
// 2. ❌ expect(input).toHaveValue() - checks if ANY value exists
//    ✅ expect(input).toHaveValue('') - checks if empty
//    ✅ expect(input).toHaveValue('text') - checks specific value
//
// 3. ❌ Missing await before user interactions
//    ✅ await user.click(button)
//    ✅ await user.type(input, 'text')
//
// 4. ❌ getByRole('alert', { name: 'text' }) - alert role doesn't have accessible name by default
//    ✅ getByText('text') - for error messages in <p role="alert">
//    ✅ getByRole('alert') - if you just need to find the alert element
//
// 5. ❌ Not using regex with /i for case-insensitive matching
//    ✅ /email/i matches "Email", "EMAIL", "email"
//
// 🎯 WHEN TO USE WHICH QUERY:
//
// - getByRole() - Best for interactive elements (buttons, inputs with labels)
// - getByLabelText() - Best for form inputs
// - getByText() - Best for text content like error messages, paragraphs
// - getByPlaceholderText() - For inputs without labels
// - getByTestId() - Last resort when nothing else works