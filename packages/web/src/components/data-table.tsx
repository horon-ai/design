"use client"

import * as React from "react"
import {
	createPaginatedRowModel,
	createSortedRowModel,
	flexRender,
	rowPaginationFeature,
	rowSortingFeature,
	tableFeatures,
	useTable,
	type CellData,
	type ColumnDef,
	type RowData,
} from "@tanstack/react-table"
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@horon/web/components/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@horon/web/components/table"

const dataTableFeatures = tableFeatures({
	rowSortingFeature,
	rowPaginationFeature,
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
})

export type DataTableFeatures = typeof dataTableFeatures

export type DataTableColumn<TData extends RowData> = ColumnDef<
	DataTableFeatures,
	TData,
	CellData
>

type DataTableProps<TData extends RowData> = {
	columns: DataTableColumn<TData>[]
	data: TData[]
	pageSize?: number
	emptyMessage?: string
	className?: string
}

function DataTable<TData extends RowData>({
	columns,
	data,
	pageSize = 10,
	emptyMessage = "No results.",
	className,
}: DataTableProps<TData>) {
	const table = useTable({
		features: dataTableFeatures,
		columns,
		data,
		initialState: { pagination: { pageIndex: 0, pageSize } },
	})

	const pagination = table.state.pagination
	const pageCount = Math.max(table.getPageCount(), 1)

	return (
		<div
			data-slot="data-table"
			className={cn("flex w-full flex-col gap-3", className)}
		>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const sorted = header.column.getIsSorted()
								const canSort = header.column.getCanSort()

								return (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : canSort ? (
											<button
												type="button"
												data-slot="data-table-sort"
												onClick={header.column.getToggleSortingHandler()}
												className="inline-flex items-center gap-1.5 rounded-xs outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
												{sorted === "asc" ? (
													<ArrowUpIcon className="size-3.5" />
												) : sorted === "desc" ? (
													<ArrowDownIcon className="size-3.5" />
												) : (
													<ChevronsUpDownIcon className="size-3.5 opacity-60" />
												)}
											</button>
										) : (
											flexRender(
												header.column.columnDef.header,
												header.getContext()
											)
										)}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center text-muted-foreground"
							>
								{emptyMessage}
							</TableCell>
						</TableRow>
					) : (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getAllCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
			<div
				data-slot="data-table-pagination"
				className="flex items-center justify-between gap-4"
			>
				<p
					data-slot="data-table-row-count"
					className="text-[13px] text-muted-foreground"
				>
					{table.getRowCount()} row(s)
				</p>
				<div
					data-slot="data-table-pagination-controls"
					className="flex items-center gap-2"
				>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<span
						data-slot="data-table-page-status"
						className="text-[13px] text-muted-foreground tabular-nums"
					>
						Page {pagination.pageIndex + 1} of {pageCount}
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}

export { DataTable }
