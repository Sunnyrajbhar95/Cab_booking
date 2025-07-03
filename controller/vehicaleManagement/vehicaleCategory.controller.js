import Vehicale from "../../Model/category/vehicaleCategory.model.js";
import SubVehicale from "../../Model/category/vehicaleSubcatory.model.js";

export const addVehicaleCategory = async (req, res) => {
  try {
    const { name,description } = req.body;
    if (!name || !description ) {
      return res.status(400).json({
        success: false,
        message: "Vehical name is required",
      });
    }
    if (!req?.file?.filename) {
      return res.status(400).json({
        success: false,
        message: "vehical image is required",
      });
    }
    const vahicale = await Vehicale.create({
      name,
      image: req?.file?.filename,
      description
    });

    return res.status(201).json({
      success: true,
      message: "Vehicale Category created successfully",
      vahicale,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};

export const addVehicaleSubcategory = async (req, res) => {
  try {
    const {
      categoryId,
      name,
      vehicleNumber,
      pricePerkm,
      pricePerHour,
      basePrice,
      isAllowed,
      comfortLevel,
      description
    } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Cateogry Id is required",
      });
    }

    if (
      !name ||
      !vehicleNumber ||
      !isAllowed ||
      !comfortLevel ||
      !description ||
      !(pricePerHour || pricePerkm || basePrice)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "(Name, Vehicle number, Price Per KM, Price Per Hour, Base Price,Is Allowed and Comfort Level ) is required",
      });
    }
    if (!req?.file?.filename) {
      return res.status(400).json({
        success: false,
        message: "Image is Required",
      });
    }

    const subVehicale = await SubVehicale.create({
      categoryId,
      comfortLevel,
      name,
      isAllowed,
      basePrice: basePrice || 0,
      pricePerHour: pricePerHour || 0,
      pricePerkm: pricePerkm || 0,
      vehicleNumber,
      image: req?.file?.filename,
      description
    });
    return res.status(201).json({
      success: true,
      message: "Vehicle Sub Category crrated successfully",
      subVehicale,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server Problem",
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const categories = await Vehicale.find({});
    return res.status(200).json({
      success: true,
      message: !categories.length
        ? " vehicle categories not found"
        : "Vehicle category found",
      categories,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internnal server problem",
    });
  }
};

export const getAllSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    console.log("hello")

    if (!categoryId)
      return res.status(400).json({
        success: false,
        message: "Category Id is required",
      });

    const category = await Vehicale.findById(categoryId);
    if (!category)
      return res.status(404).json({
        success: false,
        message: "category is not found",
      });

    const subcategory = await SubVehicale.find({ categoryId }).populate(
      "categoryId"
    );

    return res.status(200).json({
      success: true,
      message: !subcategory.length
        ? " vehicle categories not found"
        : "Vehicle category found",
      subcategory,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Problem",
    });
  }
};

export const updatesubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      vehicleNumber,
      pricePerkm,
      pricePerHour,
      basePrice,
      isAllowed,
      comfortLevel,
    } = req.body;
    if (!id)
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    const subcategory = await SubVehicale.findById(id);
    if (!subcategory)
      return res.status(404).json({
        success: false,
        message: "Vehicle sub-category not found",
      });
    subcategory.name = name || subcategory.name;
    subcategory.vehicleNumber = vehicleNumber || subcategory.vehicleNumber;
    subcategory.pricePerkm = pricePerkm || subcategory.pricePerkm;
    subcategory.pricePerHour = pricePerHour || subcategory.pricePerHour;
    subcategory.basePrice = basePrice || subcategory.basePrice;
    subcategory.isAllowed = isAllowed || subcategory.isAllowed;
    subcategory.comfortLevel = comfortLevel || subcategory.comfortLevel;
    subcategory.image = req?.file?.filename || subcategory.image;

    await subcategory.save();

    return res.status(200).json({
      success: true,
      message: "Vehicle sub categroy update successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!id)
      return res.status(404).json({
        success: false,
        message: "Id is Required",
      });

    const category = await Vehicale.findById(id);
    if (!category)
      return res.status(404).json({
        success: false,
        message: "Vehicle category not found",
      });

    if (name) category.name = name;
    if (req?.file?.filename) category.image = req?.file?.filename;
    await category.save();
    return res.status(200).json({
      success: true,
      message: "Vehicle category update",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server Problem",
    });
  }
};

export const deleteVechicleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    await SubVehicale.deleteMany({ categoryId: id });
    const vehicle = await Vehicale.findByIdAndDelete(id);
    if (!vehicle)
      return res.status(404).json({
        success: false,
        message: "vehicle category is not found",
      });

    return res.status(200).json({
      success: true,
      message: "vehicle category is deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};

export const deleteSubVehicleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
     return res.status(400).json({
        success: false,
        message: "Id is required",
      });

    const subVehicale = await SubVehicale.findByIdAndDelete(id);
    if (!subVehicale)
      return res.status(404).json({
        success: false,
        message: "Sub vehicle is not found",
      });
    return res.status(200).json({
      success: true,
      message: "Sub vehicle deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server problem ",
    });
  }
};
