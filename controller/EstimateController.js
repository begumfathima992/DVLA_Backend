import estimateService from "../service/EstimateService.js";

export const createEstimate = async (req, res) => {
  try {
    const estimates = await estimateService.createEstimate(req, res);
    return res.status(201).json({
      success: true,
      message: "Estimate created",
      data: estimates,
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
    const estimates = await estimateService.getEstimates(req, res);

    return res.status(200).json({
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
    const estimate = await estimateService.getEstimateById(req, res);
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
    const estimate = await estimateService.updateEstimate(req, res);
    return res.status(200).json({
      success: true,
      message: "Estimate updated successfully",
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
    const estimate = await estimateService.deleteEstimate(req, res);
    return res.json({
      success: true,
      message: "Estimate deleted",
      data: estimate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateStatusEstimate = async (req, res) => {
  try {
    const estimate = await estimateService.updateStatusEstimate(req, res);
    return estimate;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
