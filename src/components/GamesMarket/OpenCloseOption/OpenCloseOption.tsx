import { useEffect, useRef, useState } from "react";
import "./OpenCloseOption.scss";
import { get, ref, set, update } from "firebase/database";
import { database } from "../../../firebase";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import { ClickPosition } from "../GamesDetails/GamesDataGrid";

type OpenCloseProps = {
  gameId: string;
  gameName: string;
  setOpenClose: React.Dispatch<React.SetStateAction<boolean>>;
  clickPosition: ClickPosition | null;
};

const OpenCloseOption: React.FC<OpenCloseProps> = ({
  gameId,
  gameName,
  setOpenClose,
  clickPosition,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.style.left = `${clickPosition?.x}px`;
      modalRef.current.style.top = `${clickPosition?.y}px`;
    }
  }, [clickPosition]);

  const [openResult, setOpenResult] = useState(false);
  const [closeResult, setCloseResult] = useState(false);

  const [openFormResult, setOpenFormResult] = useState("");
  const [closeFormResult, setCloseFormResult] = useState("");

  const handleOpen = () => {
    setOpenResult(!openResult);
    // setOpenClose(false);
  };

  const handleClose = () => {
    const resultRef = ref(
      database,
      `RESULTS/${gameId}/${year}/${month}/${date}`
    );

    get(resultRef).then((snapshot) => {
      if (snapshot.exists()) {
        setCloseResult(!closeResult);
      } else {
        setOpenClose(false);
        toast.error("You can't declare Close result before Open");
      }
    });

    // setOpenClose(false);
  };

  const handleOpenInputChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpenFormResult(e.target.value);
  };

  const handleCloseInputChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCloseFormResult(e.target.value);
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const date = currentDate.getDate().toString().padStart(2, "0");

  const handleOpenSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (openFormResult) {
      try {
        const resultRef = ref(
          database,
          `RESULTS/${gameId}/${year}/${month}/${date}`
        );

        const timestamp = Date.now();

        const totalRef = ref(database, `GAME CHART/${gameId}/${timestamp}`);

        const midResult = `${
          (parseInt(openFormResult[0]) +
            parseInt(openFormResult[1]) +
            parseInt(openFormResult[2])) %
          10
        }♦`;

        await set(resultRef, {
          OPEN: openFormResult,
          MID: midResult,
          CLOSE: "✦✦✦",
        });

        await set(totalRef, {
          OPEN: openFormResult,
          MID: midResult,
          CLOSE: "✦✦✦",
        });

        setOpenClose(false);
        toast.success("Open Result updated successfully");
      } catch (error) {
        console.log("Error in submitting", error);
      }
    } else {
      toast.error("Open Result can't be empty");
    }
  };

  const handleCloseSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (closeFormResult) {
      try {
        const resultRef = ref(
          database,
          `RESULTS/${gameId}/${year}/${month}/${date}`
        );

        const timestamp = Date.now();

        const totalRef = ref(database, `GAME CHART/${gameId}/${timestamp}`);

        get(resultRef).then(async (snapshot) => {
          if (snapshot.exists()) {
            const open = snapshot.val().OPEN;

            const midResult = `${
              (parseInt(open[0]) + parseInt(open[1]) + parseInt(open[2])) % 10
            }${
              (parseInt(closeFormResult[0]) +
                parseInt(closeFormResult[1]) +
                parseInt(closeFormResult[2])) %
              10
            }`;
            await update(resultRef, {
              MID: midResult,
              CLOSE: closeFormResult,
            });

            await update(totalRef, {
              MID: midResult,
              CLOSE: closeFormResult,
            });
            toast.success("Close Result updated successfully");
            setOpenClose(false);
          }
        });
      } catch (error) {
        console.log("Error in submitting", error);
      }
    } else {
      toast.error("Close Result can't be empty");
    }
  };

  return (
    <div
      className="openCloseOption_container"
      style={{ top: `${clickPosition?.y}px` }}
    >
      {!openResult && !closeResult && (
        <div className="openCloseOption_main_container">
          <span className="close" onClick={() => setOpenClose(false)}>
            <ClearIcon />
          </span>
          <h2>{gameName}</h2>
          <p>Please choose which market do you want to explore ?</p>
          <button onClick={handleOpen}>OPEN</button>
          <button onClick={handleClose}>CLOSE</button>
        </div>
      )}

      {openResult && (
        <div className="openCloseOption_main_container open_container">
          <span className="close" onClick={() => setOpenClose(false)}>
            <ClearIcon />
          </span>
          <form onSubmit={handleOpenSubmit}>
            <label>Enter Open Result</label>
            <input
              type="text"
              placeholder="Enter 3 digits"
              pattern="[0-9]{3}" // Restrict to only numeric entries with exactly 3 digits
              title="Please enter exactly 3 numeric digits"
              maxLength={3}
              inputMode="numeric"
              onChange={handleOpenInputChnage}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {closeResult && (
        <div className="openCloseOption_main_container close_container">
          <span className="close" onClick={() => setOpenClose(false)}>
            <ClearIcon />
          </span>
          <form onSubmit={handleCloseSubmit}>
            <label>Enter Close Result</label>
            <input
              type="text"
              placeholder="Enter 3 digits"
              pattern="[0-9]{3}" // Restrict to only numeric entries with exactly 3 digits
              title="Please enter exactly 3 numeric digits"
              maxLength={3}
              inputMode="numeric"
              onChange={handleCloseInputChnage}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OpenCloseOption;
