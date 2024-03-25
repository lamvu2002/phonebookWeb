import Button from "@mui/material/Button";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Toaster, toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { axiosPrivate } from "../api/axios";
import axios from "../api/axios";

const EditSubcategoryModal = ({
  subcategories,
  categories,
  onEditSubcategory,
}) => {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [subcategoryData, setSubcategoryData] = useState({
    subcategoryId: 0,
    categoryId: 0,
    subcategoryName: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSubcategoryData({
      subcategoryId: 0,
      categoryId: 0,
      subcategoryName: "",
    });
  };

  const handleCategorySelect = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);

    if (category) {
      setSelectedCategory(category);
      setSelectedSubcategory(null);
      setSubcategoryData({
        subcategoryId: 0,
        categoryId: category.categoryId,
        subcategoryName: "",
      });
    }
  };

  const handleSubcategorySelect = (subcategoryId) => {
    const subcategory = subcategories.find(
      (subcat) => subcat.subcategoryId === subcategoryId
    );

    if (subcategory) {
      setSelectedSubcategory(subcategory);
      setSubcategoryData({ ...subcategory });
    }
  };

  const handleSubcategoryNameChange = (e) => {
    setSubcategoryData((prevState) => ({
      ...prevState,
      subcategoryName: e.target.value,
    }));
  };

  const handleEditSubcategory = async () => {
    try {
      // Make the API request to update the subcategory
      await axiosPrivate.put(
        `/api/Subcategories/${subcategoryData.subcategoryId}`,
        JSON.stringify(subcategoryData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      // Call the callback function to update the subcategories in the parent component
      const reloadSubcategories = await axios.get("/api/Subcategories"); // Replace with your endpoint
      onEditSubcategory(reloadSubcategories.data);
      toast.success("Subcategory edited successfully!");
      handleClose();
    } catch (error) {
      toast.error("Failed to edit subcategory: " + error);
      // Handle the error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditSubcategory();
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
          <div className="ps-3">Edit subcategory</div>
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <div className="modal-header d-flex justify-content-between align-items-center mb-3">
            <h5 className="modal-title">Edit Subcategory</h5>
            <Button className="btn-close" onClick={handleClose}></Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-2 w-75">
              <label>Category:</label>
              <select
                className="form-select mt-2"
                value={selectedCategory ? selectedCategory.categoryId : ""}
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
            <div className="mb-2 w-75">
              <label>Subcategory:</label>
              <select
                className="form-select mt-2"
                value={
                  selectedSubcategory ? selectedSubcategory.subcategoryId : ""
                }
                onChange={(e) =>
                  handleSubcategorySelect(Number(e.target.value))
                }
                disabled={!selectedCategory}
              >
                <option value="">Select subcategory</option>
                {subcategories
                  .filter(
                    (subcategory) =>
                      subcategory.categoryId ===
                      (selectedCategory ? selectedCategory.categoryId : "")
                  )
                  .map((subcategory) => (
                    <option
                      key={subcategory.subcategoryId}
                      value={subcategory.subcategoryId}
                    >
                      {subcategory.subcategoryName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-2 w-75">
              <label>New Subcategory Name:</label>
              <input
                type="text"
                className="form-control mt-2"
                value={subcategoryData.subcategoryName}
                onChange={handleSubcategoryNameChange}
                disabled={!selectedSubcategory}
              />
            </div>
            <div>
              <Button type="submit" disabled={!selectedSubcategory}>
                Edit subcategory
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default EditSubcategoryModal;
