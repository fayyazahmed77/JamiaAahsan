import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
    type RowSelectionState,
} from '@tanstack/react-table';
import { Button } from './Button';
import { Spinner } from './Spinner';
import type { Paginated, PageMeta } from '@/types/models';

interface DataTableProps<T> {
    columns: ColumnDef<T, unknown>[];
    data: T[];
    meta?: PageMeta;
    onPageChange?: (page: number) => void;
    loading?: boolean;
    selectable?: boolean;
    onSelectionChange?: (rows: T[]) => void;
    emptyMessage?: string;
    toolbar?: React.ReactNode;
}

export function DataTable<T extends { id: number }>({
    columns,
    data,
    meta,
    onPageChange,
    loading = false,
    selectable = false,
    onSelectionChange,
    emptyMessage = 'No records found.',
    toolbar,
}: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Selection column
    const allColumns: ColumnDef<T, unknown>[] = selectable
        ? [
            {
                id: 'select',
                header: ({ table }) => (
                    <input
                        type="checkbox"
                        checked={table.getIsAllPageRowsSelected()}
                        {...{ indeterminate: table.getIsSomePageRowsSelected() ? true : undefined }}
                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                        aria-label="Select all rows"
                        style={{ accentColor: 'var(--primary-500)' }}
                    />
                ),
                cell: ({ row }) => (
                    <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        aria-label={`Select row ${row.id}`}
                        style={{ accentColor: 'var(--primary-500)' }}
                    />
                ),
                size: 40,
                enableSorting: false,
            },
            ...columns,
        ]
        : columns;

    const table = useReactTable({
        data,
        columns: allColumns,
        state: { sorting, rowSelection },
        onSortingChange: setSorting,
        onRowSelectionChange: (updater) => {
            const next = typeof updater === 'function' ? updater(rowSelection) : updater;
            setRowSelection(next);
            if (onSelectionChange) {
                const selectedRows = Object.keys(next)
                    .filter((k) => next[k])
                    .map((k) => data[Number(k)]);
                onSelectionChange(selectedRows);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableRowSelection: selectable,
    });

    const selectedCount = Object.values(rowSelection).filter(Boolean).length;

    return (
        <div className="data-table-wrapper">
            {/* Toolbar */}
            {(toolbar || (selectable && selectedCount > 0)) && (
                <div className="data-table-toolbar">
                    {selectable && selectedCount > 0 && (
                        <span style={{ fontSize: '0.8125rem', color: 'var(--primary-400)', fontWeight: 600 }}>
                            {selectedCount} selected
                        </span>
                    )}
                    {toolbar}
                </div>
            )}

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                    <thead>
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className={header.column.getCanSort() ? 'sortable' : ''}
                                        onClick={header.column.getToggleSortingHandler()}
                                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                                    >
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && (
                                                <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                                                    {header.column.getIsSorted() === 'asc'
                                                        ? '↑'
                                                        : header.column.getIsSorted() === 'desc'
                                                            ? '↓'
                                                            : '↕'}
                                                </span>
                                            )}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={allColumns.length} style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <Spinner size={24} />
                                </td>
                            </tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={allColumns.length}
                                    style={{
                                        textAlign: 'center', padding: '48px 0',
                                        color: 'var(--text-muted)', fontSize: '0.875rem',
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4 }}>
                                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                        {emptyMessage}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
                <div className="data-table-pagination">
                    <span>
                        Showing {meta.from ?? 0}–{meta.to ?? 0} of {meta.total.toLocaleString()} results
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={meta.current_page === 1}
                            onClick={() => onPageChange?.(meta.current_page - 1)}
                        >
                            ← Prev
                        </Button>
                        <span style={{
                            padding: '6px 12px', background: 'var(--surface-2)',
                            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8125rem', fontWeight: 600,
                        }}>
                            {meta.current_page} / {meta.last_page}
                        </span>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={meta.current_page === meta.last_page}
                            onClick={() => onPageChange?.(meta.current_page + 1)}
                        >
                            Next →
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
