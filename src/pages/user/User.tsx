import { Navigate, useParams } from "react-router-dom";
import "./user.scss";
import UserDetail from "../../components/UserDetail/UserDetail";
import { useAuth } from "../../components/auth-context";
import { useSubAuth } from "../../components/subAdmin-authContext";

const User = () => {
  //this way ensure that useParams never return undefined value
  const { id } = useParams<{ id?: string }>();
  const userId = id ?? ""; // Provide a default value if id is undefined
  console.log(userId);

  const { isAuthenticated } = useAuth();
  const { isSubAuthenticated } = useSubAuth();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <UserDetail userId={Number(userId)} />
      {/* <Single userId={Number(userId)} /> */}
    </div>
  );
};

export default User;
