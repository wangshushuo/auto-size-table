import "./App.css";
import TablePinColumn from "./components/column/table.tsx";
import DataGrid from "@/components/data-grid.tsx";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("https://667abfb3bd627f0dcc905535.mockapi.io/api/v1/user")
      .then((response) => response.json())
      .then((json) => setData(json));
  }, []);

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
      <div className={"grow"}>
        <DataGrid data={data} />
      </div>
    </div>
  );
}

export default App;
