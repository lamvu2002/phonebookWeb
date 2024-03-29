import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "../api/axios";
import { axiosPrivate } from "../api/axios";
import { Toaster, toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
const AddCategoryModal = ({ categories, onAddCategory }) => {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const [categoryData, setCategoryData] = useState({
    categoryId: 0,
    categoryName: "",
  });
  useEffect(() => {
    if (categories.length > 0) {
      // Find the largest categoryId from the categories prop
      const largestCategoryId = Math.max(
        ...categories.map((category) => category.categoryId)
      );

      // Set the categoryId to the largestCategoryId + 1
      setCategoryData((prevData) => ({
        ...prevData,
        categoryId: largestCategoryId + 1,
      }));
    }
  }, [categories]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      categoryName: value,
    }));
  };
  const handleAddCategory = async () => {
    try {
      const response = await axiosPrivate.post(
        "/api/Categories",
        JSON.stringify(categoryData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      const reload = await axios.get("/api/Categories"); // Replace with your endpoint
      onAddCategory(reload.data);
      toast.success(
        "Category added successfully: " + response.data.categoryName
      );
    } catch (error) {
      toast.error("Failed to add category: " + error);
      // Handle the error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Set categoryId in categoryData to the largest categoryId + 1

    // Perform API call to add the new category using the categoryData state
    handleAddCategory();
    // Reset the form inputs
    setCategoryData({
      categoryId: 0,
      categoryName: "",
    });

    // Close the modal
    handleClose();
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solId white",
    boxShadow: 24,
    p: 4,
  };
  const isFormValid = categoryData.categoryName !== "";
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
          <div className="ps-4 pe-5 py-1">Add new category</div>
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <div className="modal-header d-flex justify-content-between align-items-center mb-3">
            <h5 className="modal-title">Add new category</h5>
            <Button className="btn-close" onClick={handleClose}></Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 w-75">
              <label>Category Name:</label>
              <input
                type="text"
                className="form-control mt-2"
                name="name"
                value={categoryData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Button type="submit" disabled={!isFormValid}>
                Add Category
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
export default AddCategoryModal;
