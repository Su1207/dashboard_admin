import { get, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../firebase";
import "./SentRewards.scss";

type RewardsProps = {
  gameId: string;
};

type UserListDataType = {
  userName: string;
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
  const [rate, setRate] = useState({
    SDGameRate: 0,
    JDGameRate: 0,
    HSGameRate: 0,
    FSGameRate: 0,
  });
  const [showOpenWinners, setShowOpenWinners] = useState(false);

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
  }, []);

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

          const userRef = ref(database, `USERS/${phone}`);
          get(userRef).then((userSnapshot) => {
            if (userSnapshot.exists()) {
              const userName = userSnapshot.val().NAME;
              userListArray.push({
                userName,
                gameName,
                phone,
                points,
              });
            }
          });
        });

        setUsersList(userListArray);
      } else {
        console.log("No users found");
      }

      const openSingleNumber =
        (parseInt(openMarketResult[0]) +
          parseInt(openMarketResult[1]) +
          parseInt(openMarketResult[2])) %
        10;

      const singleRef = ref(
        database,
        `TOTAL TRANSACTION/BIDS/${year}/${month}/${date}/${
          gameId.split("___")[0]
        }/OPEN/Single Digit/${openSingleNumber}/USERS`
      );

      const singleSnapshot = await get(singleRef);
      const singleDigitUsersArray: UserListDataType[] = [];

      singleSnapshot.forEach((singlesnapshot) => {
        if (singlesnapshot.exists()) {
          const phone = singlesnapshot.key;
          const points = singlesnapshot.val();
          const gameName = "Single Digit";

          const userRef = ref(database, `USERS/${phone}`);
          get(userRef).then((userSnapshot: any) => {
            if (userSnapshot.exists()) {
              const userName = userSnapshot.val().NAME.split(" ")[0];

              singleDigitUsersArray.push({
                userName,
                gameName,
                phone,
                points,
              });
            }
          });
        }
        setSingleDigitUsers(singleDigitUsersArray);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCloseUsers = async () => {
    try {
      const a = parseInt(closeMarketResult[0]);
      const b = parseInt(closeMarketResult[1]);
      const c = parseInt(closeMarketResult[2]);
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
        }/CLOSE/${gameName}/${closeMarketResult}`
      );

      const snapshot = await get(userRewardsRef);
      const userListArray: UserListDataType[] = [];

      if (snapshot.exists()) {
        snapshot.child("USERS").forEach((userSnapshot) => {
          const phone = userSnapshot.key;
          const points = userSnapshot.val();

          const userRef = ref(database, `USERS/${phone}`);
          get(userRef).then((userSnapshot) => {
            if (userSnapshot.exists()) {
              const userName = userSnapshot.val().NAME;
              userListArray.push({
                userName,
                gameName,
                phone,
                points,
              });
            }
          });
        });

        setUsersList(userListArray);
      } else {
        console.log("No users found");
      }

      const openSingleNumber =
        (parseInt(openMarketResult[0]) +
          parseInt(openMarketResult[1]) +
          parseInt(openMarketResult[2])) %
        10;

      const closeSingleNumber =
        (parseInt(closeMarketResult[0]) +
          parseInt(closeMarketResult[1]) +
          parseInt(closeMarketResult[2])) %
        10;

      const closeJodiNumber = `${
        (parseInt(openMarketResult[0]) +
          parseInt(openMarketResult[1]) +
          parseInt(openMarketResult[2])) %
        10
      }${
        (parseInt(closeMarketResult[0]) +
          parseInt(closeMarketResult[1]) +
          parseInt(closeMarketResult[2])) %
        10
      }`;

      const singleRef = ref(
        database,
        `TOTAL TRANSACTION/BIDS/${year}/${month}/${date}/${
          gameId.split("___")[0]
        }/CLOSE/Single Digit/${closeSingleNumber}/USERS`
      );

      const jodiRef = ref(
        database,
        `TOTAL TRANSACTION/BIDS/${year}/${month}/${date}/${
          gameId.split("___")[0]
        }/CLOSE/Jodi Digit/${closeJodiNumber}/USERS`
      );

      const HSnumber1 = `${openMarketResult}-${closeSingleNumber}`;
      const HSnumber2 = `${openSingleNumber}-${closeMarketResult}`;

      const HSRef1 = ref(
        database,
        `TOTAL TRANSACTION/BIDS/${year}/${month}/${date}/${
          gameId.split("___")[0]
        }/CLOSE/Half Sangam/${HSnumber1}/USERS`
      );

      const HSRef2 = ref(
        database,
        `TOTAL TRANSACTION/BIDS/${year}/${month}/${date}/${
          gameId.split("___")[0]
        }/CLOSE/Half Sangam/${HSnumber2}/USERS`
      );

      const FSNumber = `${openMarketResult}-${closeJodiNumber}-${closeMarketResult}`;

      const FSRef = ref(
        database,
        `TOTAL TRANSACTION/BIDS/${year}/${month}/${date}/${
          gameId.split("___")[0]
        }/CLOSE/Full Sangam/${FSNumber}/USERS`
      );

      const singleSnapshot = await get(singleRef);
      const JodiSnapshot = await get(jodiRef);
      const FSSnapshot = await get(FSRef);
      const HSSnapshot1 = await get(HSRef1);
      const HSSnapshot2 = await get(HSRef2);

      const singleDigitUsersArray: UserListDataType[] = [];
      const promises: Promise<void>[] = [];

      singleSnapshot.forEach((singlesnapshot) => {
        if (singlesnapshot.exists()) {
          const phone = singlesnapshot.key;
          const points = singlesnapshot.val();
          const gameName = "Single Digit";

          const userRef = ref(database, `USERS/${phone}`);
          const promise = get(userRef).then((userSnapshot: any) => {
            if (userSnapshot.exists()) {
              const userName = userSnapshot.val().NAME.split(" ")[0];

              singleDigitUsersArray.push({
                userName,
                gameName,
                phone,
                points,
              });
            }
          });
          promises.push(promise);
        }
      });

      JodiSnapshot.forEach((jodisnapshot) => {
        if (jodisnapshot.exists()) {
          const phone = jodisnapshot.key;
          const points = jodisnapshot.val();
          const gameName = "Jodi Digit";

          const userRef = ref(database, `USERS/${phone}`);
          const promise1 = get(userRef).then((userSnapshot: any) => {
            if (userSnapshot.exists()) {
              const userName = userSnapshot.val().NAME.split(" ")[0];

              singleDigitUsersArray.push({
                userName,
                gameName,
                phone,
                points,
              });
            }
          });
          promises.push(promise1);
        }
      });

      HSSnapshot1.forEach((HSsnapshot) => {
        if (HSsnapshot.exists()) {
          const phone = HSsnapshot.key;
          const points = HSsnapshot.val();
          const gameName = "Half Sangam";

          const userRef = ref(database, `USERS/${phone}`);
          const promise2 = get(userRef).then((userSnapshot: any) => {
            if (userSnapshot.exists()) {
              const userName = userSnapshot.val().NAME.split(" ")[0];

              singleDigitUsersArray.push({
                userName,
                gameName,
                phone,
                points,
              });
            }
          });
          promises.push(promise2);
        }
      });

      HSSnapshot2.forEach((HSsnapshot) => {
        if (HSsnapshot.exists()) {
          const phone = HSsnapshot.key;
          const points = HSsnapshot.val();
          const gameName = "Half Sangam";

          const userRef = ref(database, `USERS/${phone}`);
          const promise4 = get(userRef).then((userSnapshot: any) => {
            if (userSnapshot.exists()) {
              const userName = userSnapshot.val().NAME.split(" ")[0];

              singleDigitUsersArray.push({
                userName,
                gameName,
                phone,
                points,
              });
            }
          });
          promises.push(promise4);
        }
      });

      FSSnapshot.forEach((FSsnapshot) => {
        if (FSsnapshot.exists()) {
          const phone = FSsnapshot.key;
          const points = FSsnapshot.val();
          const gameName = "Full Sangam";

          const userRef = ref(database, `USERS/${phone}`);
          const promise3 = get(userRef).then((userSnapshot: any) => {
            if (userSnapshot.exists()) {
              const userName = userSnapshot.val().NAME.split(" ")[0];

              singleDigitUsersArray.push({
                userName,
                gameName,
                phone,
                points,
              });
            }
          });
          promises.push(promise3);
        }
      });
      await Promise.all(promises);
      setSingleDigitUsers(singleDigitUsersArray);
    } catch (err) {
      console.log(err);
    }
  };

  //   console.log(usersList);

  useEffect(() => {
    const rateRef = ref(database, `ADMIN/GAME RATE`);

    get(rateRef).then((rateSnapshot) => {
      if (rateSnapshot.exists()) {
        setRate({
          SDGameRate: rateSnapshot.val().SD,
          JDGameRate: rateSnapshot.val().JD,
          HSGameRate: rateSnapshot.val().HS,
          FSGameRate: rateSnapshot.val().FS,
        });
      }
    });

    const unsubscribe = onValue(rateRef, (rateSnapshot) => {
      if (rateSnapshot.exists()) {
        setRate({
          SDGameRate: rateSnapshot.val().SD,
          JDGameRate: rateSnapshot.val().JD,
          HSGameRate: rateSnapshot.val().HS,
          FSGameRate: rateSnapshot.val().FS,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenClick = () => {
    fetchOpenUsers();
    setShowOpenWinners(!showOpenWinners);
  };

  const hanldeCloseClick = () => {
    fetchCloseUsers();
    setShowOpenWinners(!showOpenWinners);
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
          <button onClick={hanldeCloseClick}>Search Winners</button>
        </div>
      )}

      {showOpenWinners && (
        <div className="winning_users_container">
          <h4>Winning Users</h4>
          <ul>
            {usersList &&
              usersList.map((users) => (
                <li key={`${users.phone}${users.gameName}`}>
                  <div className="users_list">
                    <div className="phone_gameName">
                      <div className="phone">
                        +91 {users.phone}{" "}
                        <span>({users.userName.split(" ")[0]})</span>
                      </div>
                      <div className="gameName">{users.gameName}</div>
                    </div>
                    <div className="winning_button">
                      <div className="winning_points">
                        {users.points}&#8377; x {gameRate} Rate ={" "}
                        {users.points * gameRate}
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
            {singleDigitUsers &&
              singleDigitUsers.map((users) => (
                <li key={`${users.phone}${users.gameName}`}>
                  <div className="users_list">
                    <div className="phone_gameName">
                      <div className="phone">
                        +91 {users.phone}{" "}
                        <span>({users.userName.split(" ")[0]})</span>
                      </div>
                      <div className="gameName">{users.gameName}</div>
                    </div>

                    <div className="winning_button">
                      <div className="winning_points">
                        {users.points}&#8377; x{" "}
                        {users.gameName === "Single Digit"
                          ? rate.SDGameRate
                          : users.gameName === "Jodi Digit"
                          ? rate.JDGameRate
                          : users.gameName === "Half Sangam"
                          ? rate.HSGameRate
                          : rate.FSGameRate}{" "}
                        Rate ={" "}
                        {users.points *
                          (users.gameName === "Single Digit"
                            ? rate.SDGameRate
                            : users.gameName === "Jodi Digit"
                            ? rate.JDGameRate
                            : users.gameName === "Half Sangam"
                            ? rate.HSGameRate
                            : rate.FSGameRate)}
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
      )}
    </div>
  );
};

export default SentRewards;
