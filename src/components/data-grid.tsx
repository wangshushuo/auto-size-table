import { makeData, Person } from "@/components/column/makeData.ts";
import TablePinColumn from "@/components/column/table.tsx";
import { ColumnDef } from "@tanstack/react-table";
import throttle from "lodash/throttle";
import { useEffect, useRef, useState } from "react";

const defaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    id: "firstName",
    header: "First Name",
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorFn: (row) => row.lastName,
    id: "lastName",
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: (props) => props.column.id,
    size: 400,
  },
  {
    accessorKey: "age",
    id: "age",
    header: "Age",
    footer: (props) => props.column.id,
    size: 400,
  },
  {
    accessorKey: "visits",
    id: "visits",
    header: "Visits",
    footer: (props) => props.column.id,
    size: 400,
  },
  {
    accessorKey: "status",
    id: "status",
    header: "Status",
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: "progress",
    id: "progress",
    header: "Profile Progress",
    footer: (props) => props.column.id,
    size: 180,
  },
];

export default function DataGrid() {
  const [w, setW] = useState(800);
  const [h, setH] = useState(500);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const updateTableScroll = throttle(() => {
    if (tableContainerRef.current) {
      const containerWidth = tableContainerRef.current.offsetWidth;
      const containerHeight = tableContainerRef.current.offsetHeight;
      setW(containerWidth);
      setH(containerHeight);
    }
  }, 200);

  useEffect(() => {
    updateTableScroll();
    window.addEventListener("resize", updateTableScroll);
    return () => {
      window.removeEventListener("resize", updateTableScroll);
    };
  }, []);

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-md bg-white"
      ref={tableContainerRef}
    >
      <span className={"absolute left-0 top-0 z-50"}>
        w:{w} h:{h}
      </span>
      <TablePinColumn<Person>
        w={w}
        h={h}
        data={makeData(300)}
        columns={defaultColumns}
      />
    </div>
  );
}
