import { UserDetailsType } from "../MarketBidDetails";
import "./RelatedUserDetails.scss";
import ClearIcon from "@mui/icons-material/Clear";

interface UserDetailsProps {
  userDetails: UserDetailsType[];
  setClickedNumber: React.Dispatch<React.SetStateAction<boolean>>;
}

const RelatedUserDetails: React.FC<UserDetailsProps> = ({
  userDetails,
  setClickedNumber,
}) => {
  return (
    <div className="details_container">
      <div className="modal">
        <span className="close" onClick={() => setClickedNumber(false)}>
          <ClearIcon />
        </span>
        <h3>User Details</h3>
        <div className="details_main_container">
          {userDetails &&
            userDetails.map((user) => (
              <div key={user.phoneNumber} className="user_details">
                <div>
                  <span className="username">{user.userName}</span> (+91
                  {user.phoneNumber})
                </div>
                <div className="user_amount">{user.points} &#8377;</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedUserDetails;
