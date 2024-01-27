import { useEffect, useState } from "react";
import "./MarketBidDetails.scss";
import { get, ref } from "firebase/database";
import { database } from "../../../firebase";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import { useBidComponentContext } from "../BidComponentContext";
import { useNavigate } from "react-router-dom";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import RelatedUserDetails from "./RelatedUserDetails/RelatedUserDetails";

export interface MarketDetailsType {
  marketName: string;
  numbers: { [number: string]: number };
  marketTotalPoints: number;
}

export type UserDetailsType = {
  phoneNumber: string;
  points: number;
  userName: string;
};

const MarketbidDetails: React.FC<{ gameKey: string }> = ({ gameKey }) => {
  const { bidDetails, setbidDetails } = useBidComponentContext();
  const [userDetails, setUserDetails] = useState<UserDetailsType[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [gameName, setGameName] = useState("");
  const [clickedNumber, setClickedNumber] = useState(false);

  const { selectedBidDate } = useBidComponentContext();

  useEffect(() => {
    const fetchbidDetails = async () => {
      const gameActualKey = gameKey.split("___")[1];
      const openClose = gameKey.split("___")[0];

      setGameName(gameKey.split("___")[2]);

      //   const date = gameKey.split("___")[3];

      const currentYear = selectedBidDate.getFullYear();
      const currentMonth = (selectedBidDate.getMonth() + 1)
        .toString()
        .padStart(2, "0"); // Ensure two digits
      const currentDay = selectedBidDate.getDate().toString().padStart(2, "0");

      try {
        const bidRef = ref(
          database,
          `TOTAL TRANSACTION/BIDS/${currentYear}/${currentMonth}/${currentDay}/${gameActualKey}/${openClose}`
        );

        const marketDetails: MarketDetailsType[] = [];
        let totalPoint = 0;

        const bidSnapshot = await get(bidRef);

        bidSnapshot.forEach((bidsnapshot) => {
          const marketName = bidsnapshot.key || "";
          const numbers: { [number: string]: number } = {};
          let marketTotalPoints = 0;

          bidsnapshot.forEach((numberSnapshot) => {
            const number = numberSnapshot.key;
            const points = numberSnapshot.val().POINTS || 0;

            totalPoint += points;
            marketTotalPoints += points;

            numbers[number] = points;
          });

          marketDetails.push({
            marketName,
            numbers,
            marketTotalPoints,
          });
        });

        // Define the order for sorting
        const sortOrder = [
          "Single Digit",
          "Jodi Digit",
          "Single Panel",
          "Double Panel",
          "Triple Panel",
          "Half Sangam",
          "Full Sangam",
        ];

        // Sort the marketDetails array based on the sortOrder
        marketDetails.sort(
          (a, b) =>
            sortOrder.indexOf(a.marketName) - sortOrder.indexOf(b.marketName)
        );

        setbidDetails(marketDetails);
        setTotalPoints(totalPoint);

        // const marketsnapshot =
      } catch (err) {
        console.log(err);
      }
    };
    fetchbidDetails();
  }, [gameKey]);

  //   console.log(bidDetails);

  const handleColumnClick = async (row: any, columnName: string) => {
    try {
      const gameActualKey = gameKey.split("___")[1];
      const openClose = gameKey.split("___")[0];
      const currentYear = selectedBidDate.getFullYear();
      const currentMonth = (selectedBidDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const currentDay = selectedBidDate.getDate().toString().padStart(2, "0");

      const bidRef = ref(
        database,
        `TOTAL TRANSACTION/BIDS/${currentYear}/${currentMonth}/${currentDay}/${gameActualKey}/${openClose}/${columnName}/${
          row[columnName].split(" = ")[0]
        }/USERS`
      );

      const usersSnapshot = await get(bidRef);

      const usersList: UserDetailsType[] = [];
      const promises: Promise<void>[] = [];

      usersSnapshot.forEach((userSnapshot) => {
        let userName = "";

        const phoneNumber = userSnapshot.key;
        const points = userSnapshot.val();

        const userRef = ref(database, `USERS/${phoneNumber}`);

        const promise = get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            userName = snapshot.val().NAME;
          }
          usersList.push({ phoneNumber, points, userName });
        });
        promises.push(promise);
      });

      await Promise.all(promises);
      setClickedNumber(!clickedNumber);
      setUserDetails(usersList);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 70 },
    ...bidDetails.map((market) => ({
      field: market.marketName,
      headerName: market.marketName,
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div
          onClick={() => handleColumnClick(params.row, market.marketName)}
          style={{ cursor: "pointer" }}
        >
          {params.row[market.marketName]}
        </div>
      ),
    })),
  ];

  const rows = Array.from(
    {
      length: Math.max(
        ...bidDetails.map((market) => Object.keys(market.numbers).length)
      ),
    },
    (_, index) => ({
      id: index + 1,
      ...bidDetails.reduce(
        (acc, market) => ({
          ...acc,
          [market.marketName]: Object.entries(market.numbers)[index]
            ? `${Object.entries(market.numbers)[index][0]} = ${
                Object.entries(market.numbers)[index][1]
              } ₹`
            : "", // Display "number = points ₹" only if both number and points exist
        }),
        {}
      ),
    })
  );

  const navigate = useNavigate();

  const handleBackClick = () => {
    // Navigate back to the main page with the selected date
    navigate(`/bid`);
  };

  return (
    <div className="dataTable_deposit">
      {clickedNumber && (
        <RelatedUserDetails
          userDetails={userDetails}
          setClickedNumber={setClickedNumber}
        />
      )}
      <button className="back_button" onClick={handleBackClick}>
        &lt; back
      </button>
      <div className="bid_header">
        <h2>
          {gameName} <span>({gameKey.split("___")[0]})</span>
        </h2>
        <h4>Total - {totalPoints} &#8377;</h4>
      </div>

      <div className="particular_game_data">
        <div className="game_data_title">
          <h3>Game Amount</h3>
          <MonetizationOnRoundedIcon className="transaction_icon" />
        </div>

        {bidDetails &&
          bidDetails.map((bid) => (
            <div key={bid.marketName} className="particular_game_data_list">
              <div className="particular_game_data_name">{bid.marketName}</div>
              <div className="particular_game_data_amount">
                {bid.marketTotalPoints} &#8377;
              </div>
            </div>
          ))}
      </div>
      {bidDetails ? (
        <DataGrid
          className="dataGrid_deposit"
          rows={rows}
          columns={columns}
          // checkboxSelection
          //   initialState={{
          //     pagination: {
          //       paginationModel: {
          //         pageSize: 15,
          //       },
          //     },
          //   }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          //   pageSizeOptions={[15]}
          // checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
        />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};
export default MarketbidDetails;
