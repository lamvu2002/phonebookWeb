import Button from "@mui/material/Button";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "../api/axios";
import { axiosPrivate } from "../api/axios";
import { Toaster, toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
const DeleteCategoryModal = ({
  categories,
  subcategories,
  contacts,
  onDeleteCategory,
  onDeleteSubcategory,
  onDeleteContact,
}) => {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const [categoryId, setCategoryId] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setCategoryId(0);
    setOpen(false);
  };
  const handleInputChange = (e) => {
    const { value } = e.target;
    setCategoryId(parseInt(value));
  };
  const handleDeleteCategory = async () => {
    try {
      // Delete all subcategories belonging to the chosen category
      // Delete all contacts belonging to the selected category
      const contactsToDelete = contacts.filter(
        (contact) => contact.categoryId === parseInt(categoryId)
      );
      for (const contact of contactsToDelete) {
        await axiosPrivate.delete(`api/Contacts/${contact.contactId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
      }
      for (const subcategory of subcategories) {
        if (subcategory.categoryId === parseInt(categoryId)) {
          await axiosPrivate.delete(
            `api/Subcategories/${subcategory.subcategoryId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.accessToken}`,
              },
            }
          );
        }
      }
      await axiosPrivate.delete(`api/Categories/${categoryId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      const reloadCategory = await axios.get("/api/Categories"); // Replace with your endpoint
      onDeleteCategory(reloadCategory.data);
      const reloadSubcategory = await axios.get("/api/Subcategories"); // Replace with your endpoint
      onDeleteSubcategory(reloadSubcategory.data);
      const reloadContact = await axios.get("/api/Contacts"); // Replace with your endpoint
      onDeleteContact(reloadContact.data);
      handleClose();
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete Category: " + error);
      // Handle the error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform API call to add the new category using the categoryData state
    handleDeleteCategory();
    // Reset the form inputs
    setCategoryId(0);

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
  const isFormValid = categoryId !== 0;
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
          <div className="ps-4 pe-5 py-1">Delete category</div>
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <div className="modal-header d-flex justify-content-between align-items-center mb-3">
            <h5 className="modal-title">Delete category</h5>
            <Button className="btn-close" onClick={handleClose}></Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 w-75">
              <label>Category Name:</label>
              <select
                className="form-select mt-2"
                name="name"
                value={categoryId}
                onChange={handleInputChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
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
export default DeleteCategoryModal;
