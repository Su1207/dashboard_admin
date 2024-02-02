import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { WinDetails } from "../TransactionContext";
import "./WinTransaction.scss";
import { GiTwoCoins } from "react-icons/gi";
import { useState } from "react";
import { parse, isValid } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";

type CustomRow = WinDetails;

interface WinDataGridProps {
  winData: CustomRow[];
}

const WinDataGrid: React.FC<WinDataGridProps> = ({ winData }) => {
  const [selectDate, setSelectDate] = useState<Date | null>(null);

  //   const rows = winData.map((winDataNode) => {
  //     const winDetails: WinDetails = {
  //       winPoints: winDataNode.winPoints,
  //       marketName: winDataNode.marketName,
  //       points: winDataNode.points,
  //       marketId: winDataNode.marketId || "", // Add default value or handle appropriately
  //       name: winDataNode.name || "", // Add default value or handle appropriately
  //       newPoints: winDataNode.newPoints || 0, // Add default value or handle appropriately
  //       number: winDataNode.number || "", // Add default value or handle appropriately
  //       date: winDataNode.date,
  //       openClose: winDataNode.openClose,
  //       phone: winDataNode.phone,
  //       previousPoints: winDataNode.previousPoints,
  //       type: winDataNode.type,
  //     };
  //     return winDetails;
  //   });

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
      renderCell: (params) => (
        <div style={{ textAlign: "center" }}>
          <div>{params.value.split(" | ")[0]}</div>
          <div>{params.value.split(" | ")[1]}</div>
        </div>
      ),
    },

    {
      field: "particulars",
      headerName: "Particulars",
      width: 400,
      renderCell: (params) => (
        <div className="row_details">
          Win ( {params.row.marketName} : {params.row.type} :{" "}
          {params.row.openClose} ) : {params.row.number}
        </div>
      ),
    },

    {
      field: "previousPoints",
      headerName: "Previous Points",
      width: 150,
      renderCell: (params) => (
        <div className="points">
          <div> {params.row.previousPoints} </div>

          <GiTwoCoins />
        </div>
      ),
    },
    {
      field: "winPoints",
      headerName: "Points",
      width: 120,
      renderCell: (params) => (
        <div className="add_points">+{params.row.winPoints}</div>
      ),
    },
    {
      field: "currentPoints",
      headerName: "Current Points",
      width: 150,
      renderCell: (params) => (
        <div className="points">
          <div>{params.row.newPoints}</div>
          <GiTwoCoins />
        </div>
      ),
    },
  ];

  const getRowId = (row: CustomRow) => `${row.date}${row.number}`;
  const filterDataByDate = (data: CustomRow[]) => {
    if (!selectDate) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      setSelectDate(currentDate);
    }

    if (selectDate) {
      return data.filter((row) => {
        const rowDate = parseCustomDateString(row.date);

        if (!rowDate) {
          return false; // Skip rows with invalid dates
        }

        const rowDateWithoutTime = new Date(
          rowDate.getFullYear(),
          rowDate.getMonth(),
          rowDate.getDate()
        );

        // console.log("row date", rowDateWithoutTime);
        // console.log("select date", selectDate);

        return rowDateWithoutTime.getTime() === selectDate.getTime();
      });
    }

    return data;
  };

  function parseCustomDateString(dateString: string) {
    const parseDate = parse(dateString, "dd-MMM-yyyy | hh:mm:ss a", new Date());

    if (!isValid(parseDate)) {
      console.error(`Invalid Date: ${dateString}`);
      // Handle the error gracefully, e.g., return a default date or throw an exception.
      return null;
    }

    return parseDate;
  }

  const handleDateChange = (date: Date | null) => {
    setSelectDate(date);
  };

  const filtereData = filterDataByDate(winData);

  return (
    <div className="dataTable_win">
      <div className="date-picker-container">
        <div className="date-pic">
          <DatePicker
            className="datePicker"
            selected={selectDate}
            onChange={handleDateChange}
            dateFormat="dd-MMM-yyyy"
            maxDate={new Date()} // Set the maximum date to the current date

            //   placeholderText="Select a Date"
          />
          <div className="calendar">
            <FaCalendarAlt />
          </div>
        </div>
      </div>
      {filtereData && filtereData.length > 0 ? (
        <DataGrid
          className="dataGrid_win"
          rows={filtereData}
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
          //   checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          getRowId={getRowId}
        />
      ) : (
        <p>No Data Available for the day</p>
      )}
    </div>
  );
};

export default WinDataGrid;
