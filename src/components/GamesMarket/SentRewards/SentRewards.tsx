import { get, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../firebase";
import "./SentRewards.scss";

type RewardsProps = {
  gameId: string;
};

type UserListDataType = {
  gameName: string;
  phone: string;
  points: number;
};

const SentRewards: React.FC<RewardsProps> = ({ gameId }) => {
  const [openMarketResult, setOpenMarketResult] = useState("");
  const [closeMarketResult, setCloseMarketResult] = useState("");
  const [usersList, setUsersList] = useState<UserListDataType[] | null>(null);
  const [singleDigitUsers, setSingleDigitUsers] = useState<
    UserListDataType[] | null
  >(null);
  const [gameRate, setGameRate] = useState(0);
  const [SDgameRate, setSDGameRate] = useState(0);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const date = currentDate.getDate().toString().padStart(2, "0");

  useEffect(() => {
    try {
      const rewardsOpenRef = ref(
        database,
        `RESULTS/${gameId.split("___")[0]}/${year}/${month}/${date}/OPEN`
      );

      const rewardsCloseRef = ref(
        database,
        `RESULTS/${gameId.split("___")[0]}/${year}/${month}/${date}/CLOSE`
      );

      get(rewardsOpenRef).then((snapshot: any) => {
        if (snapshot.exists()) {
          setOpenMarketResult(snapshot.val());
        }
      });

      get(rewardsCloseRef).then((snapshot: any) => {
        if (snapshot.exists()) {
          setCloseMarketResult(snapshot.val());
        }
      });

      const unsubscribeOpen = onValue(rewardsOpenRef, (snapshot) => {
        if (snapshot.exists()) {
          setOpenMarketResult(snapshot.val());
        }
      });

      const unsubscribeClose = onValue(rewardsCloseRef, (snapshot) => {
        if (snapshot.exists()) {
          setCloseMarketResult(snapshot.val());
        }
      });

      return () => {
        unsubscribeOpen(), unsubscribeClose();
      };
    } catch (err) {
      console.log(err);
    }
  }, [openMarketResult, closeMarketResult]);

  const fetchOpenUsers = async () => {
    try {
      const a = parseInt(openMarketResult[0]);
      const b = parseInt(openMarketResult[1]);
      const c = parseInt(openMarketResult[2]);
      let gameName = "";
      if (a === b && b === c) {
        gameName = "Triple Panel";
      } else if (a === b || b === c || a === c) {
        gameName = "Double Panel";
      } else {
        gameName = "Single Panel";
      }

      const game = `${gameName.split(" ")[0][0]}${gameName.split(" ")[1][0]}`;

      const rateRef = ref(database, `ADMIN/GAME RATE/${game}`);

      get(rateRef).then((rateSnapshot) => {
        if (rateSnapshot.exists()) {
          setGameRate(rateSnapshot.val());
        }
      });

      const userRewardsRef = ref(
        database,
        `TOTAL TRANSACTION/BIDS/${year}/${month}/${date}/${
          gameId.split("___")[0]
        }/OPEN/${gameName}/${openMarketResult}`
      );

      const snapshot = await get(userRewardsRef);
      const userListArray: UserListDataType[] = [];

      if (snapshot.exists()) {
        snapshot.child("USERS").forEach((userSnapshot) => {
          const phone = userSnapshot.key;
          const points = userSnapshot.val();
          userListArray.push({
            gameName,
            phone,
            points,
          });
        });

        setUsersList(userListArray);
      } else {
        console.log("No users found");
      }

      const singleNumber =
        parseInt(openMarketResult[0]) +
        parseInt(openMarketResult[1]) +
        parseInt(openMarketResult[2]);

      const singleRef = ref(
        database,
        `TOTAL TRANSACTION/BIDS/${year}/${month}/${date}/${
          gameId.split("___")[0]
        }/OPEN/Single Digit/${singleNumber}/USERS`
      );

      const singleSnapshot = await get(singleRef);
      const singleDigitUsersArray: UserListDataType[] = [];

      singleSnapshot.forEach((singlesnapshot) => {
        if (singlesnapshot.exists()) {
          const phone = singlesnapshot.key;
          const points = singlesnapshot.val();
          const gameName = "Single Digit";

          singleDigitUsersArray.push({
            gameName,
            phone,
            points,
          });
        }
        setSingleDigitUsers(singleDigitUsersArray);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const rateRef = ref(database, `ADMIN/GAME RATE/SD`);

    get(rateRef).then((rateSnapshot) => {
      if (rateSnapshot.exists()) {
        setSDGameRate(rateSnapshot.val());
      }
    });

    const unsubscribe = onValue(rateRef, (snapshot) => {
      if (snapshot.exists()) {
        setSDGameRate(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenClick = () => {
    fetchOpenUsers();
  };

  return (
    <div className="rewards">
      {gameId.split("___")[2] === "OPEN" && (
        <div className="rewards_container">
          <label>Market Result</label>
          <input
            type="text"
            placeholder="Enter 3 digits"
            pattern="[0-9]{3}" // Restrict to only numeric entries with exactly 3 digits
            title="Please enter exactly 3 numeric digits"
            maxLength={3}
            inputMode="numeric"
            value={openMarketResult}
            readOnly
            //   onChange={handleOpenInputChnage}
          />
          <button onClick={handleOpenClick}>Search Winners</button>
        </div>
      )}
      {gameId.split("___")[2] === "CLOSE" && (
        <div className="rewards_container">
          <label>Market Result</label>
          <div className="input_button">
            <input
              type="text"
              placeholder="Enter 3 digits"
              pattern="[0-9]{3}" // Restrict to only numeric entries with exactly 3 digits
              title="Please enter exactly 3 numeric digits"
              maxLength={3}
              inputMode="numeric"
              value={closeMarketResult}
              //   onChange={handleOpenInputChnage}
            />
            <button type="submit">Search Winners</button>
          </div>
        </div>
      )}

      <div className="winning_users_container">
        <h4>Winning Users</h4>
        <ul>
          {usersList &&
            usersList.map((users) => (
              <li key={users.phone}>
                <div className="users_list">
                  <div className="phone_gameName">
                    <div className="phone">+91 {users.phone} (Suraj)</div>
                    <div className="gameName">{users.gameName}</div>
                  </div>

                  <div className="winning_button">
                    <div className="winning_points">
                      {users.points}&#8377; x {gameRate / 10} Rate ={" "}
                      {users.points * (gameRate / 10)}
                      &#8377;
                    </div>
                    <button>
                      Send <span>Rewards</span>
                      <img src="/gift.png" alt="" height={15} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          {singleDigitUsers &&
            singleDigitUsers.map((users) => (
              <li key={users.phone}>
                <div className="users_list">
                  <div className="phone_gameName">
                    <div className="phone">+91 {users.phone} (Suraj)</div>
                    <div className="gameName">{users.gameName}</div>
                  </div>

                  <div className="winning_button">
                    <div className="winning_points">
                      {users.points}&#8377; x {SDgameRate / 10} Rate ={" "}
                      {users.points * (SDgameRate / 10)}
                      &#8377;
                    </div>
                    <button>
                      Send <span>Rewards</span>
                      <img src="/gift.png" alt="" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default SentRewards;
