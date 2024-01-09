import { useEffect, useState } from "react";
import "./userDetail.scss";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../firebase";
import profile from "../../assets/userProfile.png";
import { FaEdit } from "react-icons/fa";
import Copy from "../copy/Copy";
import BidTransaction from "../transactionHistory/BidTransaction/BidTransaction";
import WinTransaction from "../transactionHistory/WinTransaction/WinTransaction";
import DepositTransaction from "../transactionHistory/DepositTransaction/DepositTransaction";
import WithdrawTransaction from "../transactionHistory/WithdrawTransaction/WithdrawTransaction";
import { TransactionProvider } from "../transactionHistory/TransactionContext";
import TotalTransaction from "../transactionHistory/TotalTransaction/TotalTransaction";
import EditUser from "../EditUser/EditUser";

interface UserDetails {
  CREATED_ON: number;
  LAST_SEEN: number;
  NAME: string;
  PASSWORD: string;
  PHONE: string;
  AMOUNT: number;

  //   UID: string;
  // Add other user details properties as needed
}

const UserDetail: React.FC<{ userId: number }> = ({ userId }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [editUser, setEditUser] = useState(false);
  // const []
  // const [selectedTransactionType, setSelectedTransactionType] =
  useState<string>("total");

  useEffect(() => {
    const userRef = ref(database, `USERS/${userId}`);
    // const statusRef = ref(database, `USERS TRANSACTION/${userId}`);

    const handleUserData = (snapshot: any) => {
      const userData = snapshot.val();
      if (userData) {
        setUserDetails(userData);
      }
    };

    onValue(userRef, handleUserData);

    // Cleanup function
    return () => {
      // Unsubscribe when the component unmounts
      off(userRef, "value", handleUserData);
    };
  }, [userId]);

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handleEditChange = () => {
    setEditUser(!editUser);
  };

  return (
    <TransactionProvider>
      <div>
        <div className="userDetails">
          {userDetails ? (
            <div className="userDetails_card card">
              <div className="card_top">
                <div className="card_top_name">
                  <img src={profile} alt="" className="profile_picture" />
                  <h1 className="user_name">{userDetails.NAME}</h1>
                </div>
                <div onClick={handleEditChange} className="edit_option">
                  <FaEdit size={25} />
                </div>
              </div>

              <div className="card_bottom">
                <div className="detail phone_detail">
                  <p>Phone Number </p>
                  <div className="number_detail">
                    <div>+91 {userDetails.PHONE}</div>
                    <Copy PhoneNumber={userDetails.PHONE} />
                  </div>
                </div>

                <div className="detail points_detail">
                  <p>Total Points</p>
                  <p>{userDetails.AMOUNT}</p>
                </div>

                <div className="detail password_detail">
                  <p>Password</p>
                  <p> {userDetails.PASSWORD}</p>
                </div>

                <div className="detail pin_detail">
                  <p>PIN </p>
                  <p>1234</p>
                </div>

                <div className="detail createdOn_detail">
                  <p>Created On </p>
                  <p>{formatDateTime(userDetails.CREATED_ON)}</p>
                </div>

                <div className="detail password_detail">
                  <p>Last Seen</p>
                  <p> {formatDateTime(userDetails.LAST_SEEN)}</p>
                </div>
              </div>

              {/* <p>UID: {userDetails.UID}</p> */}
              {/* Add other user details properties as needed */}
            </div>
          ) : (
            <p>Loading user details...</p>
          )}
        </div>

        {editUser && <EditUser setEditUser={setEditUser} userId={userId} />}

        {/* <div className="box-2 card"></div>
        <div className="box-3 card"></div> */}
        <div className="transaction_details">
          <TotalTransaction />
          <BidTransaction userId={userId} />
          <DepositTransaction userId={userId} />
          <WithdrawTransaction userId={userId} />
          <WinTransaction userId={userId} />
        </div>
      </div>
    </TransactionProvider>
  );
};

export default UserDetail;
