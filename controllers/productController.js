import slugify from 'slugify';
import productModel from '../models/productModel.js';
import categoryModel from '../models/categoryModel.js';
import orderModel from '../models/orderModel.js';
import dotenv from 'dotenv';
import braintree from 'braintree';

import fs from 'fs';
dotenv.config();
//payment gateway

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ message: 'Name is required' });
      case !description:
        return res.status(500).send({ message: 'description is required' });
      case !category:
        return res.status(500).send({ message: 'category is required' });
      case !quantity:
        return res.status(500).send({ message: 'quantity is required' });
      case !price:
        return res.status(500).send({ message: 'price is required' });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ message: 'photo is required and less than 1 mb' });
    }
    const products = await productModel({
      ...req.fields,
      slug: slugify(name),
    });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();

    res.status(201).send({
      success: true,
      message: 'Product createe successfully',
      products,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, err, message: 'Error creating product' });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate('category')
      .select('-photo')
      .limit(12)
      .sort({ crearedAt: -1 });

    res.status(201).send({
      success: true,
      message: 'Products',
      products,
      total: products.length,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, err, message: 'Error getting product' });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .find({ slug: req.params.slug })
      .populate('category')
      .select('-photo');

    res.status(201).send({
      success: true,
      message: 'Product',
      product,
      total: product.length,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, err, message: 'Error getting product' });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).select('photo');

    if (product.photo.data) {
      res.set('Content-type', product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }

    res.status(201).send({
      success: true,
      message: 'Products',
      product,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, err, message: 'Error getting photo' });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel
      .findByIdAndDelete(req.params.id)
      .select('-photo');

    res.status(201).send({
      success: true,
      message: 'Product Deleted successfully',
      product,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, err, message: 'Error deleting product' });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ message: 'Name is required' });
      case !description:
        return res.status(500).send({ message: 'description is required' });
      case !category:
        return res.status(500).send({ message: 'category is required' });
      case !quantity:
        return res.status(500).send({ message: 'quantity is required' });
      case !price:
        return res.status(500).send({ message: 'price is required' });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ message: 'photo is required and less than 1 mb' });
    }

    console.log(req.params);
    const products = await productModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();

    res.status(201).send({
      success: true,
      message: 'Product updated successfully',
      products,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, err, message: 'Error updating product' });
  }
};

// filters

export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};

    if (checked.length) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel.find(args);

    res
      .status(200)
      .send({ message: 'Filtered products', products, success: true });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: 'Error in filtering product', success: false, err });
  }
};

// product count

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res
      .status(200)
      .send({ success: true, total, message: 'Total product count' });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: 'Error in count product', success: false, err });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 6;

    const page = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .select('-photo')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res
      .status(200)
      .send({ success: true, products, messages: 'Paginated products' });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: 'Error in page product', success: false, err });
  }
};

export const productSearchController = async (req, res) => {
  try {
    const { keyword } = req.params;

    const product = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      })
      .select('-photo');

    res.json(product);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: 'Error in search product', success: false, err });
  }
};

export const productSimilarController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const product = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select('-photo')
      .limit(3)
      .populate('category');

    res
      .status(200)
      .send({ success: true, message: 'Similar products', product });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: 'Error in similar product', success: false, err });
  }
};

export const productCategoryController = async (req, res) => {
  try {
    const { category } = req.params;

    const categories = await categoryModel.findOne({
      slug: category,
    });

    const product = await productModel
      .find({ category: categories })
      .populate('category');

    res.status(200).send({
      success: true,
      message: 'Category wise products',
      product,
      categories,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: 'Error in category wise product', success: false, err });
  }
};

//payment

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(response);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Error in Payment token Processing',
      success: false,
      err,
    });
  }
};

// braintreePaymentController

export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nounce } = req.body;

    let total = 0;

    cart.map((item) => {
      total += Number(item.price);
    });

    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nounce,
        options: {
          submitForSettlement: true,
        },
      },
      function (err, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();

          res.json({ ok: true });
        } else {
          res.status(500).send(err);
        }
      }
    );
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: 'Error in Payment Processing', success: false, err });
  }
};
