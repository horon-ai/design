import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Chip } from "@horon-ai/react/components/chip";
import { DataTable, type DataTableColumn } from "@horon-ai/react/components/data-table";

type Payment = {
  invoice: string;
  customer: string;
  status: "Paid" | "Pending" | "Overdue";
  method: string;
  amount: number;
};

const payments: Payment[] = [
  {
    invoice: "INV-2041",
    customer: "Northwind",
    status: "Paid",
    method: "Card",
    amount: 1250,
  },
  {
    invoice: "INV-2040",
    customer: "Acme Corp",
    status: "Pending",
    method: "Bank transfer",
    amount: 840,
  },
  {
    invoice: "INV-2039",
    customer: "Globex",
    status: "Overdue",
    method: "Card",
    amount: 2100,
  },
  {
    invoice: "INV-2038",
    customer: "Initech",
    status: "Paid",
    method: "Card",
    amount: 460,
  },
  {
    invoice: "INV-2037",
    customer: "Umbrella",
    status: "Paid",
    method: "Wire",
    amount: 3180,
  },
  {
    invoice: "INV-2036",
    customer: "Soylent",
    status: "Pending",
    method: "Bank transfer",
    amount: 720,
  },
  {
    invoice: "INV-2035",
    customer: "Hooli",
    status: "Overdue",
    method: "Wire",
    amount: 940,
  },
  {
    invoice: "INV-2034",
    customer: "Vehement",
    status: "Paid",
    method: "Card",
    amount: 1560,
  },
  {
    invoice: "INV-2033",
    customer: "Massive Dynamic",
    status: "Paid",
    method: "Wire",
    amount: 4820,
  },
  {
    invoice: "INV-2032",
    customer: "Pied Piper",
    status: "Pending",
    method: "Card",
    amount: 310,
  },
  {
    invoice: "INV-2031",
    customer: "Cyberdyne",
    status: "Paid",
    method: "Bank transfer",
    amount: 2270,
  },
  {
    invoice: "INV-2030",
    customer: "Tyrell Corp",
    status: "Overdue",
    method: "Wire",
    amount: 3640,
  },
];

const statusVariant = {
  Paid: "success",
  Pending: "warning",
  Overdue: "destructive",
} as const;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const columns: DataTableColumn<Payment>[] = [
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ row }) => <span className="font-medium">{row.original.invoice}</span>,
  },
  { accessorKey: "customer", header: "Customer" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Chip variant={statusVariant[row.original.status]}>{row.original.status}</Chip>,
  },
  { accessorKey: "method", header: "Method" },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => <div className="text-right tabular-nums">{currency.format(row.original.amount)}</div>,
  },
];

const meta = {
  title: "Web/DataTable",
  component: DataTable,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<Partial<React.ComponentProps<typeof DataTable>>>;

export const Playground: Story = {
  render: () => <DataTable columns={columns} data={payments} pageSize={5} className="w-[760px]" />,
};

export const Empty: Story = {
  render: () => <DataTable columns={columns} data={[]} emptyMessage="No payments yet." className="w-[760px]" />,
};
