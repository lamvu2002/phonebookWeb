import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import { Table } from "react-bootstrap";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import PaginationComponent from "./PaginationComponent";
import "./PhonebookForUser.css";
import SearchModal from "./SearchModal";

const PhonebookForUser = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
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
    const fetchContacts = async () => {
      const response = await axios.get("/api/Contacts"); // Replace with your API endpoint
      setContacts(response.data);
      setFilteredContacts(response.data);
    };

    fetchContacts();
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
    setCurrentPage(1); // Reset currentPage to 1 when a subcategory is selected
  }, [selectedSubcategoryId]);
  const handleSubcategorySelect = (subcategoryId) => {
    setSelectedSubcategoryId(subcategoryId);
  };
  const ContactTableRow = ({ contact }) => {
    return (
      <tr>
        <td className="bg-info-subtle bg-opacity-10">
          <img alt="Avatar" src={contact.imageLink} />
        </td>
        <td className="bg-info-subtle bg-opacity-10 text-wrap">
          {contact.name}
        </td>
        <td className="bg-info-subtle bg-opacity-10 text-wrap">
          {contact.phoneNumber}
        </td>
        <td className="bg-info-subtle bg-opacity-10 text-wrap">
          {contact.emailAddress}
        </td>
        <td className="bg-info-subtle bg-opacity-10 text-wrap">
          {contact.address}
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
  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const removeSpecialCharacters = (str) => {
    return str.replace(/[^a-zA-Z0-9\s]/g, "");
  };
  const handleSearchName = (inputValue) => {
    const trimmedInput = inputValue.trim();

    // Removing diacritics
    const normalizedInput = removeDiacritics(trimmedInput);

    // Removing special characters
    const sanitizedInput = removeSpecialCharacters(normalizedInput);

    const lowerCaseInput = sanitizedInput.toLowerCase();
    const filteredContacts = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(lowerCaseInput)
    );
    setFilteredContacts(filteredContacts);
    setCurrentPage(1);
  };
  const handleSearchPhoneNumber = (inputValue) => {
    const trimmedInput = inputValue.trim();

    // Removing diacritics
    const normalizedInput = removeDiacritics(trimmedInput);

    // Removing special characters
    const sanitizedInput = removeSpecialCharacters(normalizedInput);

    const lowerCaseInput = sanitizedInput.toLowerCase();
    const filteredContacts = contacts.filter((contact) =>
      contact.phoneNumber.toLowerCase().includes(lowerCaseInput)
    );
    setFilteredContacts(filteredContacts);
    setCurrentPage(1);
  };
  const handleSearchEmail = (inputValue) => {
    const trimmedInput = inputValue.trim();

    // Removing diacritics
    const normalizedInput = removeDiacritics(trimmedInput);

    // Removing special characters
    const sanitizedInput = removeSpecialCharacters(normalizedInput);

    const lowerCaseInput = sanitizedInput.toLowerCase();
    const filteredContacts = contacts.filter((contact) =>
      contact.emailAddress.toLowerCase().includes(lowerCaseInput)
    );
    setFilteredContacts(filteredContacts);
    setCurrentPage(1);
  };
  const handleSearchAdress = (inputValue) => {
    const trimmedInput = inputValue.trim();

    // Removing diacritics
    const normalizedInput = removeDiacritics(trimmedInput);

    // Removing special characters
    const sanitizedInput = removeSpecialCharacters(normalizedInput);

    const lowerCaseInput = sanitizedInput.toLowerCase();
    const filteredContacts = contacts.filter((contact) =>
      contact.address.toLowerCase().includes(lowerCaseInput)
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
  const admin = async () => {
    navigate("/admin");
  };
  return (
    <div className="container-fluid">
      <div className="row py-2 bg-dark">
        <div className="col-sm-2 flex-grow">
          <h3 className="text-white">Phonebook</h3>
        </div>
        <div className="col-sm-10 flex-grow d-flex justify-content-end gap-2">
          <Button className="text-light" variant="outlined" onClick={admin}>
            Admin
          </Button>
          <Button className="text-light" variant="outlined" onClick={logout}>
            Log Out
          </Button>
        </div>
      </div>
      <div className="row mt-2 " style={{ height: "720px" }}>
        <div className="col-sm-2 bg-dark-subtle flex-grow">
          {categories.length > 0 ? (
            <div className="text-primary-emphasis">
              <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                className="d-flex flex-column overflow-auto"
              >
                {categories.map((category) => (
                  <TreeItem
                    nodeId={`category-${category.categoryId}`}
                    key={category.categoryId}
                    label={category.categoryName}
                  >
                    {subcategories.map(
                      (subcategory) =>
                        subcategory.categoryId === category.categoryId && (
                          <TreeItem
                            nodeId={`subcategory-${subcategory.subcategoryId}`}
                            key={subcategory.subcategoryId}
                            label={subcategory.subcategoryName}
                            onClick={() =>
                              handleSubcategorySelect(subcategory.subcategoryId)
                            }
                          />
                        )
                    )}
                  </TreeItem>
                ))}
                <TreeItem
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
              <Table striped bordered hover className="h-100 text-break">
                <thead>
                  <tr>
                    <th className="bg-info text-dark">
                      <div className="mb-1">Image</div>
                    </th>
                    <th className="bg-info text-dark">
                      <SearchModal type={"Name"} onSearch={handleSearchName} />
                    </th>
                    <th className="bg-info text-dark">
                      <SearchModal
                        type={"Phone Number"}
                        onSearch={handleSearchPhoneNumber}
                      />
                    </th>
                    <th className="bg-info text-dark">
                      <SearchModal
                        type={"Email Address"}
                        onSearch={handleSearchEmail}
                      />
                    </th>
                    <th className="bg-info text-dark">
                      <SearchModal
                        type={"Address"}
                        onSearch={handleSearchAdress}
                      />
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

export default PhonebookForUser;
