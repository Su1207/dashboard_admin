import { useParams } from "react-router-dom";
import WinDetails from "../../components/WinComponent/WinDetails/WinDetails";

const WinDetail = () => {
  const { id } = useParams();

  const gameId = id ?? "";
  return (
    <div>
      <WinDetails gameId={gameId} />
    </div>
  );
};

export default WinDetail;
