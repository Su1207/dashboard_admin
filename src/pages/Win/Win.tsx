import { useLocation } from "react-router-dom";
import WinData from "../../components/WinComponent/WinData/WinData";

const Win = () => {
  const location = useLocation();
  const dateString = new URLSearchParams(location.search).get("date");

  // console.log(dateString);
  return (
    <div>
      <WinData dateString={dateString} />
    </div>
  );
};

export default Win;
