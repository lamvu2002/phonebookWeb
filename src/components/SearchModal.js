import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
const SearchModal = ({ type, onSearch }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    onSearch(inputValue);
    handleClose();
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
    <div className="d-flex justify-content-between align-items-center">
      <span className="ml-auto">{type}</span>
      <Button onClick={handleOpen}>
        <SearchIcon />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="search-modal"
        aria-describedby="to search"
      >
        <Box sx={style}>
          <div className="modal-header d-flex justify-content-between align-items-center mb-3">
            <h5 className="modal-title">Search</h5>
            <Button className="btn-close" onClick={handleClose}></Button>
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder={type}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
            <Button
              className="input-group-text"
              onClick={() => handleSearch(inputValue)}
            >
              <SearchIcon />
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
export default SearchModal;
