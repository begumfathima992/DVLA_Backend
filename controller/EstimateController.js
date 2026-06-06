import { Estimate, EstimateItem, Customer, Vehicle } from "../models/index.js";

export const createEstimate = async (req, res) => {
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
    } = req.body;

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

    return res.status(201).json({
      success: true,
      message: "Estimate created",
      data: estimate,
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEstimates = async (req, res) => {
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

    return res.json({
      success: true,
      data: estimates,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEstimateById = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        message: "Estimate not found",
      });
    }

    return res.json({
      success: true,
      data: estimate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.findByPk(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: "Estimate not found",
      });
    }

    await estimate.update(req.body);

    return res.json({
      success: true,
      message: "Estimate updated",
      data: estimate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.findByPk(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: "Estimate not found",
      });
    }

    await EstimateItem.destroy({
      where: {
        estimateId: estimate.id,
      },
    });

    await estimate.destroy();

    return res.json({
      success: true,
      message: "Estimate deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.findByPk(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: "Estimate not found",
      });
    }

    await estimate.update({
      status: "Approved",
    });

    return res.json({
      success: true,
      message: "Estimate approved",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.findByPk(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: "Estimate not found",
      });
    }

    await estimate.update({
      status: "Rejected",
    });

    return res.json({
      success: true,
      message: "Estimate rejected",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
