import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { PayoutDataType } from "./PayoutComponent";
import "./PayoutComponent.scss";

interface PyoutGridProps {
  payoutData: PayoutDataType[] | null;
}

const PayoutGrid: React.FC<PyoutGridProps> = ({ payoutData }) => {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Phone",
      width: 120,
      cellClassName: "bidPhone_column",
      renderCell: (params) => (
        <div>
          <div>{params.row.id.split("-")[0]}</div>
          <div className="user_name">{params.row.name}</div>
        </div>
      ),
    },
    {
      field: "acc_name",
      headerName: "Account Name",
      width: 130,
    },
    {
      field: "acc_num",
      headerName: "Account Number",
      width: 150,
    },
    {
      field: "acc_ifsc",
      headerName: "IFSC Code",
      width: 140,
    },
    {
      field: "gpay",
      headerName: "GPay",
      width: 100,
    },
    {
      field: "paytm",
      headerName: "Paytm",
      width: 110,
    },
    {
      field: "phonepe",
      headerName: "PhonePe",
      width: 110,
    },
    {
      field: "upi",
      headerName: "UPI",
      width: 150,
    },
  ];

  const rows = Object.values(payoutData || {}).map((data) => {
    return {
      id: `${data.key}-${data.name}`,
      name: data.name,
      acc_ifsc: data.ACC_IFSC,
      acc_name: data.ACC_NAME,
      acc_num: data.ACC_NUM,
      gpay: data.GPAY,
      paytm: data.PAYTM,
      phonepe: data.PHONEPE,
      upi: data.UPI,
    };
  });

  return (
    <div className="dataTable payout_dataTable">
      <DataGrid
        className="dataGrid payout_dataGrid"
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
    </div>
  );
};

export default PayoutGrid;
