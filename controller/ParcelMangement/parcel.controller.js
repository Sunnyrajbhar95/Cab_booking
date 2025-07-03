import ParcelCategory from "../../Model/parcel/parcelCategory.model.js";
import ParcelSubcategory from "../../Model/parcel/parcelSubcategory.model.js";

export const addParcelCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({
        success: false,
        message: "name is required",
      });
    if (!req?.file?.filename)
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });

    const newName = name.trim();
    const existCategory = await ParcelCategory.findOne({ name: newName });
    if (existCategory)
      return res.status(409).json({
        success: false,
        message: "Category with this name is already present",
      });

    const parcel = await ParcelCategory.create({
      name,
      image: req?.file?.filename,
    });

    return res.status(201).json({
      success: true,
      message: "Parcel category created",
      parcel,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Problem",
    });
  }
};

export const getAllParcelCategory = async (req, res) => {
  try {
    const parcels = await ParcelCategory.find({});
    return res.status(200).json({
      success: true,
      message: !parcels.length
        ? "Parcel category not found"
        : "Parcel category found",
      parcels,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};

export const deleteParcelCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Id is required" });

    await ParcelSubcategory.deleteMany({ categoryId: id });
    const parcel = await ParcelCategory.findByIdAndDelete(id);
    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel Not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Parcel Categry deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal sever problem",
    });
  }
};

export const updateParcelCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!id)
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    const parcel = await ParcelCategory.findById(id);
    if (!parcel)
      return res.status(404).json({
        success: false,
        message: "Parcel not found",
      });

    if (name) parcel.name = name;
    if (req?.file?.filename) parcel.image = req?.file.filename;

    await parcel.save();

    return res.status(200).json({
      success: true,
      message: "Parcel category updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};

export const addParcelSubcategory = async (req, res) => {
  try {
    const {
      name,
      basePrice,
      isAllowed,
      minWeight,
      maxWeight,
      categoryId,
      deliveryOptions,
    } = req.body;

    // Convert deliveryOptions to object if it's a string (from multipart/form-data)
    let parsedDeliveryOptions = deliveryOptions;
    if (typeof deliveryOptions === "string") {
      try {
        parsedDeliveryOptions = JSON.parse(deliveryOptions);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON in deliveryOptions",
        });
      }
    }

    const errors = [];

    if (!name) errors.push("Name is required");
    if (!basePrice) errors.push("Base price is required");
    if (!isAllowed) errors.push("Booking type (isAllowed) is required");
    if (minWeight === undefined || minWeight === null)
      errors.push("Minimum weight is required");
    if (maxWeight === undefined || maxWeight === null)
      errors.push("Maximum weight is required");
    if (!categoryId) errors.push("Category ID is required");
    if (
      !Array.isArray(parsedDeliveryOptions) ||
      parsedDeliveryOptions.length === 0
    ) {
      errors.push("At least one delivery option is required");
    } else {
      parsedDeliveryOptions.forEach((opt, index) => {
        if (!opt.type)
          errors.push(`Delivery option ${index + 1}: Type is required`);
        if (!opt.pricePerKm)
          errors.push(`Delivery option ${index + 1}: Price per km is required`);
        if (!opt.estimatedTime)
          errors.push(
            `Delivery option ${index + 1}: Estimated time is required`
          );
      });
    }

    if (!req?.file?.filename) {
      errors.push("Image is required");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const subparcel = await ParcelSubcategory.create({
      categoryId,
      name,
      basePrice,
      isAllowed,
      minWeight,
      maxWeight,
      image: req.file.filename,
      deliveryOptions: parsedDeliveryOptions,
    });

    return res.status(201).json({
      success: true,
      message: "Parcel sub-category created successfully",
      subparcel,
    });
  } catch (err) {
    console.error("Error in addParcelSubcategory:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getAllSubParcel = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Id is required" });

    const parcel = await ParcelCategory.findById(id);
    if (!parcel)
      return res.status(404).json({
        success: false,
        message: "Parcel not found",
      });
    const subparcels = await ParcelSubcategory.find({ categoryId: id });
    return res.status(200).json({
      success: true,
      message: !subparcels.length
        ? "Parcel sub category not found"
        : "Parcel sub category found",
      subparcels,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};

export const deleteSubParcelCatgory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Id is required" });

    const parcel = await ParcelSubcategory.findByIdAndDelete(id);
    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel Not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Parcel sub Categry deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server problem",
    });
  }
};


export const updateParcelSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      basePrice,
      isAllowed,
      minWeight,
      maxWeight,
      categoryId,
      deliveryOptions,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Subcategory ID is required",
      });
    }

    
    const subparcel = await ParcelSubcategory.findById(id);
    if (!subparcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel subcategory not found",
      });
    }
    let parsedDeliveryOptions = deliveryOptions;
    if (typeof deliveryOptions === "string") {
      try {
        parsedDeliveryOptions = JSON.parse(deliveryOptions);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON in deliveryOptions",
        });
      }
    }

    const errors = [];

    if (!name) errors.push("Name is required");
    if (!basePrice) errors.push("Base price is required");
    if (!isAllowed) errors.push("Booking type (isAllowed) is required");
    if (minWeight === undefined || minWeight === null)
      errors.push("Minimum weight is required");
    if (maxWeight === undefined || maxWeight === null)
      errors.push("Maximum weight is required");
    if (!categoryId) errors.push("Category ID is required");

    if (
      !Array.isArray(parsedDeliveryOptions) ||
      parsedDeliveryOptions.length === 0
    ) {
      errors.push("At least one delivery option is required");
    } else {
      parsedDeliveryOptions.forEach((opt, index) => {
        if (!opt.type)
          errors.push(`Delivery option ${index + 1}: Type is required`);
        if (!opt.pricePerKm)
          errors.push(
            `Delivery option ${index + 1}: Price per km is required`
          );
        if (!opt.estimatedTime)
          errors.push(
            `Delivery option ${index + 1}: Estimated time is required`
          );
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    subparcel.name = name;
    subparcel.basePrice = basePrice;
    subparcel.isAllowed = isAllowed;
    subparcel.minWeight = minWeight;
    subparcel.maxWeight = maxWeight;
    subparcel.categoryId = categoryId;
    subparcel.deliveryOptions = parsedDeliveryOptions;

    if (req?.file?.filename) {
      subparcel.image = req.file.filename;
    }

    await subparcel.save();

    return res.status(200).json({
      success: true,
      message: "Parcel sub-category updated successfully",
      subparcel,
    });
  } catch (err) {
    console.error("Error in updateParcelSubcategory:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
