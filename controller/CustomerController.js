import Customer from "../models/customer.model.js";

export const createCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      customerCode,
      telephone,
      gdprConsent,
      creditTerms,
      alternativeAddress,
    } = req.body;

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
      customerCode: customerCode,
      telephone,
      gdprConsent,
      creditTerms,
      alternativeAddress,
    });

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const customers = await Customer.findAll();

    return res.status(200).json({
      success: true,
      message: "Data get Successfully",
      data: customers,
    });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await customer.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await customer.destroy();

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
