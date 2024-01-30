import { Switch } from "@mui/material";
import "./PaymentSetting.scss";
import EditIcon from "@mui/icons-material/Edit";

const PaymentSetting = () => {
  return (
    <div className="paymentSetting">
      <div className="first_main_container">
        <div className="first_container">
          <div className="general_setting_header">
            <h4>GENERAL SETTINGS</h4>
            <EditIcon className="edit_icon" />
          </div>
          <div className="whatsapp_num">
            <span>Whatsapp</span> +91 9602787267
          </div>
          <div className="whatsapp_num">
            <span>Youtube</span> www.youtube.com
          </div>
        </div>
        <div className="second_container">
          <h4>PAYMENT SETTINGS</h4>
          <div className="payment_setting">
            <p>GPay Auto Payment</p>
            <Switch
              defaultChecked
              className="switch"
              color="secondary"
              size="small"
              // onClick={() => handleOpenToggle(game, status)}
            />
          </div>
        </div>
        <div className="third_container">
          <div className="default_upi">
            <h4>DEFAULT UPI</h4>
            <div className="default_upi_id">vyapar.169290563196@hdfcbank</div>
          </div>
          <div className="payment_setting">
            <div className="payment_setting_header">
              <h4>PAYMENT SETTINGS</h4>
              <EditIcon className="edit_icon" />
            </div>
            <div className="min_amount">
              <div className="min_deposit">
                <span>100</span>
                <p>Min Deposit</p>
              </div>
              <div className="min_withdraw">
                <span>100</span>
                <p>Min Withdraw</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fourth_container">
        <div className="upi_ids_header">
          <h4>ALL UPI IDS</h4>
          <button>Add New UPI</button>
        </div>
        <div className="upi_id">
          vyapar.169290563196@hdfcbank <button>DEFAULT</button>
        </div>
        <div className="upi_id">
          vyapar.169290563196@hdfcbank <button>DEFAULT</button>
        </div>
        <div className="upi_id">
          vyapar.169290563196@hdfcbank <button>DEFAULT</button>
        </div>
        <div className="upi_id">
          vyapar.169290563196@hdfcbank <button>DEFAULT</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSetting;
