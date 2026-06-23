import settingService from "../service/SettingService.js";

export const getSettings = async (req, res) => {
  try {
    const result = await settingService.getSettings(req, res);
    return res.status(201).json({
      success: true,
      message: "fetch data successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const result = await settingService.updateSettings(req, res);
    return res.status(201).json({
      success: true,
      message: "update data successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
