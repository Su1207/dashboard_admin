import { useState } from "react";
import "./AddNotifications.scss";
import { ref, set } from "firebase/database";
import { database } from "../../../firebase";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import { getToken } from "firebase/messaging";
import { messaging } from "../../../firebase";

type Props = {
  setAddNotification: React.Dispatch<React.SetStateAction<boolean>>;
};

type Notification = {
  MSG: string;
  TITLE: string;
};

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

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey:
          "BM_09SaSw0O-eO_nz2qZBRPsVu3umi9yuCboVWDN3huRJxT9F9SfrZoVubM7-jeVPTcSqNGDFTFIl78gNVXKTOw",
      });
      console.log("Token Gen", token);
      // Send this token  to server ( db)
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = await getToken(messaging);
      console.log(token);

      const message = {
        notification: {
          title: "Firebase",
          body: "Firebase is awesome",
          click_action: "http://localhost:5173",
          icon: "http://url-to-an-icon/icon.png",
        },
        to: "cmR2AnXzCFCpuKFPXsZiEO:APA91bGXi0a4MJiHfElS2EN-6EdlTU1iMOTIy6Oi1WRf88JcY8ct_zh38ARr_TxHaimDWEBCpfn3tiLUijJIOrlzEAP80T4LEAxaGjXZGnEkKLhvl5sY_v9si1a_zYwGMGKMS66tlO4c",
      };

      await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          Authorization:
            "key=AAAARNiDo34:APA91bGhxD2nWXPp6RmWkVcqi3pNw0cEfbqrKfDFbmZYCBZKeD002Z7PmhE2uXg3VNGGjK4FmcxlY2Pk0HkagVkSWgPu16WpHSOES9BqHHpbJJ0SpYt3jfVFmncX9b62a1uplMw7VjM3",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      addNotification(notificationContent);
      props.setAddNotification(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="addNotifications_background">
      <button onClick={requestPermission}>Click</button>
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
