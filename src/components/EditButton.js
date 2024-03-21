import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";

const handleEdit = () => {};

const EditButton = () => {
  return (
    <Button color="success" onClick={handleEdit}>
      <EditIcon />
    </Button>
  );
};
export default EditButton;
