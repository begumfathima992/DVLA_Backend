// import { JobSheet } from "../models/index.js";
import { Customer, JobSheet, JobSheetItem, Vehicle } from "../models/index.js";

const JobSheetController = {
  async getJobSheets(req, res) {
    try {
      const jobSheets = await JobSheet.findAll({
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
            model: JobSheetItem,
            as: "items",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const formattedData = jobSheets.map((jobSheet) => {
        const data = jobSheet.toJSON();

        const totalPrice = data.items.reduce(
          (sum, item) => sum + Number(item.totalPrice || 0),
          0,
        );

        return {
          ...data,
          totalPrice,
        };
      });
      return res.status(200).json({
        success: true,
        count: formattedData.length,
        data: formattedData,
      });
    } catch (error) {
      console.log(error, "error");

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  async updateJobSheet(req, res) {
    const transaction = await JobSheet.sequelize.transaction();

    try {
      const { id } = req.params;

      const jobSheet = await JobSheet.findByPk(id);

      if (!jobSheet) {
        await transaction.rollback();

        return res.status(404).json({
          success: false,
          message: "Job Sheet not found",
        });
      }

      const {
        technicianName,
        vehicleMileage,
        serviceAdvisor,
        priority,
        status,
        startDate,
        completedDate,
        labourRate,
        notes,
        vatPercentage,
        subtotal,
        vatAmount,
        total,
        items,
      } = req.body;
      await jobSheet.update(
        {
          technicianName,
          vehicleMileage,
          serviceAdvisor,
          priority,
          status,
          startDate,
          completedDate,
          labourRate,
          vatPercentage,
          subtotal,
          vatAmount,
          total,
          notes,
        },
        { transaction },
      );
      if (Array.isArray(items)) {
        await JobSheetItem.destroy({
          where: {
            jobSheetId: jobSheet.id,
          },
          transaction,
        });

        const jobSheetItems = items.map((item) => ({
          jobSheetId: jobSheet.id,
          itemType: item.itemType,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: Number(item.quantity || 0) * Number(item.unitPrice || 0),
        }));

        await JobSheetItem.bulkCreate(jobSheetItems, {
          transaction,
        });
      }

      await transaction.commit();

      const updatedJobSheet = await JobSheet.findByPk(id, {
        include: [
          {
            model: JobSheetItem,
            as: "items",
          },
        ],
      });

      return res.status(200).json({
        success: true,
        message: "Job Sheet updated successfully",
        data: updatedJobSheet,
      });
    } catch (error) {
      await transaction.rollback();

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  async updateJobSheetPriority(req, res) {
    try {
      const { id } = req.params;
      const { priority } = req.body;

      const jobSheet = await JobSheet.findByPk(id);

      if (!jobSheet) {
        return res.status(404).json({
          success: false,
          message: "Job Sheet not found",
        });
      }

      await jobSheet.update({
        priority,
      });

      return res.status(200).json({
        success: true,
        message: "Priority updated successfully",
        data: jobSheet,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  async updateJobSheetStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const jobSheet = await JobSheet.findByPk(id);

      if (!jobSheet) {
        return res.status(404).json({
          success: false,
          message: "Job Sheet not found",
        });
      }

      await jobSheet.update({
        status,
      });

      return res.status(200).json({
        success: true,
        message: "Status updated successfully",
        data: jobSheet,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

export default JobSheetController;
