import { TodoList } from "../components/TodoList";

export function TodosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Todos</h1>
      <TodoList />
    </div>
  );
}
