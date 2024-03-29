import Button from "@mui/material/Button";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Toaster, toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { axiosPrivate } from "../api/axios";
import axios from "../api/axios";

const EditCategoryModal = ({ categories, onEditCategory }) => {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryData, setCategoryData] = useState({
    categoryId: 0,
    categoryName: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    setCategoryData({ categoryId: 0, categoryName: "" });
  };

  const handleCategorySelect = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);

    if (category) {
      setSelectedCategory(category);
      setCategoryData({ ...category });
    }
  };

  const handleCategoryNameChange = (e) => {
    setCategoryData((prevState) => ({
      ...prevState,
      categoryName: e.target.value,
    }));
  };

  const handleEditCategory = async () => {
    try {
      // Make the API request to update the category
      await axiosPrivate.put(
        `/api/Categories/${categoryData.categoryId}`,
        JSON.stringify(categoryData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      // Call the callback function to update the categories in the parent component
      const reloadCategory = await axios.get("/api/Categories"); // Replace with your endpoint
      onEditCategory(reloadCategory.data);
      toast.success("Category edited successfully!");
      handleClose();
    } catch (error) {
      toast.error("Failed to edit category: " + error);
      // Handle the error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditCategory();
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid white",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <Toaster position="top-center" />
      <div className="button-container">
        <Button
          className="text-primary-emphasis"
          onClick={handleOpen}
          sx={{
            padding: 0,
            justifyContent: "flex-start",
            width: "100%",
            boxSizing: "border-box",
            minWidth: 0,
            position: "relative",
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: 1.5,
            letterSpacing: "0.00938em",
            textTransform: "none",
          }}
        >
          <div className="ps-4 pe-5 py-1">Edit category</div>
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <div className="modal-header d-flex justify-content-between align-items-center mb-3">
            <h5 className="modal-title">Edit Category</h5>
            <Button className="btn-close" onClick={handleClose}></Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-2 w-75">
              <label>Category:</label>
              <select
                className="form-select mt-2"
                value={categoryData.categoryId}
                onChange={(e) => handleCategorySelect(Number(e.target.value))}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3 w-75">
              <label>Category Name:</label>
              <input
                type="text"
                className="form-control mt-2"
                value={categoryData.categoryName}
                onChange={handleCategoryNameChange}
                disabled={!selectedCategory}
              />
            </div>
            <div>
              <Button disabled={!selectedCategory} type="submit">
                Edit category
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default EditCategoryModal;
