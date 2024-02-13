// auth-context.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// import { useNavigate } from "react-router-dom";
import { get, ref } from "firebase/database";
import { database } from "../firebase";
import { toast } from "react-toastify";

interface User {
  ID: string;
  PASSWORD: string;
}

interface SubAdminAuthContextProps {
  user: User | null;
  isSubAuthenticated: boolean;
  subLogin: (username: string, password: string) => void;
  subLogout: () => void;
}

const SubAdminAuthContext = createContext<SubAdminAuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const SubAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  //   const navigate = useNavigate();
  const [isSubAuthenticated, setIsSubAuthenticated] = useState(false);

  // Check for stored authentication data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("user");
      const storedAuth = localStorage.getItem("isSubAuthenticated");

      if (storedUser && storedAuth) {
        setUser(await JSON.parse(storedUser));
        setIsSubAuthenticated(await JSON.parse(storedAuth));
      }
    };
    fetchData();
  }, []);

  const subLogin = async (username: string, password: string) => {
    // Fetch user details from the database based on username
    const userRef = ref(database, `ADMIN/SUB_ADMIN/${username}/AUTH`);

    try {
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val() as User;

        // Check if the password matches
        if (userData.PASSWORD === password && userData.ID === username) {
          // Update state
          setUser(userData);
          setIsSubAuthenticated(true);

          // Store authentication data in localStorage
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("isSubAuthenticated", JSON.stringify(true));

          //   navigate("/"); // Redirect to home after successful subLogin
        } else {
          toast.error("Invalid username or password");
        }
      } else {
        toast.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const subLogout = () => {
    // Clear stored authentication data
    localStorage.removeItem("user");
    localStorage.removeItem("isSubAuthenticated");

    // Update state
    setUser(null);
    setIsSubAuthenticated(false);

    // navigate("/subLogin"); // Redirect to subLogin after subLogout
  };

  return (
    <SubAdminAuthContext.Provider
      value={{
        user,
        subLogin,
        isSubAuthenticated,
        subLogout,
      }}
    >
      {children}
    </SubAdminAuthContext.Provider>
  );
};

export const useSubAuth = () => {
  const context = useContext(SubAdminAuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
