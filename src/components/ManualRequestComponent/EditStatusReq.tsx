import { useState } from "react";
import "./ManualRequests.scss";
import ClearIcon from "@mui/icons-material/Clear";
import { ref, update } from "firebase/database";
import { database } from "../../firebase";
import { toast } from "react-toastify";

type Props = {
  timeStamp: string;
  setEditStatus: React.Dispatch<React.SetStateAction<boolean>>;
  accept: string;
};
const EditStatusReq = (props: Props) => {
  const [selectedStatus, setSelectedStatus] = useState(`${props.accept}`);

  const editStatus = async () => {
    const dateString = new Date(Number(props.timeStamp));
    const year = dateString.getFullYear();
    const month = (dateString.getMonth() + 1).toString().padStart(2, "0");
    const date = dateString.getDate().toString().padStart(2, "0");

    const reqRef = ref(
      database,
      `MANUAL_REQUEST/DATE WISE/${year}/${month}/${date}/${props.timeStamp}`
    );

    const totalReqRef = ref(
      database,
      `MANUAL_REQUEST/TOTAL/${props.timeStamp}`
    );

    if (selectedStatus === props.accept) {
      return;
    } else if (selectedStatus === "reject" && props.accept !== selectedStatus) {
      await update(reqRef, {
        ACCEPT: selectedStatus,
        MoneyAdded: false,
      });
      await update(totalReqRef, {
        ACCEPT: selectedStatus,
        MoneyAdded: false,
      });
    } else if (selectedStatus === "true" && props.accept !== selectedStatus) {
      await update(reqRef, {
        ACCEPT: selectedStatus,
        MoneyAdded: true,
      });
      await update(totalReqRef, {
        ACCEPT: selectedStatus,
        MoneyAdded: true,
      });
    } else {
      await update(reqRef, {
        ACCEPT: selectedStatus,
        MoneyAdded: true,
      });
      await update(totalReqRef, {
        ACCEPT: selectedStatus,
        MoneyAdded: true,
      });
    }
    toast.success("Status updated successfully");
    props.setEditStatus(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    editStatus();
  };

  return (
    <div className="edit_status">
      <div className="modal">
        <span className="close" onClick={() => props.setEditStatus(false)}>
          <ClearIcon />
        </span>
        <h2>Update Status</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={selectedStatus}
            className="status_edit_option"
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="reject">REJECTED</option>
            <option value="false">PENDING</option>
            <option value="true">ACCEPTED</option>
          </select>
          <button type="submit">UPDATE</button>
        </form>
      </div>
    </div>
  );
};

export default EditStatusReq;
