import { useCounterStore } from "../store/counterStore";

export function ZustandCounter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Zustand Counter</h2>
      <p className="text-3xl font-bold mb-4">Count: {count}</p>
      <div className="space-x-2">
        <button
          onClick={increment}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Increment
        </button>
        <button
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Decrement
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export function CountDisplay() {
  const count = useCounterStore((state) => state.count);

  return <div>Current count: {count}</div>;
}
