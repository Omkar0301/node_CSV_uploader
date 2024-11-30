const fs = require("fs");
const path = require("path");
const { parseCSV } = require("../services/csvProcessor");
const { downloadImage } = require("../services/imageDownloader");
const Product = require("../models/Product");

const IMAGE_DIR = path.join(__dirname, "../uploads/products");
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

const uploadCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No CSV file uploaded." });
    }

    const filePath = req.file.path;
    const products = await parseCSV(filePath);

    const success = [];
    const errors = [];

    for (const product of products) {
      try {
        const {
          "Product Name": name,
          Price: price,
          "Image URL": imageUrl,
          Category: category,
          Description: description,
          "Is Available": isAvailable,
        } = product;

        if (!name || !price || !imageUrl || !category) {
          throw new Error(
            "Missing required fields (name, price, imageUrl, category)."
          );
        }

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
          throw new Error(`Duplicate product: ${name}.`);
        }

        const imageFilename = `${Date.now()}-${name.replace(/\s+/g, "_")}.jpg`;
        const imagePath = path.join(IMAGE_DIR, imageFilename);
        await downloadImage(imageUrl, imagePath);

        const newProduct = new Product({
          name,
          price: parseFloat(price),
          image: `/uploads/products/${imageFilename}`,
          category,
          description,
          isAvailable: isAvailable?.toLowerCase() === "true",
        });
        await newProduct.save();
        success.push(`Product "${name}" created successfully.`);
      } catch (err) {
        errors.push(err.message);
      }
    }

    res.json({ success, errors });
  } catch (err) {
    next(err);
  }
};

const listProductsByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    const product = await Product.findById(id).select("-__v");
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

const listProducts = async (req, res, next) => {
  try {
    const { search, category, isAvailable, sort } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === "true";
    }

    let sortOptions = {};
    if (sort) {
      if (sort === "asc") {
        sortOptions.price = 1;
      } else if (sort === "desc") {
        sortOptions.price = -1;
      }
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
      .select("-__v");

    res.json(products);
  } catch (err) {
    next(err);
  }
};

const previewImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const imagePath = path.join(
      __dirname,
      "../uploads/products",
      product.image.split("/").pop()
    );
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ error: "Image not found." });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadCSV,
  listProducts,
  listProductsByID,
  previewImage,
};
