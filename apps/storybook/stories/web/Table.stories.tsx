import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "@horon/web/components/chip";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@horon/web/components/table";

const invoices = [
  { id: "INV-2041", customer: "Northwind", status: "Paid", amount: "$1,250.00" },
  { id: "INV-2040", customer: "Acme Corp", status: "Pending", amount: "$840.00" },
  { id: "INV-2039", customer: "Globex", status: "Overdue", amount: "$2,100.00" },
  { id: "INV-2038", customer: "Initech", status: "Paid", amount: "$460.00" },
] as const;

const statusVariant = {
  Paid: "success",
  Pending: "warning",
  Overdue: "destructive",
} as const;

const meta = {
  title: "Web/Table",
  component: Table,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="w-[560px]">
      <Table>
        <TableCaption>A list of recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.customer}</TableCell>
              <TableCell>
                <Chip variant={statusVariant[invoice.status]}>{invoice.status}</Chip>
              </TableCell>
              <TableCell className="text-right tabular-nums">{invoice.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right tabular-nums">$4,650.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};

export const Simple: Story = {
  render: () => (
    <div className="w-[420px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Requests</TableCell>
            <TableCell className="text-right tabular-nums">12,480</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Errors</TableCell>
            <TableCell className="text-right tabular-nums">3</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Avg. latency</TableCell>
            <TableCell className="text-right tabular-nums">84 ms</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};
