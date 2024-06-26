import { IDataItem } from "../base-table.tsx";
import "./index.css";
import { makeData, Person } from "./makeData";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { CSSProperties } from "react";

//These are the important styles to make sticky column pinning work!
//Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
//View the index.css file for more needed styles such as border-collapse: separate
const getCommonPinningStyles = (column: Column<Person>): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
        ? "4px 0 4px -4px gray inset"
        : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

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
    size: 888,
  },
  {
    accessorKey: "age",
    id: "age",
    header: "Age",
    footer: (props) => props.column.id,
    size: 888,
  },
  {
    accessorKey: "visits",
    id: "visits",
    header: "Visits",
    footer: (props) => props.column.id,
    size: 888,
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

export type IProps = {
  w: number;
  h: number;
  data: IDataItem[];
  total: number;
};

export default function TablePinColumn(props: IProps) {
  const { w, h } = props;
  const [data, setData] = React.useState(() => makeData(300));
  const [columns] = React.useState(() => [...defaultColumns]);

  const table = useReactTable({
    data,
    columns,
    initialState: {
      columnPinning: {
        left: ["firstName"],
        right: ["progress"],
      },
    },
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    columnResizeMode: "onChange",
  });

  return (
    <div className="p-2">
      <div
        className="table-container relative overflow-auto"
        style={{ height: 500, width: 500, overflow: "auto" }}
      >
        <table
          style={{
            width: table.getTotalSize(),
          }}
        >
          <thead className={"z-40"}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header;

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      //IMPORTANT: This is where the magic happens!
                      style={{ ...getCommonPinningStyles(column) }}
                    >
                      <div className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}{" "}
                        {/* Demo getIndex behavior */}
                        {column.getIndex(column.getIsPinned() || "center")}
                      </div>
                      <div
                        {...{
                          onDoubleClick: () => header.column.resetSize(),
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${
                            header.column.getIsResizing() ? "isResizing" : ""
                          }`,
                        }}
                      />
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell;
                  return (
                    <td
                      key={cell.id}
                      //IMPORTANT: This is where the magic happens!
                      style={{ ...getCommonPinningStyles(column) }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
