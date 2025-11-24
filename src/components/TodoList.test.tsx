import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "./TodoList";

describe("TodoList Component", () => {
  // TEST 1: Component renders correctly
  it("should render the todo list heading", () => {
    render(<TodoList />);
    expect(screen.getByText("Todo List")).toBeInTheDocument();
  });

  // TEST 2: Input and button are present
  it("should render input field and add button", () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("Enter a new todo...");
    const addButton = screen.getByRole("button", { name: "Add Todo" });

    expect(input).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  // TEST 3: Shows empty state message
  it("should show empty state when no todos", () => {
    render(<TodoList />);
    expect(
      screen.getByText("No todos yet. Add one above!")
    ).toBeInTheDocument();
  });

  // TEST 4: Can add a new todo
  it("should add a new todo when user types and clicks add", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText("Enter a new todo...");
    const addButton = screen.getByRole("button", { name: "Add Todo" });
    // Type in input
    await user.type(input, "Buy groceries");
    await user.click(addButton);

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  // TEST 5: Can add multiple todos
  it("should add multiple todos", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText("Enter a new todo...");
    const addButton = screen.getByRole("button", { name: "Add Todo" });

    await user.type(input, "First todo");
    await user.click(addButton);

    await user.type(input, "Second todo");
    await user.click(addButton);

    await user.type(input, "Third todo");
    await user.click(addButton);

    expect(screen.getByText("First todo")).toBeInTheDocument();
    expect(screen.getByText("Second todo")).toBeInTheDocument();
    expect(screen.getByText("Third todo")).toBeInTheDocument();
  });

  // TEST 6: Can add todo by pressing Enter key
  it("should add todo when pressing Enter Key", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText("Enter a new todo...");
    await user.type(input, "Todo by Enter key{Enter}");

    expect(screen.getByText("Todo by Enter key")).toBeInTheDocument();
  });

  // TEST 7: Should not add empty todos
  it("should not add empty todo", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const addButton = screen.getByRole("button", { name: "Add Todo" });
    await user.click(addButton);

    expect(
      screen.getByText("No todos yet. Add one above!")
    ).toBeInTheDocument();
  });

  // TEST 8: Should not add todo with only whitespace
  it("should not add todo with only whitespace", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText("Enter a new todo...");
    const addButton = screen.getByRole("button", { name: "Add Todo" });
    await user.type(input, "  ");
    await user.click(addButton);

    expect(
      screen.getByText("No todos yet. Add one above!")
    ).toBeInTheDocument();
  });

  // TEST 9: Can toggle todo completion
  it("should toggle todo completion status", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText("Enter a new todo...");
    const addButton = screen.getByRole("button", { name: "Add Todo" });

    await user.type(input, "Complete this task");
    await user.click(addButton);

    const checkbox = screen.getByRole("checkbox", {
      name: "Toggle Complete this task",
    });

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  // TEST 10: Can delete a todo
  it("should delete a todo when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText("Enter a new todo...");
    const addButton = screen.getByRole("button", { name: "Add Todo" });

    await user.type(input, "Task to delete");
    await user.click(addButton);

    expect(screen.getByText("Task to delete")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", {
      name: "Delete Task to delete",
    });
    await user.click(deleteButton);

    expect(screen.queryByText("Task to delete")).not.toBeInTheDocument();
  });

  // TEST 11: Empty state appears after deleting all todos
  it("should show empty state after deleting all todos", async ()=>{
    const user = userEvent.setup();
    render(<TodoList />)

    const input = screen.getByPlaceholderText("Enter a new todo...");
    const addButton = screen.getByRole("button",{name : "Add Todo"});

    await user.type(input, "Only todo");
    await user.click(addButton)

    const deleteButton = screen.getByRole("button", {
        name :"Delete Only todo",
    })

    await user.click(deleteButton)

    expect(screen.getByText("No todos yet. Add one above!")).toBeInTheDocument()
  })
});


// screen.getByPlaceholderText() - Find inputs by placeholder
// await user.type(input, "text") - Simulate typing
// expect(input).toHaveValue("") - Check input value
// screen.queryByText() - Returns null if not found (unlike getByText which throws error)
// .not.toBeInTheDocument() - Assert something is NOT present
// screen.getByRole("checkbox") - Find checkboxes
// .toBeChecked() - Check if checkbox is checked
// Testing keyboard events - {Enter} key press