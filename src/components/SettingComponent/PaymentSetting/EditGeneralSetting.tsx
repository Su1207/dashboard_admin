import { get, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../firebase";
import { GeneralSettingDataType } from "./PaymentSetting";
import ClearIcon from "@mui/icons-material/Clear";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { toast } from "react-toastify";

const initialState = {
  WHATSAPP: 0,
  YOUTUBE: "",
};

type Props = {
  setEditGeneral: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditGeneralSetting = (props: Props) => {
  const [formData, setFormData] =
    useState<GeneralSettingDataType>(initialState);

  useEffect(() => {
    const fetchData = async () => {
      const generalRef = ref(database, "ADMIN/GENERAL SETTINGS");

      try {
        const snapshot = await get(generalRef);

        if (snapshot.exists()) {
          setFormData({
            WHATSAPP: snapshot.val().WHATSAPP,
            YOUTUBE: snapshot.val().YOUTUBE,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "WHATSAPP" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const generalRef = ref(database, "ADMIN/GENERAL SETTINGS");

      const snapshot = await get(generalRef);

      await update(generalRef, {
        WHATSAPP: formData?.WHATSAPP || snapshot.val().WHATSAPP,
        YOUTUBE: formData?.YOUTUBE || snapshot.val().YOUTUBE,
      });

      toast.success("Updated Successfully");
      props.setEditGeneral(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="edit_general">
      <div className="modal">
        <span className="close" onClick={() => props.setEditGeneral(false)}>
          <ClearIcon />
        </span>
        <h2>Update General Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>
              Whatsapp
              <WhatsAppIcon />
            </label>
            <input
              type="tel"
              pattern="\d{10}"
              title="Please enter exactly 10 digits"
              name="WHATSAPP"
              value={formData?.WHATSAPP}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <label>
              Youtube
              <YouTubeIcon />
            </label>
            <input
              type="text"
              name="YOUTUBE"
              onChange={handleChange}
              value={formData?.YOUTUBE}
            />
          </div>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditGeneralSetting;
