import { Person } from "./column/makeData.ts";
import {
  Column,
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Row,
  RowPinningState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import React, { CSSProperties } from "react";

export type IDataItem = any;

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
const columns = [
  {
    header: "Id",
    accessorKey: "id",
    size: 180,
  },
  {
    header: "Full Name",
    accessorKey: "name",
    size: 480,
  },
  {
    header: "City",
    accessorKey: "city",
    size: 880,
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    size: 880,
  },
  {
    header: "field1",
    accessorKey: "field1",
    size: 180,
  },
  {
    header: "field2",
    accessorKey: "field2",
    size: 180,
  },
  {
    header: "field3 auto width",
    accessorKey: "field3",
  },
  {
    header: "field4",
    accessorKey: "field4",
    size: 180,
  },
];
export default function App({
  w,
  h,
  data,
  total,
}: {
  w: number;
  h: number;
  data: IDataItem[];
  total: number;
}) {
  //table states
  const [rowPinning, setRowPinning] = React.useState<RowPinningState>({
    top: [],
    bottom: [],
  });
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  //demo states
  const [keepPinnedRows] = React.useState(true);
  const [copyPinnedRows] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: { pageSize: 15, pageIndex: 0 },
      columnPinning: {
        left: ["id"],
        right: ["field4"],
      },
    },
    state: {
      expanded,
      rowPinning,
    },
    onExpandedChange: setExpanded,
    onRowPinningChange: setRowPinning,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    keepPinnedRows,
    // debugRows: true,
  });

  return (
    <>
      <div
        className="relative overflow-auto"
        style={{ height: h - 70, width: w }}
      >
        <table
          className={"w-full"}
          style={{
            height: "calc(100% - 70px)",
            maxWidth: table.getTotalSize(),
          }}
        >
          <thead
            className={"sticky top-0 z-20 border-b border-[#E8EBF1] bg-white"}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ ...getCommonPinningStyles(column) }}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getTopRows().map((row) => (
              <PinnedRow key={row.id} row={row} table={table} />
            ))}
            {(copyPinnedRows
              ? table.getRowModel().rows
              : table.getCenterRows()
            ).map((row) => {
              return (
                <tr
                  key={row.id}
                  className={
                    "h-[74px] border-b border-[#E8EBF1] last:border-b-0"
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    const { column } = cell;
                    return (
                      <td
                        key={cell.id}
                        className={"pl-4"}
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
              );
            })}
            {table.getBottomRows().map((row) => (
              <PinnedRow key={row.id} row={row} table={table} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex h-[62px] items-center justify-end gap-2 border-t border-t-[] p-4">
        <select
          className={
            "color-[#4F537B] box-border h-[30px] rounded-md border-2 border-[#E8EBF1] bg-[#F4F6FC] px-[10px] text-[14px]"
          }
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 15, 20, 25, 30].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize} / page
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function PinnedRow({ row, table }: { row: Row<any>; table: Table<any> }) {
  return (
    <tr
      style={{
        backgroundColor: "lightblue",
        position: "sticky",
        top:
          row.getIsPinned() === "top"
            ? `${row.getPinnedIndex() * 26 + 48}px`
            : undefined,
        bottom:
          row.getIsPinned() === "bottom"
            ? `${
                (table.getBottomRows().length - 1 - row.getPinnedIndex()) * 26
              }px`
            : undefined,
      }}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}
