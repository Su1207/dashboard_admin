import { useEffect, useState } from "react";
import "./AddNotifications.scss";
import { ref, set } from "firebase/database";
import { database } from "../../../firebase";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import { getToken } from "firebase/messaging";
import { messaging } from "../../../firebase";
import { onMessage } from "firebase/messaging";

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

  const [token, setToken] = useState("");

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
      setToken(token);
      console.log(token);
      // Send this token  to server ( db)
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    requestPermission();
    onMessage(messaging, (payload) => {
      console.log(payload);
    });
  }, []);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const message = {
        message: {
          token: `${token}`,
          notification: {
            body: "This is an FCM notification message!",
            title: "FCM Message",
          },
        },
      };

      await fetch(
        "https://fcm.googleapis.com/v1/projects/mahadev-cb556/messages:send",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer c6f18bdb10ca6989ded3f2cca0d868fe8f6b482d",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        }
      );

      addNotification(notificationContent);
      props.setAddNotification(false);
      console.log("success");
    } catch (error) {
      console.log(error);
    }
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
