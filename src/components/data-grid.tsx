import TablePinColumn from "@/components/column/table.tsx";
import throttle from "lodash/throttle";
import { useEffect, useRef, useState } from "react";

export default function DataGrid(props) {
  const [w, setW] = useState(600);
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
      <TablePinColumn w={w} h={h} data={props.data} total={props.data.length} />
    </div>
  );
}
