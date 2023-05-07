import categoryModel from '../models/categoryModel.js';
import slugify from 'slugify';

export const categoryController = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(401).send({ message: 'Name is required' });
    }

    const exisitingCategory = await categoryModel.findOne({ name });

    if (exisitingCategory) {
      return res
        .status(200)
        .send({ success: true, message: 'Category already exists' });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    res
      .status(200)
      .send({ success: true, message: 'Category created', category });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, message: 'Error in create category' });
  }
};

export const categoryUpdateController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (err) {
    console.error(err);
    console.error(err);
    res
      .status(500)
      .send({ success: false, message: 'Error in update category' });
  }
};

export const getAllCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res
      .status(200)
      .send({ success: true, message: 'All Category List', category });
  } catch (err) {
    console.log(err);
    console.error(err);
    res.status(500).send({ success: false, message: 'Error in all category' });
  }
};

export const getSingleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res
      .status(200)
      .send({ success: true, message: 'Single Category List', category });
  } catch (err) {
    console.log(err);
    console.error(err);
    res
      .status(500)
      .send({ success: false, message: 'Error in single category' });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: 'Category deleted succesfully',
      category,
    });
  } catch (err) {
    console.log(err);
    console.error(err);
    res
      .status(500)
      .send({ success: false, message: 'Error in delete category' });
  }
};
