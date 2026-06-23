import Joi from "joi";
import Customer from "../models/customer.model.js";
import CustomerService from "../service/CustomerService.js";
import AppError from "../utils/AppError.js";

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),

  email: Joi.string().email().required(),

  phone: Joi.string()
    .pattern(/^(?:(?:\+44)|0)(?:1\d{9}|2\d{9}|3\d{9}|7\d{9}|8\d{9})$/)
    .required()
    .messages({
      "string.pattern.base":
        "Please enter a valid UK phone number (e.g. +447911123456 or 07911123456).",
      "string.empty": "Phone number is required.",
      "any.required": "Phone number is required.",
    }),
  address: Joi.string().max(1000).allow("", null),
  customerCode: Joi.string().max(50).allow("", null),
  telephone: Joi.string().max(20).allow("", null),
  gdprConsent: Joi.boolean().allow(null),
  creditTerms: Joi.string().max(100).allow("", null),
  alternativeAddress: Joi.string().max(1000).allow("", null),
});

export const createCustomer = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      throw new AppError(error.details[0].message, 422, "VALIDATION_ERROR");
    const result = await CustomerService.createCustomer(req, res);
    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: result,
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
    const customers = await CustomerService.getCustomers(req);
    return res.status(200).json({
      success: true,
      message: "Data get Successfully",
      data: customers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await CustomerService.getCustomerById(req, res);
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
    const customer = await CustomerService.updateCustomer(req, res);
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
    const customer = await CustomerService.deleteCustomer(req, res);
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
