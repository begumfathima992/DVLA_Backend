import { Op } from "sequelize";
import Customer from "../models/customer.model.js";
import AppError from "../utils/AppError.js";

const CustomerService = {
  async createCustomer(req, res) {
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
      const existing = await Customer.findOne({
        where: { email: email },
      });

      if (existing) {
        throw new AppError("Email already exists", 409, "CONFLICT");
      }
      const existingPhone = await Customer.findOne({
        where: { phone: phone },
      });
      if (existingPhone) {
        throw new AppError("Phone already exists", 409, "CONFLICT");
      }

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

      return customer;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Customer Create failed", 500);
    }
  },

  async getCustomers(req) {
    try {
      const { search = "" } = req.query;

      const where = {};

      if (search.trim()) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
          { customerCode: { [Op.like]: `%${search}%` } },
          { telephone: { [Op.like]: `%${search}%` } },
        ];
      }

      const customers = await Customer.findAll({
        where,
        order: [["createdAt", "DESC"]],
      });

      return customers;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Customer Create failed", 500);
    }
  },

  async getCustomerById(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id);

      if (!customer) {
        throw new AppError("Customer not found", 404, "CONFLICT");
      }

      return customer;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Customer Create failed", 500);
    }
  },

  async updateCustomer(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) {
        throw new AppError("Customer not found", 404, "CONFLICT");
      }
      await customer.update(req.body);
      return customer;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Customer Create failed", 500);
    }
  },

  async deleteCustomer(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) {
        throw new AppError("Customer not found", 404, "CONFLICT");
      }
      const deleteCustomer = await customer.destroy();
      return deleteCustomer;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Customer Create failed", 500);
    }
  },
};
export default CustomerService;
