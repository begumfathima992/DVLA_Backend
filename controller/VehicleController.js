// import Vehicle from "./vehicle.model.js";
// import Customer from "../customer/customer.model.js";

import Customer from "../models/customer.model.js";
import Vehicle from "../models/vehicle.model.js";

export const createVehicle = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.body.customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const vehicle = await Vehicle.create(req.body);

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
    const vehicles = await Vehicle.findAll({
      include: [Customer],
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
