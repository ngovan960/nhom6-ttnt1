import db from "../model/index.js";

const { Category } = db;

// GET /api/categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        return res.json({ data: categories });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};

// POST /api/categories
export const createCategory = async (req, res) => {
    try {
        const { name, description, parent_id } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const newCategory = await Category.create({ name, description, parent_id });
        return res.status(201).json({ message: "Category created", data: newCategory });
    } catch (error) {
        return res.status(500).json({ message: "Error creating category", error: error.message });
    }
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, parent_id } = req.body;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await category.update({ name, description, parent_id });
        return res.json({ message: "Category updated", data: category });
    } catch (error) {
        return res.status(500).json({ message: "Error updating category", error: error.message });
    }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await category.destroy();
        return res.json({ message: "Category deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting category", error: error.message });
    }
};
