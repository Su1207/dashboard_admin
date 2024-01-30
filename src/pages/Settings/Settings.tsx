import { useState } from "react";
import "./Settings.scss";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PaymentSetting from "../../components/SettingComponent/PaymentSetting/PaymentSetting";
import VersionSetting from "../../components/SettingComponent/VersionSetting/VersionSetting";
import GeneralSetting from "../../components/SettingComponent/GeneralSetting/GeneralSetting";

const Settings = () => {
  const [upiSetting, setUpiSetting] = useState(false);
  const [generalSetting, setGeneralSetting] = useState(false);
  const [versionSetting, setVersionSetting] = useState(false);

  const handleUpiClick = () => {
    setUpiSetting(!upiSetting);
    setGeneralSetting(false);
    setVersionSetting(false);
  };

  const handleGeneralClick = () => {
    setUpiSetting(false);
    setGeneralSetting(!generalSetting);
    setVersionSetting(false);
  };

  const handleVersionClick = () => {
    setUpiSetting(false);
    setGeneralSetting(false);
    setVersionSetting(!versionSetting);
  };

  return (
    <div className="setting">
      <h2>Settings</h2>
      <div className="setting_mainContainer">
        <div
          className={`setting_subContainer ${upiSetting ? "rotate-icon" : ""}`}
          onClick={handleUpiClick}
        >
          <h4>UPI and Payment Setting</h4>
          <ArrowForwardIosIcon className="arrow_icon" />
        </div>
        {upiSetting && <PaymentSetting />}
        <div
          className={`setting_subContainer ${
            generalSetting ? "rotate-icon" : ""
          }`}
          onClick={handleGeneralClick}
        >
          <h4>General Setting</h4>
          <ArrowForwardIosIcon className="arrow_icon" />
        </div>
        {generalSetting && <GeneralSetting />}
        <div
          className={`setting_subContainer ${
            versionSetting ? "rotate-icon" : ""
          }`}
          onClick={handleVersionClick}
        >
          <h4>Version and Admin Setting</h4>
          <ArrowForwardIosIcon className="arrow_icon" />
        </div>
        {versionSetting && <VersionSetting />}
      </div>
    </div>
  );
};

export default Settings;
