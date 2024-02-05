import { useState, useEffect } from "react";
import { ref, onValue, set, get } from "firebase/database";
import { database } from "../../firebase";
import { alpha, styled } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import Switch from "@mui/material/Switch";

const GreenSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: green[600],
    "&:hover": {
      backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: green[600],
  },
}));

const label = { inputProps: { "aria-label": "Color switch" } };

interface DataTableProps {
  userId: string;
}

const BlockUnblockToggle: React.FC<DataTableProps> = ({ userId }) => {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Reference to the 'user list' node in the database
    const userListRef = ref(database, "USERS LIST");

    // Fetch user list data once
    get(userListRef).then((snapshot) => {
      if (snapshot.exists()) {
        // Check if the user is blocked based on the user list data
        setIsBlocked(snapshot.val()[userId] === true);
      }
    });

    // Alternatively, fetch user list data in real-time
    const unsubscribe = onValue(userListRef, (snapshot) => {
      if (snapshot.exists()) {
        // Check if the user is blocked based on the user list data
        setIsBlocked(snapshot.val()[userId] === true);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [userId]);

  const handleToggle = () => {
    // Update the user's blocked status in the 'user list' node
    const userListRef = ref(database, `USERS LIST/${userId}`);
    set(userListRef, !isBlocked);
  };

  return (
    <div className="toggle_icons">
      <GreenSwitch
        {...label}
        size="small"
        checked={isBlocked}
        onChange={handleToggle}
      />
    </div>
  );
};

export default BlockUnblockToggle;
