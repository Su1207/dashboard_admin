import { useParams } from "react-router-dom";

const AdminRoles = () => {
  const { id } = useParams();
  const adminId = id ?? "";
  return (
    <div>
      <div>Admin Roles ({adminId.split("___")[1]})</div>
    </div>
  );
};

export default AdminRoles;
