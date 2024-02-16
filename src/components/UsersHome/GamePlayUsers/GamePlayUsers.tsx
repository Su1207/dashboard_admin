import "./GameplayUsers.scss";

const GamePlayUsers = () => {
  return (
    <div className="gamePlay_users">
      <h4>GAMEPLAY USERS</h4>

      {true ? (
        <div className="users_list">
          <div className="user_data">
            <img src="user.png" alt="" className="user_img_icon" />
            <div className="user_detail">
              <div className="users_name">Anand Suryawanshi</div>
              <div className="user_phone">+919602787267</div>
            </div>
          </div>

          <div className="user_data">
            <img src="user.png" alt="" className="user_img_icon" />
            <div className="user_detail">
              <div className="users_name">Suraj maheshwari</div>
              <div className="user_phone">+919602787267</div>
            </div>
          </div>

          <div className="user_data">
            <img src="user.png" alt="" className="user_img_icon" />
            <div className="user_detail">
              <div className="users_name">Suraj Maheshwari</div>
              <div className="user_phone">+919602787267</div>
            </div>
          </div>

          <div className="user_data">
            <img src="user.png" alt="" className="user_img_icon" />
            <div className="user_detail">
              <div className="users_name">Suraj Maheshwari</div>
              <div className="user_phone">+919602787267</div>
            </div>
          </div>

          <div className="user_data">
            <img src="user.png" alt="" className="user_img_icon" />
            <div className="user_detail">
              <div className="users_name">Suraj Maheshwari</div>
              <div className="user_phone">+919602787267</div>
            </div>
          </div>

          <div className="user_data">
            <img src="user.png" alt="" className="user_img_icon" />
            <div className="user_detail">
              <div className="users_name">Suraj Maheshwari</div>
              <div className="user_phone">+919602787267</div>
            </div>
          </div>

          <div className="user_data">
            <img src="user.png" alt="" className="user_img_icon" />
            <div className="user_detail">
              <div className="users_name">Suraj Maheshwari</div>
              <div className="user_phone">+919602787267</div>
            </div>
          </div>

          <div className="user_data">
            <img src="user.png" alt="" className="user_img_icon" />
            <div className="user_detail">
              <div className="users_name">Suraj Maheshwari</div>
              <div className="user_phone">+919602787267</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="noData">
          <img src="noData.gif" alt="" className="noData-img" />
        </div>
      )}
    </div>
  );
};

export default GamePlayUsers;
