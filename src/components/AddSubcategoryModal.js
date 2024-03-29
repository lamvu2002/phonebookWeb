import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "../api/axios";
import { axiosPrivate } from "../api/axios";
import { Toaster, toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const AddSubcategoryModal = ({
  subcategories,
  categories,
  onAddSubcategory,
}) => {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const [subcategoryData, setSubcategoryData] = useState({
    subcategoryId: 0,
    categoryId: 0,
    subcategoryName: "",
  });
  useEffect(() => {
    if (subcategories.length > 0) {
      const largestSubcategoryId = Math.max(
        ...subcategories.map((subcategory) => subcategory.subcategoryId)
      );
      setSubcategoryData((prevData) => ({
        ...prevData,
        subcategoryId: largestSubcategoryId + 1,
      }));
    }
  }, [subcategories]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setSubcategoryData((prevData) => ({
      ...prevData,
      categoryId: 0,
      subcategoryName: "",
    }));
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubcategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddSubcategory = async () => {
    try {
      const response = await axiosPrivate.post(
        "/api/Subcategories",
        JSON.stringify(subcategoryData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      const reload = await axios.get("/api/Subcategories"); // Replace with your endpoint
      onAddSubcategory(reload.data);
      toast.success(
        "Subcategory added successfully: " + response.data.subcategoryName
      );
    } catch (error) {
      toast.error("Failed to add subcategory: " + error);
      // Handle the error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddSubcategory();
    setSubcategoryData({
      subcategoryId: 0,
      categoryId: 0,
      subcategoryName: "",
    });
    handleClose();
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
  const isFormValid =
    subcategoryData.subcategoryName !== "" && subcategoryData.categoryId !== 0;
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
          <div className="ps-4 pe-4 py-1">Add new subcategory</div>
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <div className="modal-header d-flex justify-content-between align-items-center mb-3">
            <h5 className="modal-title">Add new subcategory</h5>
            <Button className="btn-close" onClick={handleClose}></Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-2 w-75">
              <label>Category:</label>
              <select
                className="form-select mt-2"
                name="categoryId"
                value={subcategoryData.categoryId}
                onChange={handleInputChange}
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
              <label>Subcategory Name:</label>
              <input
                type="text"
                className="form-control mt-2"
                name="subcategoryName"
                value={subcategoryData.subcategoryName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Button type="submit" disabled={!isFormValid}>
                Add Subcategory
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AddSubcategoryModal;
