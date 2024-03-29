import Button from "@mui/material/Button";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "../api/axios";
import { axiosPrivate } from "../api/axios";
import { Toaster, toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
const DeleteSubcategoryModal = ({
  categories,
  subcategories,
  contacts,
  onDeleteSubcategory,
  onDeleteContact,
}) => {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const [categoryId, setCategoryId] = useState(0);
  const [subcategoryId, setSubcategoryId] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setCategoryId(0);
    setSubcategoryId(0);
    setOpen(false);
  };
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setCategoryId(value);
    setSubcategoryId(0); // Reset subcategory selection when category changes
  };
  const handleSubcategoryChange = (e) => {
    const { value } = e.target;
    setSubcategoryId(value);
  };

  const handleDeleteSubcategory = async () => {
    try {
      // Delete all contacts belonging to the subcategory
      const contactsToDelete = contacts.filter(
        (contact) => contact.subcategoryId === parseInt(subcategoryId)
      );
      for (const contact of contactsToDelete) {
        await axiosPrivate.delete(`api/Contacts/${contact.contactId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
      }
      await axiosPrivate.delete(`api/Subcategories/${subcategoryId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      const reloadSubcategory = await axios.get("/api/Subcategories"); // Replace with your endpoint
      onDeleteSubcategory(reloadSubcategory.data);
      const reloadContact = await axios.get("/api/Contacts"); // Replace with your endpoint
      onDeleteContact(reloadContact.data);
      handleClose();
      toast.success("Subcategory deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete Subcategory: " + error);
      // Handle the error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleDeleteSubcategory();
    setCategoryId(0);
    setSubcategoryId(0);
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

  const filteredSubcategories = subcategories.filter(
    (subcategory) => subcategory.categoryId === parseInt(categoryId)
  );
  const isFormValid = categoryId !== 0 && subcategoryId !== 0;

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
          <div className="ps-4 pe-4 py-1">Delete subcategory</div>
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <div className="modal-header d-flex justify-content-between align-items-center mb-3">
            <h5 className="modal-title">Delete subcategory</h5>
            <Button className="btn-close" onClick={handleClose}></Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 w-75">
              <label>Category:</label>
              <select
                className="form-select mt-2"
                name="category"
                value={categoryId}
                onChange={handleCategoryChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3 w-75">
              <label>Subcategory:</label>
              <select
                className="form-select mt-2"
                name="subcategory"
                value={subcategoryId}
                onChange={handleSubcategoryChange}
                disabled={!categoryId}
              >
                <option value="">Select a subcategory</option>
                {filteredSubcategories.map((subcategory) => (
                  <option
                    key={subcategory.subcategoryId}
                    value={subcategory.subcategoryId}
                  >
                    {subcategory.subcategoryName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button type="submit" disabled={!isFormValid}>
                Delete
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default DeleteSubcategoryModal;
