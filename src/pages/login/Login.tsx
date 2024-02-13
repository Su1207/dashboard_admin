import { useState } from "react";
import { useAuth } from "../../components/auth-context";
import "./login.scss";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { usePermissionContext } from "../../components/AdmissionPermission";
import { get, ref } from "firebase/database";
import { database } from "../../firebase";

const Login = () => {
  const { username, setUsername } = usePermissionContext();
  const [password, setPassword] = useState("");
  const [selectedOption, setSelectedOption] = useState(true);
  const [admin, setAdmin] = useState(false);
  const { login } = useAuth();
  const { subLogin } = useSubAuth();

  const { permissions, setPermissions } = usePermissionContext();

  const fetchPermissions = async () => {
    // const userString = localStorage.getItem("user");
    // if (userString !== null) {
    //   const user = await JSON.parse(userString);
    //   setUsername(user.ID);
    // }
    if (!username) return;

    const permissionRef = ref(
      database,
      `ADMIN/SUB_ADMIN/${username}/PERMISSIONS`
    );

    const permissionSnapshot = await get(permissionRef);
    if (permissionSnapshot.exists()) {
      setPermissions(permissionSnapshot.val());
    }
  };

  console.log(permissions);

  const handleAdmin = () => {
    setAdmin(true);
    setSelectedOption(false);
  };

  const handleSubAdmin = () => {
    setAdmin(false);
    setSelectedOption(false);
  };

  const handleLogin = () => {
    admin
      ? login(username ?? "", password)
      : subLogin(username ?? "", password);
    fetchPermissions();
  };

  return (
    <div className="auth">
      {selectedOption && (
        <div className="openCloseOption_container">
          <div className="openCloseOption_main_container">
            <h2>Select Your Identity</h2>
            <button onClick={handleAdmin}>ADMIN</button>
            <button onClick={handleSubAdmin}>SUB-ADMIN</button>
          </div>
        </div>
      )}

      <div className="auth_container">
        <div className="login_img_container">
          <img src="./login.jpg" alt="" className="login_img" />
        </div>
        <div className="login_container">
          <div className="login_title">Login</div>
          <form>
            <div className="input_space">
              <PersonIcon className="user_icon" />
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={username ?? ""}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input_space">
              <KeyIcon className="password_icon" />
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="button" onClick={handleLogin}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
