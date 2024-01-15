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

interface User {
  ID: string;
  PASSWORD: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  //   const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored authentication data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAuth = localStorage.getItem("isAuthenticated");

    if (storedUser && storedAuth) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(JSON.parse(storedAuth));
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Fetch user details from the database based on username
    const userRef = ref(database, `ADMIN/AUTH/admin`);

    try {
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val() as User;

        // Check if the password matches
        if (userData.PASSWORD === password && userData.ID === username) {
          // Update state
          setUser(userData);
          setIsAuthenticated(true);

          // Store authentication data in localStorage
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("isAuthenticated", JSON.stringify(true));

          //   navigate("/"); // Redirect to home after successful login
        } else {
          console.log("Invalid username or password");
        }
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const logout = () => {
    // Clear stored authentication data
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");

    // Update state
    setUser(null);
    setIsAuthenticated(false);

    // navigate("/login"); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
