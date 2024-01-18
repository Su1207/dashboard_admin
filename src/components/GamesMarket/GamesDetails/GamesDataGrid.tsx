import { GridColDef, DataGrid, GridToolbar } from "@mui/x-data-grid";
import { GameData } from "./GamesDetails";
import "./gamesDetails.scss";
import { ref, remove } from "firebase/database";
import { database } from "../../../firebase";
import { toast } from "react-toastify";
import { useState } from "react";
import EditGame from "../EditGames/EditGame";
import UpdateResult from "../UpdateResult/UpdateResult";

type ColumnRow = GameData;

interface gameDataGridProps {
  gameData: ColumnRow[];
}

const GamesDataGrid: React.FC<gameDataGridProps> = ({ gameData }) => {
  const [editGame, setEditGame] = useState(false);
  const [gameId, setGameId] = useState("");
  const getTime = (time: number) => {
    const date = new Date(time);

    // Get hours, minutes, and AM/PM
    const hours = (date.getHours() % 12 || 12).toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    // Format the time as a string
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return formattedTime;
  };

  const handleEdit = (gameid: string) => {
    setEditGame(!editGame);
    setGameId(gameid);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Market",
      width: 150,
      cellClassName: "market_name",
    },
    {
      field: "open",
      headerName: "Open",
      width: 120,
    },
    {
      field: "close",
      headerName: "Close",
      width: 120,
    },
    {
      field: "disable",
      headerName: "Holiday",
      width: 120,
      renderCell: (params) => (
        <div>{params.row.disable === "true" ? "Yes" : "No"}</div>
      ),
    },
    {
      field: "hidden",
      headerName: "Hidden",
      width: 120,
      renderCell: (params) => (
        <div>{params.row.hidden === "true" ? "Yes" : "No"}</div>
      ),
    },
    {
      field: "result",
      headerName: "Result",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div className="actions_icons">
          <img
            style={{ cursor: "pointer" }}
            src="view.svg"
            alt=""
            onClick={() => handleEdit(params.row.id)}
          />
          <img
            style={{ cursor: "pointer" }}
            src="delete.svg"
            alt=""
            onClick={() => handleDelete(params.row.id)}
          />
        </div>
      ),
    },
    {
      field: "updateResult",
      headerName: "Update Result",
      width: 140,
      renderCell: (params) => <UpdateResult gameId={params.row.id} />,
    },
  ];

  const handleDelete = (gameId: string) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete the game ?`
    );

    if (!userConfirmed) {
      return;
    }

    const gameRef = ref(database, `GAMES/${gameId}`);
    const resultRef = ref(database, `RESULTS/${gameId}`);

    remove(gameRef)
      .then(() => {
        toast.success(`Game ${gameId} deleted successfully`);

        remove(resultRef);
      })
      .catch((error) => {
        console.error("Error deleting user", error);
        toast.error("Error deleting user");
      });
  };

  const rows = gameData.map((game) => {
    const timestampClose = getTime(game.CLOSE);
    const timestampOpen = getTime(game.OPEN);

    return {
      id: game.key,
      name: game.NAME,
      close: timestampClose,
      open: timestampOpen,
      hidden: game.HIDDEN,
      disable: game.DISABLED,
      result: game.RESULT,
    };
  });
  return (
    <div className="dataTable">
      {editGame && <EditGame gameId={gameId} setEditGame={setEditGame} />}
      {rows.length > 0 ? (
        <DataGrid
          className="dataGrid"
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 7,
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
          pageSizeOptions={[7]}
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

export default GamesDataGrid;
