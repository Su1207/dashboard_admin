import { useParams } from "react-router-dom";
import Single from "../../components/transactionHistory/Single";
import "./user.scss";
import UserDetail from "../../components/UserDetail/UserDetail";

const User = () => {
  //this way ensure that useParams never return undefined value
  const { id } = useParams<{ id?: string }>();
  const userId = id ?? ""; // Provide a default value if id is undefined
  console.log(userId);

  return (
    <div>
      <UserDetail userId={Number(userId)} />
      {/* <Single userId={Number(userId)} /> */}
    </div>
  );
};

export default User;
