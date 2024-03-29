import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import axios from "../api/axios";
import { axiosPrivate } from "../api/axios";
import { Toaster, toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
const AddContactModal = ({ categories, subcategories, onAddContact }) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const { auth } = useAuth();
  const [contactData, setContactData] = useState({
    name: "",
    emailAddress: "",
    phoneNumber: "",
    address: "",
    categoryId: 0,
    subcategoryId: 0,
    imageLink: "",
  });
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setContactData({
      name: "",
      emailAddress: "",
      phoneNumber: "",
      address: "",
      categoryId: 0,
      subcategoryId: 0,
      imageLink: "",
    });
    setSelectedCategory(null);
    setOpen(false);
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    setContactData((prevData) => ({
      ...prevData,
      categoryId: parseInt(selectedCategoryId),
      subcategoryId: "",
    }));
  };
  const handleSubcategoryChange = (e) => {
    const selectedSubcategoryId = e.target.value;
    setContactData((prevData) => ({
      ...prevData,
      subcategoryId: parseInt(selectedSubcategoryId),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAddContact = async () => {
    try {
      const response = await axiosPrivate.post(
        "/api/Contacts",
        JSON.stringify(contactData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      toast.success("Contact added successfully: " + response.data.name);
      const reload = await axios.get("/api/Contacts"); // Replace with your endpoint
      onAddContact(reload.data);
    } catch (error) {
      toast.error("Failed to add contact: " + error);
      // Handle the error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Set contactId in contactData to the largest contactId + 1

    // Perform API call to add the new contact using the contactData state
    handleAddContact();
    // Reset the form inputs
    setContactData({
      name: "",
      emailAddress: "",
      phoneNumber: "",
      address: "",
      categoryId: 0,
      subcategoryId: 0,
      imageLink: "",
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
  const isFormValid =
    contactData.name &&
    contactData.emailAddress &&
    contactData.phoneNumber &&
    contactData.address &&
    contactData.categoryId &&
    contactData.subcategoryId &&
    contactData.imageLink;
  return (
    <div>
      <Toaster position="top-center" />
      <div className="button-container">
        <Button
          className="text-primary-emphasis "
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
          <div className="ps-4 pe-5 py-1">Add new contact</div>
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <div className="modal-header d-flex justify-content-between align-items-center mb-3">
            <h5 className="modal-title">Add new contact</h5>
            <Button
              className="btn-close"
              onClick={() => handleClose()}
            ></Button>
          </div>
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={contactData.name}
              onChange={handleInputChange}
            />

            <label>Email:</label>
            <input
              type="email"
              name="emailAddress"
              value={contactData.emailAddress}
              onChange={handleInputChange}
            />

            <label>Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={contactData.phoneNumber}
              onChange={handleInputChange}
            />

            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={contactData.address}
              onChange={handleInputChange}
            />

            <label>Image Link:</label>
            <input
              type="text"
              name="imageLink"
              value={contactData.imageLink}
              onChange={handleInputChange}
            />

            <label>Category:</label>
            <select
              className="form-select"
              aria-label="Categories"
              value={contactData.categoryId}
              onChange={handleCategoryChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>

            <label>Subcategory:</label>
            <select
              className="form-select"
              aria-label="Subcategories"
              value={contactData.subcategoryId}
              onChange={handleSubcategoryChange}
              disabled={!selectedCategory}
            >
              <option value="">Select a subcategory</option>
              {subcategories
                .filter(
                  (subcategory) =>
                    subcategory.categoryId.toString() === selectedCategory
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

            <br />
            <div>
              <Button type="submit" disabled={!isFormValid}>
                Add Contact
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AddContactModal;
