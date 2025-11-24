import { useState } from "react";
// import { TodoList } from "./components/TodoList";
// import { Button } from "./components/Button";
// import { LoginForm } from "./components/LoginForm";
// import { UserList } from "./components/UserList";
// import { UserDetails } from "./components/UserDetails";
// import { UserManagement } from "./components/UserManagement";
// import { Login, UserProfile } from "./components/Login";
// import { AuthProvider } from "./contexts/AuthContext";
// import { ThemedContent, ThemeSwitcher } from "./components/ThemeSwitcher";
// import { ThemeProvider } from "./contexts/ThemeContext";
// import { CountDisplay, ZustandCounter } from "./components/ZustandCounter";
// import { BuggyComponent, ErrorBoundary } from "./components/ErrorBoundary";

function App2() {
  const [count, setCount] = useState(0);

  const date1 = new Date(); // Today's date
  const date2 = Date.now();
  const date3 = new Date();
  const time = date3.getTime(); // ===Date.now
  const days = date3.getDay(); // return day of the week not actual day
  const year = date3.getFullYear();
  const month = String(date3.getMonth() + 1).padStart(2, "0");
  const day = String(date3.getDate()).padStart(2, "0");
  const x = `${year}-${month}-${day}`;
  console.log(
    date1,
    date2,
    x,
    time,
    days,
    date3.getMonth(),
    date3.getDate(),
    date3.getFullYear(),
    date3.getHours(),
    date3.getMinutes(),
    date3.getSeconds()
  );
  const date = new Date();
  const displayDate = date.toISOString().split("T")[0]; // Just date
  const displayTime = date.toLocaleTimeString("en-US", { hour12: true }); // Just time
  return (
    <div className="w-full max-w-7xl m-5 mx-auto">
      <h1 className="font-bold p-2">Learning Testing with React</h1>

      <div className=" border-2 p-2">
        <h2>Simple Counter</h2>
        <p className="p-2 ">Count: {count}</p>
        <button
          onClick={() => setCount(count + 1)}
          className="rounded-md border p-2 cursor-pointer bg-green-400 m-2"
        >
          Increment
        </button>
        <button
          onClick={() => setCount(count - 1)}
          className="rounded-md border p-2 cursor-pointer bg-red-400 m-2"
        >
          Decrement
        </button>
        <button
          onClick={() => setCount(0)}
          className="rounded-md border p-2 cursor-pointer bg-yellow-400 m-2"
        >
          Reset
        </button>
      </div>
      <div>
        <p>Date: {displayDate}</p>
        <p>Time: {displayTime}</p>
      </div>
      <div className="space-y-2">
        {/* <AuthProvider>
          <Login />
          <UserProfile />
        </AuthProvider>
        <ThemeProvider>
          <ThemeSwitcher />
          <ThemedContent />
        </ThemeProvider> */}
        {/* <ZustandCounter />
        <CountDisplay /> */}
        {/* <ErrorBoundary>
          <BuggyComponent shouldThrow={false} />
        </ErrorBoundary>
        <UserManagement />
        <TodoList /> */}
      </div>
      {/* <Button label="Click Me" onClick={() => {}} />
      <LoginForm onSubmit={() => {}} />
      <UserList />
      <UserDetails userId={1} /> */}
    </div>
  );
}

export default App2;
