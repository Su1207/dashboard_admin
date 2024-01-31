import { Switch } from "@mui/material";
import "./PaymentSetting.scss";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { get, off, onValue, ref, set } from "firebase/database";
import { database } from "../../../firebase";
import EditGeneralSetting from "./EditGeneralSetting";
import EditPayment from "./EditPayment";
import AddUpi from "./AddUpi";

export type GeneralSettingDataType = {
  WHATSAPP: number;
  YOUTUBE: string;
};

export type PaymentDataType = {
  GPAY_AUTO: boolean;
  MIN_ADD: number;
  MIN_WITHDRAW: number;
};

export type UPIDataType = {
  DEFAULT: string;
  IDS: { [key: string]: boolean };
};

const PaymentSetting = () => {
  const [generalSettingData, setGeneralSettingData] =
    useState<GeneralSettingDataType | null>(null);

  const [paymentData, setPaymentData] = useState<PaymentDataType | null>(null);
  const [editGeneral, setEditGeneral] = useState(false);
  const [editPayment, setEditPayment] = useState(false);

  const [upiData, setUpiData] = useState<UPIDataType>({
    DEFAULT: "",
    IDS: { [""]: false },
  });
  const [addUpi, setAddUpi] = useState(false);

  useEffect(() => {
    const generalRef = ref(database, "ADMIN/GENERAL SETTINGS");

    try {
      const unsubscribe = onValue(generalRef, (snapshot) => {
        if (snapshot.exists()) {
          setGeneralSettingData({
            WHATSAPP: snapshot.val().WHATSAPP,
            YOUTUBE: snapshot.val().YOUTUBE,
          });
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.log(err);
    }
  }, [editGeneral]);

  useEffect(() => {
    const paymentRef = ref(database, "ADMIN/PAYMENT");

    try {
      const handlePaymentData = (snapshot: any) => {
        if (snapshot.exists()) {
          setPaymentData({
            GPAY_AUTO: snapshot.val().GPAY_AUTO,
            MIN_ADD: snapshot.val().MIN_ADD,
            MIN_WITHDRAW: snapshot.val().MIN_WITHDRAW,
          });
        } else {
          return;
        }
      };

      onValue(paymentRef, handlePaymentData);

      return () => {
        off(paymentRef, "value", handlePaymentData);
      };
    } catch (err) {
      console.log(err);
    }
  }, [editPayment]);

  useEffect(() => {
    const upiRef = ref(database, "ADMIN/UPI");

    try {
      get(upiRef).then((snapshot) => {
        if (snapshot.exists()) {
          setUpiData(snapshot.val());
        }
      });

      const unsubscribe = onValue(upiRef, (snapshot) => {
        if (snapshot.exists()) {
          setUpiData(snapshot.val());
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleToggle = () => {
    const gpayRef = ref(database, "ADMIN/PAYMENT/GPAY_AUTO");

    set(gpayRef, !paymentData?.GPAY_AUTO);
  };

  const handleGeneralClick = () => {
    setEditGeneral(!editGeneral);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentClick = () => {
    setEditPayment(!editPayment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddUpi = () => {
    setAddUpi(!addUpi);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClick = async (key: string) => {
    const updatedIDS: Record<string, boolean> = {};

    // Update all keys with false
    Object.keys(upiData.IDS).forEach((key) => {
      updatedIDS[key] = false;
    });

    // Set the clicked key as true
    updatedIDS[key] = true;

    // Update the database with the new IDS
    const upiRef = ref(database, "ADMIN/UPI/IDS");
    await set(upiRef, updatedIDS);
    const defaultRef = ref(database, "ADMIN/UPI/DEFAULT");
    await set(defaultRef, key);
  };

  console.log(upiData);

  return (
    <div className="paymentSetting">
      {editGeneral && <EditGeneralSetting setEditGeneral={setEditGeneral} />}
      {editPayment && <EditPayment setEditPayment={setEditPayment} />}
      {addUpi && <AddUpi setAddUpi={setAddUpi} />}
      <div className="first_container">
        <div className="general_setting_header">
          <h4>GENERAL SETTINGS</h4>
          <div onClick={handleGeneralClick}>
            <EditIcon className="edit_icon" />
          </div>
        </div>
        <div className="whatsapp_num">
          <span>Whatsapp</span> +91 {generalSettingData?.WHATSAPP}
        </div>
        <div className="whatsapp_num">
          <span>Youtube</span> {generalSettingData?.YOUTUBE}
        </div>

        <div className="payment_setting">
          <div className="payment_setting_header">
            <h4>PAYMENT SETTINGS</h4>
            <div onClick={handlePaymentClick}>
              <EditIcon className="edit_icon" />
            </div>
          </div>
          <div className="auto_payment_setting">
            <p>GPay Auto Payment</p>
            <Switch
              checked={paymentData?.GPAY_AUTO}
              className="switch"
              color="secondary"
              size="small"
              onClick={handleToggle}
            />
          </div>
          <div className="min_amount">
            <div className="min_deposit">
              <span>{paymentData?.MIN_ADD}</span>
              <p>Min Deposit</p>
            </div>
            <div className="min_withdraw">
              <span>{paymentData?.MIN_WITHDRAW}</span>
              <p>Min Withdraw</p>
            </div>
          </div>
        </div>
      </div>
      <div className="fourth_container">
        <div className="default_upi">
          <h4>DEFAULT UPI</h4>
          <div className="default_upi_id">{upiData?.DEFAULT}</div>
        </div>
        <div className="upi_ids_header">
          <h4>ALL UPI IDS</h4>
          <button onClick={handleAddUpi}>Add New UPI</button>
        </div>
        {upiData &&
          Object.entries(upiData.IDS)
            .sort(([, data1], [, data2]) => (data1 ? -1 : data2 ? 1 : 0))
            .map(([key, data]) => (
              <div className="upi_id" key={key}>
                {key}
                {data ? (
                  <button className="default">DEFAULT</button>
                ) : (
                  <button
                    className="set_as_default"
                    onClick={() => handleClick(key)}
                  >
                    Set as Default
                  </button>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export default PaymentSetting;
