import Setting from "../models/setting.model.js";
import AppError from "../utils/AppError.js";

const settingService = {
  async getSettings(req) {
    try {
      let setting = await Setting.findOne();

      // Create default settings if not found
      if (!setting) {
        setting = await Setting.create({
          defaultDiscount: 0,
          labourCharge: 0,
          otherCharge: 0,
          vatPercentage: 0,
        });
      }

      return setting;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Setting get failed", 500);
    }
  },
  async updateSettings(req, res) {
    try {
      const { defaultDiscount, labourCharge, otherCharge, vatPercentage } =
        req.body;

      let setting = await Setting.findOne();

      if (!setting) {
        setting = await Setting.create({
          defaultDiscount: defaultDiscount || 0,
          labourCharge: labourCharge || 0,
          otherCharge: otherCharge || 0,
          vatPercentage: vatPercentage || 0,
        });
      } else {
        await setting.update({
          defaultDiscount,
          labourCharge,
          otherCharge,
          vatPercentage,
        });
      }

      return setting;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Setting Update failed", 500);
    }
  },
};

export default settingService;
