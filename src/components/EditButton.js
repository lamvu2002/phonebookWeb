import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios, { axiosPrivate } from "../api/axios";
import { Toaster, toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
const EditButton = ({
  categories,
  subcategories,
  onEditContact,
  contactId,
  contacts,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const { auth } = useAuth();
  const [contactData, setContactData] = useState({
    contactId: contactId,
    name: "",
    emailAddress: "",
    phoneNumber: "",
    address: "",
    categoryId: 0,
    subcategoryId: 0,
    imageLink: "",
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);

    // Find the first subcategory of the selected category
    const firstSubcategory = subcategories.find(
      (subcategory) => subcategory.categoryId.toString() === selectedCategoryId
    );

    setContactData((prevData) => ({
      ...prevData,
      categoryId: parseInt(selectedCategoryId),
      subcategoryId: firstSubcategory ? firstSubcategory.subcategoryId : 0,
    }));
  };
  const handleSubcategoryChange = (e) => {
    const selectedSubcategoryId = e.target.value;
    setContactData((prevData) => ({
      ...prevData,
      subcategoryId: parseInt(selectedSubcategoryId),
    }));
  };
  useEffect(() => {
    // Find the contact with the specified contactId
    const contact = contacts.find((contact) => contact.contactId === contactId);

    if (contact) {
      // Pre-fill the form inputs with the existing contact data
      setContactData({
        contactId: contact.contactId,
        name: contact.name,
        emailAddress: contact.emailAddress,
        phoneNumber: contact.phoneNumber,
        address: contact.address,
        categoryId: contact.categoryId,
        subcategoryId: contact.subcategoryId,
        imageLink: contact.imageLink,
      });
      setSelectedCategory(contact.categoryId.toString());
    }
  }, [contactId, contacts]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(contactData);
      await axiosPrivate.put(
        `api/Contacts/${contactId}`,
        JSON.stringify(contactData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      toast.success("Contact edited successfully");
      const reload = await axios.get("/api/Contacts"); // Replace with your endpoint
      onEditContact(reload.data);
      setContactData({
        contactId: contactId,
        name: "",
        emailAddress: "",
        phoneNumber: "",
        address: "",
        categoryId: 0,
        subcategoryId: 0,
        imageLink: "",
      });
    } catch (error) {
      toast.error("Failed to edit contact: " + error);
      // Handle the error
    }

    // Reset the form inputs

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
  return (
    <div>
      <Toaster position="top-center" />
      <Button color="success" onClick={handleOpen}>
        <EditIcon />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <div className="modal-header d-flex justify-content-between align-items-center mb-3">
            <h5 className="modal-title">Edit</h5>
            <Button className="btn-close" onClick={handleClose}></Button>
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
              <Button type="submit">Edit Contact</Button>
              <Button onClick={handleClose}>Cancel</Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
export default EditButton;
