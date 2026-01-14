import { PrismaClient } from "@prisma/client";

// Minimal, enum-free seed to keep builds green on Render.
// Seeds a single vendor, purchase order with two items, and one payment.
const prisma = new PrismaClient();

async function main() {
  console.log(" Starting database seed (minimal)...");

  // Clear existing data in dependency order
  await prisma.payment.deleteMany();
  await prisma.lineItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.vendor.deleteMany();

  const vendor = await prisma.vendor.create({
    data: {
      name: "Acme Corporation",
      contactPerson: "John Smith",
      email: "john@acme.com",
      phone: "9876543210",
      paymentTerms: 30,
      status: "ACTIVE",
    },
  });

  const purchaseOrder = await prisma.purchaseOrder.create({
    data: {
      poNumber: `PO-${new Date().getFullYear()}-0001`,
      vendorId: vendor.id,
      poDate: new Date(),
      totalAmount: 10000,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "APPROVED",
      items: {
        create: [
          { description: "Item A", quantity: 10, unitPrice: 500 },
          { description: "Item B", quantity: 5, unitPrice: 1000 },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      reference: `PAY-${new Date().getFullYear()}-0001`,
      purchaseOrderId: purchaseOrder.id,
      amountPaid: 5000,
      paymentDate: new Date(),
      method: "BANK_TRANSFER",
      notes: "Initial payment",
    },
  });

  console.log(" Seed completed (1 vendor, 1 PO, 1 payment).");
}

main()
  .catch((e) => {
    console.error(" Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
