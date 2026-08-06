import { Op, fn, col, literal } from "sequelize";
import { ContactEnquiry, Customer, Estimate, Invoice, InvoicePayment, JobSheet, Vehicle } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const startOfDay = () => { const date = new Date(); date.setHours(0, 0, 0, 0); return date; };
const startOfMonth = () => { const date = new Date(); date.setDate(1); date.setHours(0, 0, 0, 0); return date; };

export const getDashboard = asyncHandler(async (_req, res) => {
  const today = startOfDay();
  const month = startOfMonth();
  const [
    totalCustomers,
    totalVehicles,
    openJobs,
    completedJobs,
    pendingEstimates,
    unpaidInvoices,
    outstandingAmount,
    todayRevenue,
    monthRevenue,
    newEnquiries,
    jobStatusRows,
    revenueRows,
    recentEstimates,
    recentJobs,
    recentInvoices,
  ] = await Promise.all([
    Customer.count(),
    Vehicle.count(),
    JobSheet.count({ where: { status: { [Op.in]: ["Open", "In Progress"] } } }),
    JobSheet.count({ where: { status: "Completed" } }),
    Estimate.count({ where: { status: { [Op.in]: ["Draft", "Sent"] } } }),
    Invoice.count({ where: { status: { [Op.in]: ["Unpaid", "Partial", "Overdue"] } } }),
    Invoice.sum("balance", { where: { status: { [Op.in]: ["Unpaid", "Partial", "Overdue"] } } }),
    InvoicePayment.sum("amount", { where: { paymentDate: { [Op.gte]: today } } }),
    InvoicePayment.sum("amount", { where: { paymentDate: { [Op.gte]: month } } }),
    ContactEnquiry.count({ where: { status: "New" } }),
    JobSheet.findAll({ attributes: ["status", [fn("COUNT", col("id")), "value"]], group: ["status"], raw: true }),
    InvoicePayment.findAll({
      attributes: [[fn("DATE_FORMAT", col("paymentDate"), "%Y-%m"), "month"], [fn("SUM", col("amount")), "revenue"]],
      where: { paymentDate: { [Op.gte]: literal("DATE_SUB(CURDATE(), INTERVAL 5 MONTH)") } },
      group: [literal("DATE_FORMAT(paymentDate, '%Y-%m')")],
      order: [[literal("DATE_FORMAT(paymentDate, '%Y-%m')"), "ASC"]],
      raw: true,
    }),
    Estimate.findAll({ limit: 4, order: [["createdAt", "DESC"]], attributes: ["id", "estimateNumber", "status", "createdAt"] }),
    JobSheet.findAll({ limit: 4, order: [["updatedAt", "DESC"]], attributes: ["id", "jobNumber", "status", "updatedAt"] }),
    Invoice.findAll({ limit: 4, order: [["createdAt", "DESC"]], attributes: ["id", "invoiceNumber", "status", "createdAt"] }),
  ]);

  const activities = [
    ...recentEstimates.map((item) => ({ id: `estimate-${item.id}`, icon: "estimate", text: `${item.estimateNumber} is ${item.status}`, time: item.createdAt })),
    ...recentJobs.map((item) => ({ id: `job-${item.id}`, icon: "job", text: `${item.jobNumber} is ${item.status}`, time: item.updatedAt })),
    ...recentInvoices.map((item) => ({ id: `invoice-${item.id}`, icon: "invoice", text: `${item.invoiceNumber} is ${item.status}`, time: item.createdAt })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

  res.json({
    success: true,
    data: {
      metrics: {
        totalCustomers,
        totalVehicles,
        openJobs,
        completedJobs,
        pendingEstimates,
        unpaidInvoices,
        outstandingAmount: Number(outstandingAmount || 0),
        todayRevenue: Number(todayRevenue || 0),
        monthRevenue: Number(monthRevenue || 0),
        newEnquiries,
      },
      jobStatusData: jobStatusRows.map((item) => ({ name: item.status, value: Number(item.value) })),
      revenueData: revenueRows.map((item) => ({ month: item.month, revenue: Number(item.revenue || 0) })),
      activities,
    },
  });
});
