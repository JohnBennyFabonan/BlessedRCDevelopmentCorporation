const Property = require("../models/propertyModel");
const Appointment = require("../models/appointmentModel");

// ================== CREATE PROPERTY ==================
exports.createProperty = async (req, res) => {
  try {
    const images = req.files?.images
      ? req.files.images.map(file => file.location)
      : [];

    const availabilityImage = req.files?.availability_image?.[0]
      ? req.files.availability_image[0].location
      : null;

    const data = {
      ...req.body,
      images: JSON.stringify(images),
      availability_image: availabilityImage,
      created_by: Number(req.body.created_by) || null
    };

    const newProp = await Property.create(data);

    res.status(201).json({
      success: true,
      data: newProp
    });

  } catch (err) {
    console.error("CREATE PROPERTY ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Failed to create property"
    });
  }
};

// ================== GET ALL PROPERTIES ==================
exports.getAllProperties = async (req, res) => {
  try {
    const result = await Property.getAll();
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("GET ALL PROPERTIES ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Failed to load properties"
    });
  }
};

// ================== GET PROPERTY BY ID ==================
exports.getPropertyById = async (req, res) => {
  try {
    const result = await Property.getById(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Property not found"
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("GET PROPERTY ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Failed to get property"
    });
  }
};

// ================== UPDATE PROPERTY (FIXED) ==================
exports.updateProperty = async (req, res) => {
  try {
    const data = { ...req.body };

    // ❌ REMOVED availability logic (column does not exist)

    if (req.files?.images?.length) {
      data.images = JSON.stringify(
        req.files.images.map(f => f.location)
      );
    }

    if (req.files?.availability_image?.[0]) {
      data.availability_image = req.files.availability_image[0].location;
    }

    const updated = await Property.update(req.params.id, data);

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {
    console.error("UPDATE PROPERTY ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Update failed"
    });
  }
};

// ================== DELETE PROPERTY (SAFE & FINAL) ==================
exports.deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;

    // 1️⃣ Check if property exists
    const property = await Property.getById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: "Property not found"
      });
    }

    // 2️⃣ Prevent delete if there are appointments
    const appointmentCount = await Appointment.countByProperty(propertyId);
    if (appointmentCount > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete property with existing appointments."
      });
    }

    // 3️⃣ Delete from database ONLY
    await Property.delete(propertyId);

    res.json({
      success: true,
      message: "Property deleted successfully"
    });

  } catch (err) {
    console.error("DELETE PROPERTY ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to delete property"
    });
  }
};
