import { useEffect, useState } from "react";
import "./MarketBidDetails.scss";
import { get, ref } from "firebase/database";
import { database } from "../../../firebase";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useBidComponentContext } from "../BidComponentContext";
import { useNavigate } from "react-router-dom";

interface MarketDetailsType {
  marketName: string;
  numbers: { [number: string]: number };
}

const MarketbidDetails: React.FC<{ gameKey: string }> = ({ gameKey }) => {
  const [bidDetails, setbidDetails] = useState<MarketDetailsType[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [gameName, setGameName] = useState("");

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

      console.log(`${currentYear}/${currentMonth}/${currentDay}`);

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

          bidsnapshot.forEach((numberSnapshot) => {
            const number = numberSnapshot.key;
            const points = numberSnapshot.val().POINTS || 0;

            totalPoint += points;
            numbers[number] = points;
          });

          marketDetails.push({
            marketName,
            numbers,
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

  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 70 },
    ...bidDetails.map((market) => ({
      field: market.marketName,
      headerName: market.marketName,
      width: 150,
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
          [market.marketName]:
            Object.entries(market.numbers)[index]?.join(" = ") + " ₹" || "",
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
      <button className="back_button" onClick={handleBackClick}>
        &lt; back
      </button>
      <div className="bid_header">
        <h2>
          {gameName} <span>({gameKey.split("___")[0]})</span>
        </h2>
        <h4>Total - {totalPoints} &#8377;</h4>
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
