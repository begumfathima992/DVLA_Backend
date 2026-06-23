import {
  Estimate,
  EstimateItem,
  Customer,
  Vehicle,
  JobSheet,
  JobSheetItem,
} from "../models/index.js";
import AppError from "../utils/AppError.js";

const estimateService = {
  async createEstimate(req, res) {
    const transaction = await Estimate.sequelize.transaction();
    try {
      const {
        customerId,
        vehicleId,
        vatPercentage,
        discount,
        notes,
        validUntil,
        items,
        estimateDate,
        documentType,
        labourRate,
        jobNumber,
        customerOrderNumber,
        serviceAdvisor,
        defaultDiscount,
        vehicleMileage,
        status,
      } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new AppError("At least one item is required", 400, "BAD_REQUEST");
      }

      let subtotal = 0;

      items.forEach((item) => {
        subtotal += Number(item.quantity) * Number(item.unitPrice);
      });

      const vatAmount = (subtotal * Number(vatPercentage || 0)) / 100;
      const total = subtotal + vatAmount - Number(discount || 0);

      const estimate = await Estimate.create(
        {
          estimateNumber: `EST-${Date.now()}`,
          customerId,
          vehicleId,
          subtotal,
          vatPercentage,
          vatAmount,
          discount,
          total,
          notes,
          validUntil,
          // New Fields
          estimateDate,
          documentType,
          labourRate,
          jobNumber: `JOB-${Date.now()}`,
          customerOrderNumber,
          serviceAdvisor,
          defaultDiscount,
          vehicleMileage,
          status,
        },
        { transaction },
      );

      const estimateItems = items.map((item) => ({
        estimateId: estimate.id,
        itemType: item.itemType,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: Number(item.quantity) * Number(item.unitPrice),
      }));

      await EstimateItem.bulkCreate(estimateItems, { transaction });

      await transaction.commit();

      return estimate;
    } catch (error) {
      await transaction.rollback();
      if (error instanceof AppError) throw error;
      throw new AppError("Customer Create failed", 500);
    }
  },

  async getEstimates(req, res) {
    try {
      const estimates = await Estimate.findAll({
        include: [
          {
            model: Customer,
            as: "customer",
          },
          {
            model: Vehicle,
            as: "vehicle",
          },
          {
            model: EstimateItem,
            as: "items",
          },
        ],
        order: [["id", "DESC"]],
      });

      return estimates;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Customer Create failed", 500);
    }
  },

  async getEstimateById(req, res) {
    try {
      const estimate = await Estimate.findByPk(req.params.id, {
        include: [
          {
            model: Customer,
            as: "customer",
          },
          {
            model: Vehicle,
            as: "vehicle",
          },
          {
            model: EstimateItem,
            as: "items",
          },
        ],
      });

      if (!estimate) {
        throw new AppError("Estimate not found", 404, "NOT_FOUND");
      }

      return estimate;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Customer Create failed", 500);
    }
  },

  async updateEstimate(req, res) {
    const transaction = await Estimate.sequelize.transaction();

    try {
      const estimate = await Estimate.findByPk(req.params.id, {
        transaction,
      });

      if (!estimate) {
        await transaction.rollback();
        throw new AppError("Estimate not found", 404, "NOT_FOUND");
      }

      const {
        customerId,
        vehicleId,
        vatPercentage,
        discount,
        notes,
        validUntil,
        items,
        estimateDate,
        documentType,
        labourRate,
        customerOrderNumber,
        serviceAdvisor,
        defaultDiscount,
        vehicleMileage,
        status,
      } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        await transaction.rollback();
        throw new AppError("At least one item is required", 400, "BAD_REQUEST");
      }
      let subtotal = 0;
      items.forEach((item) => {
        subtotal += Number(item.quantity || 0) * Number(item.unitPrice || 0);
      });
      const vatAmount = (subtotal * Number(vatPercentage || 0)) / 100;
      const total = subtotal + vatAmount - Number(discount || 0);
      await estimate.update(
        {
          customerId,
          vehicleId,
          subtotal,
          vatPercentage,
          vatAmount,
          discount,
          total,
          notes,
          validUntil,
          estimateDate,
          documentType,
          labourRate,
          customerOrderNumber,
          serviceAdvisor,
          defaultDiscount,
          vehicleMileage,
          status,
        },
        { transaction },
      );
      await EstimateItem.destroy({
        where: {
          estimateId: estimate.id,
        },
        transaction,
      });

      // Insert new items
      const estimateItems = items.map((item) => ({
        estimateId: estimate.id,

        itemType: item.itemType,
        description: item.description,

        quantity: item.quantity,
        unitPrice: item.unitPrice,

        totalPrice: Number(item.quantity || 0) * Number(item.unitPrice || 0),
      }));

      await EstimateItem.bulkCreate(estimateItems, {
        transaction,
      });

      await transaction.commit();

      const updatedEstimate = await Estimate.findByPk(estimate.id, {
        include: [
          {
            model: EstimateItem,
            as: "items",
          },
        ],
      });

      return updatedEstimate;
    } catch (error) {
      await transaction.rollback();

      if (error instanceof AppError) throw error;
      throw new AppError("Customer Create failed", 500);
    }
  },

  async deleteEstimate(req, res) {
    try {
      const estimate = await Estimate.findByPk(req.params.id);

      if (!estimate) {
        throw new AppError("Estimate not found", 404, "NOT_FOUND");
      }

      await EstimateItem.destroy({
        where: {
          estimateId: estimate.id,
        },
      });

      const result = await estimate.destroy();
      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Customer Create failed", 500);
    }
  },

  async updateStatusEstimate(req, res) {
    try {
      const estimate = await Estimate.findByPk(req.params.id);
      const status = req?.body?.status;

      if (!estimate) {
        throw new AppError("Estimate not found", 404, "NOT_FOUND");
      }

      if (status == "Approved") {
        if (estimate.status === "Approved") {
          throw new AppError("Estimate already approved", 404, "BAD_REQUEST");
        }
        await estimate.update({
          status: "Approved",
          approvedAt: new Date(),
        });
        const estimateItems = await EstimateItem.findAll({
          where: {
            estimateId: estimate.id,
          },
        });

        const jobSheet = await JobSheet.create({
          jobNumber: estimate.jobNumber,
          estimateId: estimate.id,
          customerId: estimate.customerId,
          vehicleId: estimate.vehicleId,
          vehicleMileage: estimate.vehicleMileage || 0,
          serviceAdvisor: estimate.serviceAdvisor || null,
          subtotal: estimate.subtotal || 0,
          labourRate: estimate.labourRate,
          vatPercentage: estimate.vatPercentage || 20,
          vatAmount: estimate.vatAmount || 0,
          discount: estimate.discount || 0,
          total: estimate.total || 0,
          status: "Open",
          priority: "Medium",
        });
        if (estimateItems.length > 0) {
          const jobSheetItems = estimateItems.map((item) => ({
            jobSheetId: jobSheet.id,
            itemType: item.itemType,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          }));

          await JobSheetItem.bulkCreate(jobSheetItems);
        }

        return {
          success: true,
          message: "Estimate approved and Job Sheet created",
          estimate,
          jobSheet,
        };
      } else if (status == "Rejected") {
        await estimate.update({
          status: "Rejected",
        });

        return {
          success: true,
          message: "Estimate rejected",
        };
      } else if (status == "Draft") {
        await estimate.update({
          status: "Draft",
        });

        return {
          success: true,
          message: "Estimate rejected",
        };
      } else {
        await estimate.update({
          status: "Sent",
        });

        return {
          success: true,
          message: "Estimate Sent",
        };
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Customer Create failed", 500);
    }
  },
};

export default estimateService;
