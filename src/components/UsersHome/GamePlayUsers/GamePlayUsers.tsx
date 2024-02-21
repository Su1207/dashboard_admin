import { useEffect, useState } from "react";
import "./GameplayUsers.scss";
import { get, ref } from "firebase/database";
import { database } from "../../../firebase";

type UsersGameDataType = {
  phone: string;
  name: string;
  markets: string[];
  games: Set<string>;
};

const GamePlayUsers = () => {
  const [usersGameData, setUsersGameData] = useState<
    UsersGameDataType[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = ref(database, "USERS TRANSACTION");

        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          // const promises: Promise<void>[] = [];

          const usersGameArray: UsersGameDataType[] | null = [];

          snapshot.forEach((usersSnapshot) => {
            const gameName: string[] = [];
            let Name: string = "";
            let phone: string = "";
            const games: Set<string> = new Set();

            const gamesnapshot = usersSnapshot
              .child("BID")
              .child("DATE WISE")
              .child(`${year}`)
              .child(`${month}`)
              .child(`${day}`);

            if (gamesnapshot.exists()) {
              gamesnapshot.forEach((gameSnapshot: any) => {
                if (gameSnapshot.exists()) {
                  const timestampKey = Object.keys(gameSnapshot.val())[0];
                  const timestamp = gameSnapshot.child(timestampKey).val();
                  const name = timestamp.NAME;
                  const marketName = timestamp.MARKET_NAME;
                  const number = timestamp.UID;
                  gameName.push(marketName);
                  Name = name;
                  phone = number;

                  gameSnapshot.forEach((timesnap: any) => {
                    games.add(timesnap.val().GAME);
                  });
                }
              });

              usersGameArray.push({
                phone: phone,
                name: Name,
                markets: gameName,
                games: games,
              });
            }
          });

          setUsersGameData(usersGameArray);
        } else {
          setUsersGameData(null);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log(usersGameData);

  return (
    <div className="">
      <h4>TODAY GAMEPLAY USERS</h4>

      {isLoading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="gamePlay_users">
          {usersGameData && usersGameData?.length > 0 ? (
            <div className="users_list">
              {usersGameData.map((data) => (
                <div className="users_game_data_container" key={data.phone}>
                  <div className="users_game_data">
                    <div className="user_data">
                      <img src="user.png" alt="" className="user_img_icon" />
                      <div className="user_detail">
                        <div className="users_name">{data.name}</div>
                        <div className="user_phone">+91{data.phone}</div>
                      </div>
                    </div>

                    <div className="game_data">
                      <ul className="games-list">
                        {data.markets.map((game) => (
                          <li key={game}>{game}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="game_data">
                      <ul className="games-list">
                        {[...data.games].map((game) => (
                          <li key={game}>{game}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bottom_border"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="noData gamePlayer_noData">
              <img src="noData.gif" alt="" className="noData-img" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GamePlayUsers;
