import { useParams } from "react-router-dom";
import AdminRoles from "../../../components/AdminUsersComponent/AdminRoles/AdminRoles";

const AdminRole = () => {
  const { id } = useParams();
  const adminId = id ?? "";
  return (
    <div>
      <AdminRoles adminId={adminId.split("___")[1]} />
    </div>
  );
};

export default AdminRole;
