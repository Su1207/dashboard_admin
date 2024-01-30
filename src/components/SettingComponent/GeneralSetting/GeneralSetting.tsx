import { useEffect, useState } from "react";
import "./GeneralSetting.scss";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../../firebase";
import { Switch } from "@mui/material";

type BonusDataType = {
  REFERRED_BY_BONUS: number;
  REFERRED_TO_BONUS: number;
  WELCOME_BONUS: number;
};

type GeneralDataType = {
  REFER_MSG: string;
  BID_RATE: number;
};

type PaymentSettingDataType = {
  WITHDRAW: boolean;
  DAILY_TRANSACTION_LIMIT: number;
  DAILY_WITHDRAW_LIMIT: number;
  WITHDRAW_CLOSE: number;
  WITHDRAW_MESSAGE: string;
  WITHDRAW_OPEN: number;
};

const GeneralSetting = () => {
  const [bonusData, setBonusData] = useState<BonusDataType>();
  const [generalData, setGeneralData] = useState<GeneralDataType>();
  const [paymentData, setPaymentData] = useState<PaymentSettingDataType>();

  useEffect(() => {
    const bonusRef = ref(database, "ADMIN/BONUS");

    const handleData = (snapshot: any) => {
      if (snapshot.exists()) {
        setBonusData({
          REFERRED_BY_BONUS: snapshot.val().REFERRED_BY_BONUS,
          REFERRED_TO_BONUS: snapshot.val().REFERRED_TO_BONUS,
          WELCOME_BONUS: snapshot.val().WELCOME_BONUS,
        });
      }
    };

    onValue(bonusRef, handleData);

    return () => {
      off(bonusRef, "value", handleData);
    };
  }, []);

  useEffect(() => {
    const paymentRef = ref(database, "ADMIN/PAYMENT");

    try {
      const handlePaymentData = (snapshot: any) => {
        if (snapshot.exists()) {
          setPaymentData({
            WITHDRAW: snapshot.val().WITHDRAW,
            DAILY_TRANSACTION_LIMIT: snapshot.val().DAILY_TRANSACTION_LIMIT,
            DAILY_WITHDRAW_LIMIT: snapshot.val().DAILY_WITHDRAW_LIMIT,
            WITHDRAW_CLOSE: snapshot.val().WITHDRAW_CLOSE,
            WITHDRAW_MESSAGE: snapshot.val().WITHDRAW_MESSAGE,
            WITHDRAW_OPEN: snapshot.val().WITHDRAW_OPEN,
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
  }, []);

  useEffect(() => {
    const generalRef = ref(database, "ADMIN/GENERAL SETTINGS");

    const handleData = (snapshot: any) => {
      if (snapshot.exists()) {
        setGeneralData({
          REFER_MSG: snapshot.val().REFER_MSG,
          BID_RATE: snapshot.val().BID_RATE,
        });
      }
    };

    onValue(generalRef, handleData);

    return () => {
      off(generalRef, "value", handleData);
    };
  }, []);

  return (
    <div className="general_setting">
      <div className="bonus_container">
        <h4>USERS BONUS</h4>
        <form>
          <div className="input_form">
            <label>Welcome Bonus</label>
            <input
              type="number"
              name="WELCOME_BONUS"
              value={bonusData?.WELCOME_BONUS}
              //   onChange={handleInputChange}
              //   value={formVersionData.LATEST_VERSION}
            />
          </div>
          <div className="input_form">
            <label>Referred To Bonus</label>
            <input
              type="number"
              name="REFFERED_TO_BONUS"
              value={bonusData?.REFERRED_TO_BONUS}
              //   onChange={handleInputChange}
              //   value={formVersionData.UPDATE_URL}
            />
          </div>
          <div className="input_form">
            <label>Referred By Bonus</label>
            <input
              type="number"
              name="REFFERED_BY_BONUS"
              value={bonusData?.REFERRED_BY_BONUS}
              //   onChange={handleInputChange}
              //   value={formVersionData.UPDATE_URL}
            />
          </div>
          <button type="submit">Update Bonus</button>
        </form>
      </div>
      <div className="refer_container">
        <h4>REFER SETTINGS</h4>
        <form>
          <div className="input_form">
            <label>Enter Refer Message</label>
            <textarea
              rows={25}
              cols={40}
              name="REFER_MSG"
              value={generalData?.REFER_MSG}
              //   onChange={handleInputChange}
              //   value={formVersionData.UPDATE_URL}
            />
          </div>
          <button>Update Refer Message</button>
        </form>
      </div>
      <div className="withdraw_container">
        <div className="withdraw_header">
          <h4>WITHDRAW SETTINGS</h4>
          <Switch
            checked={paymentData?.WITHDRAW}
            color="secondary"
            size="small"
          />
        </div>
        <form>
          <div className="input_form">
            <label>Daily Transaction Limit</label>
            <input
              type="number"
              name="DAILY_TRANSACTION_LIMIT"
              value={paymentData?.DAILY_TRANSACTION_LIMIT}
              //   onChange={handleInputChange}
              //   value={formVersionData.UPDATE_URL}
            />
          </div>
          <div className="input_form">
            <label>Daily Withdraw Limit</label>
            <input
              type="number"
              name="DAILY_WITHDRAW_LIMIT"
              value={paymentData?.DAILY_TRANSACTION_LIMIT}
              //   onChange={handleInputChange}
              //   value={formVersionData.UPDATE_URL}
            />
          </div>
          <div className="input_form">
            <label>Enter Withdrawal Message</label>
            <textarea
              name="WITHDRAW_MSG"
              value={paymentData?.WITHDRAW_MESSAGE}
              //   onChange={handleInputChange}
              //   value={formVersionData.UPDATE_URL}
            />
          </div>
          <button>Update Refer Message</button>
        </form>
      </div>
      <div className="withdrawTiming_container">
        <h4> WITHDRAWAL TIMING</h4>
        <form>
          <div className="input_form">
            <label>OPEN ON</label>
            <input
              type="time"
              name="WITHDRAW_OPEN"
              value={paymentData?.WITHDRAW_OPEN}
              //   onChange={handleInputChange}
              //   value={formVersionData.UPDATE_URL}
            />
          </div>
          <div className="input_form">
            <label>CLOSE ON</label>
            <input
              type="time"
              name="WITHDRAW_CLOSE"
              value={paymentData?.WITHDRAW_CLOSE}
              //   onChange={handleInputChange}
              //   value={formVersionData.UPDATE_URL}
            />
          </div>
          <button>Update Timing</button>
        </form>
      </div>
      <div className="bid_container">
        <h4>BID RATE SETTINGS</h4>
        <form>
          <div className="input_form">
            <label>Enter Minimum Bid Rate</label>
            <input
              type="number"
              name="BID_RATE"
              value={generalData?.BID_RATE}
              //   onChange={handleInputChange}
              //   value={formVersionData.UPDATE_URL}
            />
          </div>
          <button>Update Minimum Bid Rate</button>
        </form>
      </div>
    </div>
  );
};

export default GeneralSetting;
