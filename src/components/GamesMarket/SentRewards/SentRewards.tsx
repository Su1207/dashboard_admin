import { get, onValue, ref, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../firebase";
import "./SentRewards.scss";
import { toast } from "react-toastify";

type RewardsProps = {
  gameId: string;
};

type UserListDataType = {
  number: string;
  userName: string;
  gameName: string;
  phone: string;
  points: number;
};

// type TotalWinDataType = {
//   DATE: string;
//   MARKET_ID: string;
//   MARKET_NAME: string;
//   NAME: string;
//   NEW_POINTS: number;
//   NUMBER: string;
//   OPEN_CLOSE: string;
//   PHONE: string;
//   POINTS: string;
//   PREVIOUS_POINTS: number;
//   TYPE: string;
//   WIN_POINTS: number;
// };

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
  const [rewardSentMap, setRewardSentMap] = useState<{
    [key: string]: boolean;
  }>({});

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const date = currentDate.getDate().toString().padStart(2, "0");
  const hour = (currentDate.getHours() % 12 || 12).toString().padStart(2, "0");
  const min = currentDate.getMinutes().toString().padStart(2, "0");
  const sec = currentDate.getSeconds().toString().padStart(2, "0");

  const meridiem = currentDate.getHours() >= 12 ? "PM" : "AM";

  const dateString = `${date}-${month}-${year} | ${hour}:${min}:${sec} ${meridiem}`;

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
      const promises: Promise<void>[] = [];

      if (snapshot.exists()) {
        snapshot.child("USERS").forEach((userSnapshot) => {
          const phone = userSnapshot.key;
          const points = userSnapshot.val();

          const userRef = ref(database, `USERS/${phone}`);
          const promise1 = get(userRef).then((userSnapshot) => {
            if (userSnapshot.exists()) {
              const userName = userSnapshot.val().NAME;
              const number = openMarketResult;

              userListArray.push({
                number,
                userName,
                gameName,
                phone,
                points,
              });
            }
          });
          promises.push(promise1);
        });
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
          const promise2 = get(userRef).then((userSnapshot: any) => {
            if (userSnapshot.exists()) {
              const userName = userSnapshot.val().NAME.split(" ")[0];
              const number = String(openSingleNumber);

              singleDigitUsersArray.push({
                number,
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
      await Promise.all(promises);
      setUsersList(userListArray);
      setSingleDigitUsers(singleDigitUsersArray);
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
      const number = closeMarketResult;

      if (snapshot.exists()) {
        snapshot.child("USERS").forEach((userSnapshot) => {
          const phone = userSnapshot.key;
          const points = userSnapshot.val();

          const userRef = ref(database, `USERS/${phone}`);
          get(userRef).then((userSnapshot) => {
            if (userSnapshot.exists()) {
              const userName = userSnapshot.val().NAME;
              userListArray.push({
                number,
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
        }/OPEN/Jodi Digit/${closeJodiNumber}/USERS`
      );

      const HSnumber1 = `${openMarketResult}-${closeSingleNumber}`;
      const HSnumber2 = `${openSingleNumber}-${closeMarketResult}`;

      const HSRef1 = ref(
        database,
        `TOTAL TRANSACTION/BIDS/${year}/${month}/${date}/${
          gameId.split("___")[0]
        }/OPEN/Half Sangam/${HSnumber1}/USERS`
      );

      const HSRef2 = ref(
        database,
        `TOTAL TRANSACTION/BIDS/${year}/${month}/${date}/${
          gameId.split("___")[0]
        }/OPEN/Half Sangam/${HSnumber2}/USERS`
      );

      const FSNumber = `${openMarketResult}-${closeJodiNumber}-${closeMarketResult}`;

      const FSRef = ref(
        database,
        `TOTAL TRANSACTION/BIDS/${year}/${month}/${date}/${
          gameId.split("___")[0]
        }/OPEN/Full Sangam/${FSNumber}/USERS`
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
              const number = String(closeSingleNumber);

              singleDigitUsersArray.push({
                number,
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
              const number = String(closeJodiNumber);

              singleDigitUsersArray.push({
                number,
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
              const number = String(HSnumber1);

              singleDigitUsersArray.push({
                number,
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
              const number = String(HSnumber2);

              singleDigitUsersArray.push({
                number,
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
              const number = String(FSNumber);

              singleDigitUsersArray.push({
                number,
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

  // Function to handle local storage logic
  const updateLocalStorage = (
    phone: string,
    gameName: string,
    number: string
  ) => {
    localStorage.setItem(
      `${phone}${gameName}${gameId.split("___")[2]}${number}_rewardsSent`,
      "true"
    );
    setRewardSentMap((prevData) => ({
      ...prevData,
      [`${phone}${gameName}`]: true,
    }));
  };

  const sendRewards = async (
    userName: string,
    phone: string,
    gameName: string,
    number: string,
    points: number,
    winPoints: number
  ) => {
    const timestamp = Date.now();

    const usersAmountRef = ref(database, `USERS/${phone}`);
    const userSnapshot = await get(usersAmountRef);
    const previousPoints = userSnapshot.val().AMOUNT;

    const newPoints = previousPoints + winPoints;

    await update(usersAmountRef, { AMOUNT: newPoints });

    const totalTransactionTotalRef = ref(
      database,
      `TOTAL TRANSACTION/WIN/TOTAL/${gameId.split("___")[0]}/${timestamp}`
    );

    const totalTransactionDateWiseRef = ref(
      database,
      `TOTAL TRANSACTION/WIN/DATE WISE/${year}/${month}/${date}/${
        gameId.split("___")[0]
      }/${timestamp}`
    );

    const userTransactionDateWiseRef = ref(
      database,
      `USERS TRANSACTION/${phone}/WIN/DATE WISE/${year}/${month}/${date}/${
        gameId.split("___")[0]
      }/${timestamp}`
    );

    const userTransactionTotalRef = ref(
      database,
      `USERS TRANSACTION/${phone}/WIN/TOTAL/${
        gameId.split("___")[0]
      }/${timestamp}`
    );

    await set(totalTransactionTotalRef, {
      DATE: dateString,
      MARKET_ID: `${gameId.split("___")[0]}`,
      MARKET_NAME: `${gameId.split("___")[1]}`,
      NAME: userName,
      NEW_POINTS: newPoints,
      NUMBER: number,
      OPEN_CLOSE:
        gameName === "Jodi Digit" ||
        gameName === "Half Sangam" ||
        gameName === "Full Sangam"
          ? "OPEN"
          : `${gameId.split("___")[2]}`,
      PHONE: phone,
      POINTS: String(points),
      PREVIOUS_POINTS: previousPoints,
      TYPE: gameName,
      WIN_POINTS: winPoints,
    });

    await set(totalTransactionDateWiseRef, {
      DATE: dateString,
      MARKET_ID: `${gameId.split("___")[0]}`,
      MARKET_NAME: `${gameId.split("___")[1]}`,
      NAME: userName,
      NEW_POINTS: newPoints,
      NUMBER: number,
      OPEN_CLOSE:
        gameName === "Jodi Digit" ||
        gameName === "Half Sangam" ||
        gameName === "Full Sangam"
          ? "OPEN"
          : `${gameId.split("___")[2]}`,
      PHONE: phone,
      POINTS: String(points),
      PREVIOUS_POINTS: previousPoints,
      TYPE: gameName,
      WIN_POINTS: winPoints,
    });

    await set(userTransactionDateWiseRef, {
      DATE: dateString,
      MARKET_ID: `${gameId.split("___")[0]}`,
      MARKET_NAME: `${gameId.split("___")[1]}`,
      NAME: userName,
      NEW_POINTS: newPoints,
      NUMBER: number,
      OPEN_CLOSE:
        gameName === "Jodi Digit" ||
        gameName === "Half Sangam" ||
        gameName === "Full Sangam"
          ? "OPEN"
          : `${gameId.split("___")[2]}`,
      PHONE: phone,
      POINTS: String(points),
      PREVIOUS_POINTS: previousPoints,
      TYPE: gameName,
      WIN_POINTS: winPoints,
    });

    await set(userTransactionTotalRef, {
      DATE: dateString,
      MARKET_ID: `${gameId.split("___")[0]}`,
      MARKET_NAME: `${gameId.split("___")[1]}`,
      NAME: userName,
      NEW_POINTS: newPoints,
      NUMBER: number,
      OPEN_CLOSE:
        gameName === "Jodi Digit" ||
        gameName === "Half Sangam" ||
        gameName === "Full Sangam"
          ? "OPEN"
          : `${gameId.split("___")[2]}`,
      PHONE: phone,
      POINTS: String(points),
      PREVIOUS_POINTS: previousPoints,
      TYPE: gameName,
      WIN_POINTS: winPoints,
    });

    updateLocalStorage(phone, gameName, number);
    toast.success("Rewards successfully sent");
  };

  //   // When the component mounts
  //   useEffect(() => {
  //     const isRewardsSent =
  //       localStorage.getItem(`${phone}${gameName}_rewardsSent`) === "true";

  //     if (isRewardsSent) {
  //       // Update the state accordingly
  //       setRewardSentMap((prevData) => ({
  //         ...prevData,
  //         [`${phone}${gameName}`]: true,
  //       }));
  //     }
  //   }, [phone,gameName]);

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

      {(singleDigitUsers && singleDigitUsers?.length > 0) ||
      (usersList && usersList.length > 0) ? (
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
                      <div className="gameName">
                        {users.gameName} ({users.number})
                      </div>
                    </div>
                    <div className="winning_button">
                      <div className="winning_points">
                        {users.points}&#8377; x {gameRate} Rate ={" "}
                        {users.points * gameRate}
                        &#8377;
                      </div>
                      <button
                        onClick={() =>
                          sendRewards(
                            users.userName,
                            users.phone,
                            users.gameName,
                            users.number,
                            users.points,
                            users.points * gameRate
                          )
                        }
                        disabled={
                          localStorage.getItem(
                            `${users.phone}${users.gameName}${
                              gameId.split("___")[2]
                            }${users.number}_rewardsSent`
                          ) === "true" ||
                          rewardSentMap[`${users.phone}${users.gameName}`]
                        }
                        className={
                          localStorage.getItem(
                            `${users.phone}${users.gameName}${
                              gameId.split("___")[2]
                            }${users.number}_rewardsSent`
                          ) === "true" ||
                          rewardSentMap[`${users.phone}${users.gameName}`]
                            ? "rewards_sent"
                            : ""
                        }
                      >
                        {localStorage.getItem(
                          `${users.phone}${users.gameName}${
                            gameId.split("___")[2]
                          }${users.number}_rewardsSent`
                        ) === "true" ||
                        rewardSentMap[`${users.phone}${users.gameName}`] ? (
                          <p className="button_text">
                            ✓ Sent <span>Rewards</span>
                          </p>
                        ) : (
                          <>
                            Send <span>Rewards</span>
                            <img src="/gift.png" alt="" />
                          </>
                        )}
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
                      <div className="gameName">
                        {users.gameName} ({users.number})
                      </div>
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
                      <button
                        onClick={() =>
                          sendRewards(
                            users.userName,
                            users.phone,
                            users.gameName,
                            users.number,
                            users.points,
                            users.points *
                              (users.gameName === "Single Digit"
                                ? rate.SDGameRate
                                : users.gameName === "Jodi Digit"
                                ? rate.JDGameRate
                                : users.gameName === "Half Sangam"
                                ? rate.HSGameRate
                                : rate.FSGameRate)
                          )
                        }
                        disabled={
                          localStorage.getItem(
                            `${users.phone}${users.gameName}${
                              gameId.split("___")[2]
                            }${users.number}_rewardsSent`
                          ) === "true" ||
                          rewardSentMap[`${users.phone}${users.gameName}`]
                        }
                        className={
                          localStorage.getItem(
                            `${users.phone}${users.gameName}${
                              gameId.split("___")[2]
                            }${users.number}_rewardsSent`
                          ) === "true" ||
                          rewardSentMap[`${users.phone}${users.gameName}`]
                            ? "rewards_sent"
                            : ""
                        }
                      >
                        {localStorage.getItem(
                          `${users.phone}${users.gameName}${
                            gameId.split("___")[2]
                          }${users.number}_rewardsSent`
                        ) === "true" ||
                        rewardSentMap[`${users.phone}${users.gameName}`] ? (
                          <p className="button_text">
                            ✓ Sent <span>Rewards</span>
                          </p>
                        ) : (
                          <>
                            Send <span>Rewards</span>
                            <img src="/gift.png" alt="" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SentRewards;
