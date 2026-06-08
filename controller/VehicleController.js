import Customer from "../models/customer.model.js";
import Vehicle from "../models/vehicle.model.js";

export const createVehicle = async (req, res) => {
  try {
    const {
      customerId,
      registrationNumber,
      make,
      model,
      year,
      vinNumber,
      mileage,
      engineNumber,
      fuelType,
      colour,
      cc,
      grossWeight,
      taxDueDate,
      motDueDate,
      nextServiceDate,
      lastMileage,
    } = req.body;

    const customer = await Customer.findByPk(req.body.customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const existingVehicle = await Vehicle.findOne({
      where: {
        registrationNumber,
      },
    });
    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: "Vehicle registration number already exists",
      });
    }

    const vehicle = await Vehicle.create({
      customerId,
      registrationNumber,
      make,
      model,
      year,
      vinNumber,
      mileage,
      engineNumber,
      fuelType,
      colour,
      cc,
      grossWeight,
      taxDueDate,
      motDueDate,
      nextServiceDate,
      lastMileage,
    });

    return res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVehicles = async (req, res) => {
  try {
    console.log(Vehicle.associations);
    const vehicles = await Vehicle.findAll({
      include: [
        {
          model: Customer,
          as: "customer",
        },
      ],
    });

    return res.json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id, {
      include: [Customer],
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    await vehicle.update(req.body);

    return res.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    await vehicle.destroy();

    return res.json({
      success: true,
      message: "Vehicle deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
