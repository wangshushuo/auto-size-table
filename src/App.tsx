import "./App.css";
import DataGrid from "@/components/data-grid.tsx";

function App() {
  return (
    <div className={"flex min-h-screen"}>
      <aside className={"w-44 border-r border-solid"}>
        <h1 className={"border-b"}>Data Grid</h1>
        <nav>
          <ul>
            <li>nav 1</li>
            <li>nav 2</li>
            <li>nav 3</li>
            <li>nav 4</li>
          </ul>
        </nav>
      </aside>
      <div className={"flex grow flex-col"}>
        <div>
          <h1 className={"text-4xl"}>page 1</h1>
          <p className={"text-xl"}>page description</p>
        </div>
        <div className={"grow"}>
          <DataGrid />
        </div>
      </div>
    </div>
  );
}

export default App;
