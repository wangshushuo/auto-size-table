import "./index.css";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CSSProperties } from "react";

//These are the important styles to make sticky column pinning work!
//Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
//View the index.css file for more needed styles such as border-collapse: separate
const getCommonPinningStyles = <T,>(column: Column<T>): CSSProperties => {
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

export interface IProps<T> {
  w: number;
  h: number;
  data: T[];
  columns: ColumnDef<T>[];
}

export default function TablePinColumn<T>(props: IProps<T>) {
  const { w, h, columns, data } = props;

  const firstColumnAccessorKey = columns[0].id;
  const lastColumnAccessorKey = columns[columns.length - 1].id;

  const table = useReactTable({
    data,
    columns,
    initialState: {
      columnPinning: {
        left: [firstColumnAccessorKey || ""],
        right: [lastColumnAccessorKey || ""],
      },
    },
    getCoreRowModel: getCoreRowModel(),
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
    columnResizeMode: "onChange",
  });

  return (
    <>
      <div
        className="table-container relative overflow-auto"
        style={{ height: h, width: w, overflow: "auto" }}
      >
        <table
          style={{
            height: "calc(100% - 70px)",
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
                      style={{ ...getCommonPinningStyles<T>(column) }}
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
                      style={{ ...getCommonPinningStyles<T>(column) }}
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
    </>
  );
}
