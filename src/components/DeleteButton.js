import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Toaster, toast } from "react-hot-toast";
const DeleteButton = ({ contactId, onDeleteContact }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { auth } = useAuth();
  const handleDelete = async () => {
    try {
      await axios.delete(`api/Contacts/${contactId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      const reload = await axios.get("/api/Contacts"); // Replace with your endpoint
      console.log(reload.danpmta);
      onDeleteContact(reload.data);
      handleClose();
      toast.success("Contact deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete contact: " + error);
      // Handle the error
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid white",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <Toaster position="top-center" />
      <Button color="warning" onClick={handleOpen}>
        <DeleteIcon />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-warning-modal"
        aria-describedby="to warn when deleting"
      >
        <Box sx={style}>
          <div className="modal-header d-flex justify-content-between align-items-center mb-3">
            <h5 className="modal-title">Delete</h5>
            <Button className="btn-close" onClick={handleClose}></Button>
          </div>
          <div className="mb-3">
            <p className="text-center">Are you sure you want to delete?</p>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-start delete-button" onClick={handleDelete}>
              Delete
            </span>
            <span className="text-end cancel-button" onClick={handleClose}>
              Cancel
            </span>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default DeleteButton;
