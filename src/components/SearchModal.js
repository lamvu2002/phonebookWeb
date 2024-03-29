import React, { useState, useRef, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Overlay from "react-bootstrap/Overlay";
import Button from "@mui/material/Button";

const SearchModal = ({ type, onSearch }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [typeWidth, setTypeWidth] = useState(0);
  const typew = useRef(null);
  useEffect(() => {
    if (typew.current) {
      const width = typew.current.getBoundingClientRect().width;
      setTypeWidth(width);
    }
  }, []);

  const handleButtonClick = () => {
    if (show) {
      handleSearch();
    } else {
      setShow(true);
    }
  };

  const handleSearch = () => {
    onSearch(inputValue);
    setShow(false);
    setInputValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      {!show && (
        <span className="ml-auto" ref={typew}>
          {type}
        </span>
      )}
      {show && <div style={{ width: typeWidth }}></div>}
      <Button ref={target} onClick={handleButtonClick}>
        <SearchIcon />
      </Button>
      <Overlay target={target.current} show={show} placement="left">
        {({ arrowProps, show: _show, ...props }) => (
          <div
            {...props}
            style={{
              position: "absolute",
              padding: "2px 10px",
              color: "white",
              borderRadius: 3,
              ...props.style,
            }}
          >
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder={type}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
                style={{ width: `${typeWidth + 40}px` }}
              />
            </div>
          </div>
        )}
      </Overlay>
    </div>
  );
};

export default SearchModal;
