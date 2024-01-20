import { useState } from "react";
import "./AddNotifications.scss";
import { ref, set } from "firebase/database";
import { database } from "../../../firebase";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";

type Props = {
  setAddNotification: React.Dispatch<React.SetStateAction<boolean>>;
};

type Notification = {
  MSG: string;
  TITLE: string;
};

// type NotificationType = Record<string, Notification>;

const AddNotifications = (props: Props) => {
  const [notificationContent, setNotificationContent] = useState<Notification>({
    MSG: "",
    TITLE: "",
  });

  const addNotification = async (data: Notification) => {
    const { MSG, TITLE } = data;

    if (MSG && TITLE) {
      try {
        const timeStamp = Date.now();
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const date = currentDate.getDate().toString().padStart(2, "0");

        const dateWiseRef = ref(
          database,
          `NOTIFICATIONS/DATE WISE/${year}/${month}/${date}/${timeStamp}`
        );

        const totalRef = ref(database, `NOTIFICATIONS/TOTAL/${timeStamp}`);

        await set(dateWiseRef, {
          MSG: MSG,
          TITLE: TITLE,
        });

        await set(totalRef, {
          MSG: MSG,
          TITLE: TITLE,
        });

        props.setAddNotification(false);
        toast.success("Notification sent successfully");
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error("Message or Title can't be empty");
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setNotificationContent((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    addNotification(notificationContent);
  };

  return (
    <div className="addNotifications_background">
      <div className="addNotifications_container">
        <span className="close" onClick={() => props.setAddNotification(false)}>
          <ClearIcon />
        </span>
        <h2>Add Notification</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Notification Title"
            value={notificationContent?.TITLE}
            name="TITLE"
            onChange={handleChange}
          />
          <textarea
            rows={8}
            placeholder="Enter Message"
            value={notificationContent?.MSG}
            name="MSG"
            onChange={handleChange}
          ></textarea>
          <button type="submit">Send Notification</button>
        </form>
      </div>
    </div>
  );
};

export default AddNotifications;
