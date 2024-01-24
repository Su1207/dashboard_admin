import { useEffect, useState } from "react";
import "./MarketBidDetails.scss";
import { get, ref } from "firebase/database";
import { database } from "../../../firebase";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";

interface MarketDetailsType {
  marketName: string;
  numbers: { [number: string]: number };
}

const MarketbidDetails: React.FC<{ gameKey: string }> = ({ gameKey }) => {
  const [bidDetails, setbidDetails] = useState<MarketDetailsType[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [gameName, setGameName] = useState("");

  useEffect(() => {
    const fetchbidDetails = async () => {
      const gameActualKey = gameKey.split("___")[1];
      const openClose = gameKey.split("___")[0];

      setGameName(gameKey.split("___")[2]);

      const date = gameKey.split("___")[3];
      console.log(date);

      console.log(openClose);

      try {
        const bidRef = ref(
          database,
          `TOTAL TRANSACTION/BIDS/${date.split("-")[2]}/${date.split("-")[1]}/${
            date.split("-")[0]
          }/${gameActualKey}/${openClose}`
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
            Object.entries(market.numbers)[index]?.join(" = ₹ ") || "",
        }),
        {}
      ),
    })
  );

  return (
    <div className="dataTable_deposit">
      <div className="bid_header">
        <h2>
          {gameName} <span>({gameKey.split("___")[0]})</span>
        </h2>
        <h4>Total - &#8377; {totalPoints}</h4>
      </div>
      {bidDetails ? (
        <DataGrid
          className="dataGrid_deposit"
          rows={rows}
          columns={columns}
          // checkboxSelection
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 15,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[15]}
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
