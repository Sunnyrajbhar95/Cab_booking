import Driver from "../../Model/driver/driver.model.js";

export const addDriver = async (req, res) => {
  try {
    const {
      name,
      email,
      mobileNumber,
      isAllowed,
      vehicleType,
      maxExprience,
      minExprience,
      pricePerDay,
      priceHr,
      licenceExpiryDate,
      licenceNumber,
    } = req.body;

    if (
      !name ||
      !email ||
      !mobileNumber ||
      !isAllowed ||
      !vehicleType ||
      !maxExprience ||
      !minExprience ||
      !licenceNumber ||
      !licenceExpiryDate ||
      !(pricePerDay || priceHr)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All mandatory fields like Name, Contact, Vehicle Type, Licence, Pricing, and Experience are required",
      });
    }

    // console.log(req?.files["licence"])
    if (!req?.files["licence"]) {
      return res.status(400).json({
        success: false,
        message: "Licence image is required",
      });
    }
    let profilePicture = null;
    if (req?.files["profilePicture"]) {
      console.log("hello");
      profilePicture = req?.files["profilePicture"][0]?.filename;
    }

    const driver = await Driver.create({
      name,
      email,
      mobileNumber,
      priceHr,
      pricePerDay,
      minExprience,
      maxExprience,
      isAllowed,
      licenceNumber,
      licenceExpiryDate,
      profilePicture,
      vehicleType,
      licenceImage: req.files["licence"][0]?.filename,
    });

    return res.status(200).json({
      success: true,
      message: "Driver added successfully",
      driver,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server Problem",
      error: err.message,
    });
  }
};

export const getAllDriver = async (req, res) => {
  try {
    const drivers = await Driver.find({});

    return res.status(200).json({
      success: true,
      message: drivers.length
        ? "Driver found successfully"
        : "Driver not found",
      drivers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server Problem",
      error: err.message,
    });
  }
};

export const getSingleDriver = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });

    const driver = await Driver.findById(id);
    if (!driver)
      return res.status(404).json({
        success: false,
        message: "driver not found",
      });

    return res.status(200).json({
      success: true,
      message: "driver found successfully",
      driver,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server Problem",
      error: err.message,
    });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });

    const driver = await Driver.findByIdAndDelete(id);
    if (!driver)
      return res.status(404).json({
        success: false,
        message: "driver not found",
      });

    return res.status(200).json({
      success: true,
      message: "driver deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server Problem",
      error: err.message,
    });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      mobileNumber,
      maxExprience,
      minExprience,
      pricePerDay,
      priceHr,
    } = req.body;
    if (!id)
      return res.status(400).json({
        success: false,
        message: "Id is required ",
      });
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    if (name) driver.name = name;
    if (email) driver.email = email;
    if (mobileNumber) driver.mobileNumber = mobileNumber;
    if (minExprience) driver.minExprience = minExprience;
    if (maxExprience) driver.maxExprience = maxExprience;
    if (pricePerDay) driver.pricePerDay = pricePerDay;
    if (priceHr) driver.priceHr = priceHr;
    if (req?.files["profilePicture"])
      driver.profilePicture = req?.files["profilePicture"][0]?.filename;
    if (req?.files["licence"])
      driver.licenceImage = req.files["licence"][0]?.filename;

    await driver.save();

    return res.status(200).json({
      success: true,
      message: "driver updated successfully",
      driver,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server problem",
      error: err.message,
    });
  }
};
