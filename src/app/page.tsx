"use client";
import DebouncedInput from "@/components/DebounceInput";
import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
  FilterFn,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { useMemo, useState, useEffect } from "react";
import InsertDataModal from "@/components/InsertDataModal";
import { USER } from "@/types";
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};
export default function Home() {
  const columns = useMemo<ColumnDef<USER>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableGlobalFilter: true,
        enableSorting: false,
        id: "name",
      },
      {
        header: "Email",
        accessorKey: "email",
        enableGlobalFilter: false,
        enableSorting: true,
        id: "email",
      },
      {
        header: "Password",
        accessorKey: "password",
        enableGlobalFilter: false,
        enableSorting: true,
        id: "password",
      },
      {
        header: "Country",
        accessorKey: "country",
        enableGlobalFilter: false,
        enableSorting: false,
        id: "country",
      },
    ],
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [open, setOpen] = useState(false);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [user, setUser] = useState<USER[]>([]);
  const defaultData: any = useMemo(() => [], []);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  const table = useReactTable({
    data: user ?? defaultData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      pagination,
      globalFilter,
      sorting,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
    getSortedRowModel: getSortedRowModel(),
  });

  console.log(user.length);

  useEffect(() => {
    function getUserFromLocalStore() {
      const item = localStorage.getItem("user");
      const data = item !== null ? JSON.parse(item) : [];
      setUser(data);
    }
    getUserFromLocalStore();
  }, []);

  return (
    <section className="bg-[#040D12] min-h-screen">
      {open && (
        <InsertDataModal
          open={open}
          onClose={() => setOpen(false)}
          setUser={setUser}
        />
      )}
      <h1 className="text-center pt-5 font-bold text-[#176B87]">
        Assignment for{" "}
        <span className=" bg-[#176B87] p-2 rounded-sm text-white">
          SnabbTech
        </span>
      </h1>
      <div className="flex pl-2 justify-center w-full overflow-hidden">
        <main className="container  flex justify-center mt-10 flex-col items-start">
          <div className=" text-cyan-400 text-xs mt-5 ">
            TO SORT EMAIL JUST CLICK ON EMAIL IT WILL SORT IN ASCENDING or
            DESCENDING ORDER
          </div>
          <div>
            <button
              onClick={() => setOpen(true)}
              className="text-emerald-600 border-[1px] rounded-full border-emerald-700 px-7 py-2 mt-5 text-sm font-bold"
            >
              INSERT USER DATA
            </button>
          </div>
          <div className="mt-5">
            <DebouncedInput
              value={globalFilter ?? ""}
              debounce={500}
              placeholder="Search name"
              onChange={(value) => setGlobalFilter(String(value))}
            />
          </div>
          <div className="overflow-auto w-full flex  justify-center  shadow  mt-5">
            {user.length > 0 ? (
              <table className="w-full  ">
                <thead className="bg-[#232D3F] ">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="first:min-w-[40px] min-w-[150px] p-3 text-sm font-semibold tracking-wide text-center border-[1px] text-[#4db28b]  border-[#5C8374]"
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr className="border-[1px] border-[#5C8374]" key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`p-3 ${
                            !cell.id.includes("email") ? "capitalize" : ""
                          }   text-sm text-[#4db28b] whitespace-nowrap text-center even:bg-[#183D3D]`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <h1 className="font-extrabold text-amber-700">
                NO DATA IN THE TABLE TO SHOW!
              </h1>
            )}
          </div>
          <div className=" space-x-3 mt-5 select-none">
            <button
              className={`bg-emerald-800 rounded-md text-white p-2 font-extrabold ${
                !table.getCanPreviousPage() && "opacity-30"
              }`}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <span className="text-red-400">
              {table.getState().pagination.pageIndex + 1}
            </span>
            <span className="text-gray-400">of</span>
            <span className="text-red-400">{table.getPageCount()}</span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`bg-emerald-800 rounded-md text-white p-2 font-extrabold ${
                !table.getCanNextPage() && "opacity-30"
              }`}
            >
              {">>"}
            </button>
          </div>
        </main>
      </div>
    </section>
  );
}
