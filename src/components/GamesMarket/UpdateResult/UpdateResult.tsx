import "./UpdateResult.scss";
import { ref, get, set } from "firebase/database";
import { database } from "../../../firebase";

type Props = {
  gameId: string;
};

const UpdateResult = (props: Props) => {
  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const date = currentDate.getDate().toString().padStart(2, "0");

    const resultRef = ref(
      database,
      `RESULTS/${props.gameId}/${year}/${month}/${date}`
    );

    const resultSnapshot = await get(resultRef);

    if (resultSnapshot.exists()) {
      let openResult: string | null;

      do {
        openResult = prompt(
          "Enter Open result:",
          resultSnapshot.val()?.OPEN || ""
        );
      } while (
        openResult !== null &&
        (!/^\d+$/.test(openResult) || !openResult.trim())
      );

      if (openResult !== null) {
        alert(`Open Result: ${openResult}`);
        const declareClose = confirm("Do you want to declare Close result?");

        if (declareClose) {
          let closeResult: string | null;

          do {
            closeResult = prompt(
              "Enter Close result:",
              resultSnapshot.val()?.CLOSE || ""
            );
          } while (
            closeResult !== null &&
            (!/^\d+$/.test(closeResult) || !closeResult.trim())
          );

          if (closeResult !== null) {
            alert(`Open Result: ${openResult}\nClose Result: ${closeResult}`);
            // Update the database with the results and mid
            const mid = `${
              (parseInt(openResult[0]) +
                parseInt(openResult[1]) +
                parseInt(openResult[2])) %
              10
            }${
              (parseInt(closeResult[0]) +
                parseInt(closeResult[1]) +
                parseInt(closeResult[2])) %
              10
            }`;
            await set(resultRef, {
              OPEN: openResult,
              CLOSE: closeResult,
              MID: mid,
            });
          } else {
            // Update the database with open result and '***' for close
            await set(resultRef, {
              OPEN: openResult,
              CLOSE: "***",
              MID: `${
                (parseInt(openResult[0]) +
                  parseInt(openResult[1]) +
                  parseInt(openResult[2])) %
                10
              }*`,
            });
          }
        } else {
          // Update the database with open result and '6*' for mid
          await set(resultRef, { OPEN: openResult, CLOSE: "***", MID: "6*" });
        }
      }
    } else {
      const updateType = prompt(
        "Which result do you want to declare 'open' or 'close' ?"
      );

      if (updateType === "open") {
        let openResult: string | null;

        do {
          openResult = prompt("Enter Open result:");
        } while (
          openResult !== null &&
          (!/^\d+$/.test(openResult) || !openResult.trim())
        );

        if (openResult !== null) {
          alert(`Open Result: ${openResult}`);
          const declareClose = confirm("Do you want to declare Close result?");

          if (declareClose) {
            let closeResult: string | null;

            do {
              closeResult = prompt("Enter Close result:");
            } while (
              closeResult !== null &&
              (!/^\d+$/.test(closeResult) || !closeResult.trim())
            );

            if (closeResult !== null) {
              alert(`Open Result: ${openResult}\nClose Result: ${closeResult}`);
              // Update the database with the results and mid
              const mid = `${
                (parseInt(openResult[0]) +
                  parseInt(openResult[1]) +
                  parseInt(openResult[2])) %
                10
              }${
                (parseInt(closeResult[0]) +
                  parseInt(closeResult[1]) +
                  parseInt(closeResult[2])) %
                10
              }`;
              await set(resultRef, {
                OPEN: openResult,
                CLOSE: closeResult,
                MID: mid,
              });
            } else {
              // Update the database with open result and '***' for close
              await set(resultRef, {
                OPEN: openResult,
                CLOSE: "***",
                MID: `${
                  (parseInt(openResult[0]) +
                    parseInt(openResult[1]) +
                    parseInt(openResult[2])) %
                  10
                }*`,
              });
            }
          } else {
            // Update the database with open result and '6*' for mid
            await set(resultRef, { OPEN: openResult, CLOSE: "***", MID: "6*" });
          }
        }
      } else {
        alert("Can't declare close before open");
      }
    }
  };

  return (
    <div>
      <img
        src="./update.png"
        alt="update"
        className="update_img"
        onClick={handleUpdateSubmit}
      />
    </div>
  );
};

export default UpdateResult;
