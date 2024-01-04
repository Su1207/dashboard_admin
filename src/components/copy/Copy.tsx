import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import "./copy.scss";

const Copy: React.FC<{ PhoneNumber: string }> = ({ PhoneNumber }) => {
  const [phoneNumber, setPhoneNumber] = useState(`+91 ${PhoneNumber}`);

  const copyPhoneNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      alert("Phone number copied to clipboard: " + phoneNumber);
    } catch (err) {
      console.error("Failed to copy phone number to clipboard", err);
    }
  };

  return (
    <div className="copy_icon" onClick={copyPhoneNumber}>
      <FaCopy />
    </div>
  );
};

export default Copy;
