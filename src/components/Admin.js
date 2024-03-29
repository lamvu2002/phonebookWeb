import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import { Table } from "react-bootstrap";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Badge from "@mui/material/Badge";
import PaginationComponent from "./PaginationComponent";
import "./Admin.css";
import SearchModal from "./SearchModal";
import AddContactModal from "./AddContactModal";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import AddCategoryModal from "./AddCategoryModal";
import AddSubcategoryModal from "./AddSubcategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import DeleteSubcategoryModal from "./DeleteSubcategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import EditSubcategoryModal from "./EditSubcategoryModal";
const Admin = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("/api/Categories"); // Replace with your API endpoint
      setCategories(response.data.sort((a, b) => a.categoryId - b.categoryId));
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchSubcategories = async () => {
      const response = await axios.get("/api/Subcategories"); // Replace with your API endpoint
      setSubcategories(
        response.data.sort((a, b) => a.subcategoryId - b.subcategoryId)
      );
    };

    fetchSubcategories();
  }, []);
  useEffect(() => {
    const fetchContacts = async () => {
      const response = await axios.get("/api/Contacts"); // Replace with your API endpoint
      setContacts(response.data);
      setFilteredContacts(response.data);
    };

    fetchContacts();
  }, []);
  const onChangeContact = (newContacts) => {
    // Update contacts state with the latest data (including added or deleted)
    setContacts(newContacts);
    if (selectedSubcategoryId) {
      const filteredContacts = newContacts.filter(
        (contact) => contact.subcategoryId === selectedSubcategoryId
      );
      setFilteredContacts(filteredContacts);
    } else {
      setFilteredContacts(newContacts);
    }
  };
  const onChangeCategory = (newCategory) => {
    setCategories(newCategory.sort((a, b) => a.categoryId - b.categoryId));
  };
  const onChangeSubcategory = (newSubcategory) => {
    setSubcategories(
      newSubcategory.sort((a, b) => a.subcategoryId - b.subcategoryId)
    );
  };

  useEffect(() => {
    setCurrentPage(1); // Reset currentPage to 1 when a subcategory is selected
  }, [selectedSubcategoryId]);
  const handleSubcategorySelect = (subcategoryId) => {
    setSelectedSubcategoryId(subcategoryId);
  };
  const ContactTableRow = ({ contact }) => {
    return (
      <tr>
        <td
          className="bg-opacity-10"
          style={{ backgroundColor: "#DED3B8", color: "#000080" }}
        >
          <img alt="Avatar" src={contact.imageLink} />
        </td>
        <td
          className="bg-opacity-10 text-wrap"
          style={{ backgroundColor: "#DED3B8", color: "#000080" }}
        >
          {contact.name}
        </td>
        <td
          className="bg-opacity-10 text-wrap"
          style={{ backgroundColor: "#DED3B8", color: "#000080" }}
        >
          {contact.phoneNumber}
        </td>
        <td
          className="bg-opacity-10 text-wrap"
          style={{ backgroundColor: "#DED3B8", color: "#000080" }}
        >
          {contact.emailAddress}
        </td>
        <td
          className="bg-opacity-10 text-wrap"
          style={{ backgroundColor: "#DED3B8", color: "#000080" }}
        >
          {contact.address}
        </td>
        <td
          className="bg-opacity-10 text-wrap "
          style={{ backgroundColor: "#DED3B8", color: "#000080" }}
        >
          <div className="d-flex align-middle justify-content-center">
            <EditButton
              categories={categories}
              subcategories={subcategories}
              onEditContact={onChangeContact}
              contactId={contact.contactId}
              contacts={contacts}
            />
            <DeleteButton
              contactId={contact.contactId}
              onDeleteContact={onChangeContact}
            />
          </div>
        </td>
      </tr>
    );
  };
  const totalPages = Math.ceil(
    selectedSubcategoryId
      ? filteredContacts.filter(
          (contact) => contact.subcategoryId === selectedSubcategoryId
        ).length / itemsPerPage
      : filteredContacts.length / itemsPerPage
  );
  // Calculate index of the first and last item to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice the contacts array to get the contacts for the current page
  const currentContacts = selectedSubcategoryId
    ? filteredContacts
        .filter((contact) => contact.subcategoryId === selectedSubcategoryId)
        .slice(indexOfFirstItem, indexOfLastItem)
    : filteredContacts.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const normalizeInput = (str) => {
    const trimmedInput = str.trim();
    const lowerCaseInput = trimmedInput.toLowerCase();
    const removedDiacritics = lowerCaseInput
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const removedSpecialCharacters = removedDiacritics.replace(
      /[^a-zA-Z0-9\s]/g,
      ""
    );
    return removedSpecialCharacters;
  };
  const handleSearchName = (inputValue) => {
    const normalizedInput = normalizeInput(inputValue);
    const filteredContacts = contacts.filter((contact) =>
      normalizeInput(contact.name).includes(normalizedInput)
    );
    setFilteredContacts(filteredContacts);

    setCurrentPage(1);
  };
  const handleSearchPhoneNumber = (inputValue) => {
    const normalizedInput = normalizeInput(inputValue);

    const filteredContacts = contacts.filter((contact) =>
      normalizeInput(contact.phoneNumber).includes(normalizedInput)
    );
    setFilteredContacts(filteredContacts);
    setCurrentPage(1);
  };
  const handleSearchEmail = (inputValue) => {
    const normalizedInput = normalizeInput(inputValue);

    const filteredContacts = contacts.filter((contact) =>
      normalizeInput(contact.emailAddress).includes(normalizedInput)
    );
    setFilteredContacts(filteredContacts);
    setCurrentPage(1);
  };
  const handleSearchAdress = (inputValue) => {
    const normalizedInput = normalizeInput(inputValue);

    const filteredContacts = contacts.filter((contact) =>
      normalizeInput(contact.address).includes(normalizedInput)
    );
    setFilteredContacts(filteredContacts);
    setCurrentPage(1);
  };
  const logout = async () => {
    // if used in more components, this should be in context
    // axios to /logout endpoint
    setAuth({});
    setCategories([]);
    setContacts([]);
    setFilteredContacts([]);
    setSubcategories([]);
    setSelectedSubcategoryId(null);
    setCurrentPage(1);
    navigate("/login");
  };
  function ContactCategoryCount(categoryId) {
    // Filter contacts based on the provided categoryId and subcategoryId
    const filteredContacts = contacts.filter(
      (contact) => contact.categoryId === parseInt(categoryId)
    );

    // Return the count of contacts in the specified category and subcategory
    return filteredContacts.length;
  }
  function ContactSubcategoryCount(subcategoryId) {
    // Filter contacts based on the provided categoryId and subcategoryId
    const filteredContacts = contacts.filter(
      (contact) => contact.subcategoryId === parseInt(subcategoryId)
    );

    // Return the count of contacts in the specified category and subcategory
    return filteredContacts.length;
  }
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="container-fluid">
      <div className="row py-2 " style={{ backgroundColor: "#232220" }}>
        <div className="col-sm-2 flex-grow">
          <AppBar position="static" color="transparent">
            <Toolbar>
              <IconButton
                edge="start"
                color="primary"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem sx={{ padding: 0 }}>
                  <AddContactModal
                    categories={categories}
                    subcategories={subcategories}
                    onAddContact={onChangeContact}
                  />
                </MenuItem>
                <MenuItem sx={{ padding: 0 }}>
                  <AddCategoryModal
                    categories={categories}
                    onAddCategory={onChangeCategory}
                  />
                </MenuItem>
                <MenuItem sx={{ padding: 0 }}>
                  <AddSubcategoryModal
                    subcategories={subcategories}
                    categories={categories}
                    onAddSubcategory={onChangeSubcategory}
                  />
                </MenuItem>
                <MenuItem sx={{ padding: 0 }}>
                  <DeleteCategoryModal
                    categories={categories}
                    subcategories={subcategories}
                    contacts={contacts}
                    onDeleteCategory={onChangeCategory}
                    onDeleteSubcategory={onChangeSubcategory}
                    onDeleteContact={onChangeContact}
                  />
                </MenuItem>
                <MenuItem sx={{ padding: 0 }}>
                  <DeleteSubcategoryModal
                    categories={categories}
                    subcategories={subcategories}
                    contacts={contacts}
                    onDeleteSubcategory={onChangeSubcategory}
                    onDeleteContact={onChangeContact}
                  />
                </MenuItem>
                <MenuItem sx={{ padding: 0 }}>
                  <EditCategoryModal
                    categories={categories}
                    onEditCategory={onChangeCategory}
                  />
                </MenuItem>
                <MenuItem sx={{ padding: 0 }}>
                  <EditSubcategoryModal
                    subcategories={subcategories}
                    categories={categories}
                    onEditSubcategory={onChangeSubcategory}
                  />
                </MenuItem>
              </Menu>
              <h3 className="text-white ps-3">Admin </h3>
            </Toolbar>
          </AppBar>
        </div>
        <div className="col-sm-10 flex-grow d-flex justify-content-end gap-2">
          <Button className="text-light" variant="outlined" onClick={logout}>
            Log Out
          </Button>
        </div>
      </div>
      <div className="row mt-2 " style={{ height: "720px" }}>
        <div
          className="col-sm-2 flex-grow py-1"
          style={{ backgroundColor: "#D5D3C8" }}
        >
          {categories.length > 0 ? (
            <div className="text-primary-emphasis">
              <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ArrowDropDownIcon />}
                defaultExpandIcon={<ArrowRightIcon />}
                className="d-flex flex-column overflow-auto"
              >
                {categories.map((category) => (
                  <TreeItem
                    className="pt-2"
                    nodeId={`category-${category.categoryId}`}
                    key={category.categoryId}
                    label={
                      <Badge
                        badgeContent={ContactCategoryCount(category.categoryId)}
                        color="primary"
                        max={999}
                      >
                        <div
                          style={{ marginRight: "17px", fontWeight: "bold" }}
                        >
                          {category.categoryName}
                        </div>
                      </Badge>
                    }
                  >
                    {subcategories.map(
                      (subcategory) =>
                        subcategory.categoryId === category.categoryId && (
                          <TreeItem
                            className="pt-2"
                            nodeId={`subcategory-${subcategory.subcategoryId}`}
                            key={subcategory.subcategoryId}
                            label={
                              <Badge
                                badgeContent={ContactSubcategoryCount(
                                  subcategory.subcategoryId
                                )}
                                color="success"
                                max={999}
                              >
                                <div
                                  style={{
                                    marginRight: "17px",
                                  }}
                                >
                                  {subcategory.subcategoryName}
                                </div>
                              </Badge>
                            }
                            onClick={() =>
                              handleSubcategorySelect(subcategory.subcategoryId)
                            }
                          />
                        )
                    )}
                  </TreeItem>
                ))}
                <TreeItem
                  className="pt-2"
                  nodeId="display-all"
                  label="Display all"
                  onClick={() => {
                    setSelectedSubcategoryId(null);
                    setFilteredContacts(contacts);
                    setCurrentPage(1);
                  }}
                />
              </TreeView>
            </div>
          ) : (
            <p>Loading categories...</p>
          )}
        </div>
        <div className="d-flex flex-grow-1 col-sm-8">
          {contacts.length > 0 && (
            <div className="flex-grow-1">
              <Table striped bordered hover className="h-100 ">
                <thead>
                  <tr>
                    <th
                      className="text-info-emphasis"
                      style={{ backgroundColor: "#F9C768" }}
                    >
                      <div className="mb-1">Image</div>
                    </th>
                    <th
                      className=" text-info-emphasis"
                      style={{ backgroundColor: "#F9C768" }}
                    >
                      <SearchModal type={"Name"} onSearch={handleSearchName} />
                    </th>
                    <th
                      className=" text-info-emphasis"
                      style={{ backgroundColor: "#F9C768" }}
                    >
                      <SearchModal
                        type={"Phone Number"}
                        onSearch={handleSearchPhoneNumber}
                      />
                    </th>
                    <th
                      className=" text-info-emphasis"
                      style={{ backgroundColor: "#F9C768" }}
                    >
                      <SearchModal
                        type={"Email Address"}
                        onSearch={handleSearchEmail}
                      />
                    </th>
                    <th
                      className=" text-info-emphasis"
                      style={{ backgroundColor: "#F9C768" }}
                    >
                      <SearchModal
                        type={"Address"}
                        onSearch={handleSearchAdress}
                      />
                    </th>
                    <th
                      className="text-info-emphasis"
                      style={{ backgroundColor: "#F9C768" }}
                    >
                      <div className="mb-1">Edit/Delete</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentContacts.map((contact) => (
                    <ContactTableRow
                      key={contact.contactId}
                      contact={contact}
                    />
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-center">
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
              </div>
            </div>
          )}
          {contacts.length === 0 && <p>Loading contacts...</p>}
        </div>
      </div>
    </div>
  );
};

export default Admin;
