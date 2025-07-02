import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Tipo do usuário
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  avatar?: string; // opcional, se vier do backend
}

// Tipo do contexto
interface UserContextType {
  user: User | null;
  loading: boolean;
  loginUser: (userData: User) => void;
  logoutUser: () => void;
}

// Criação do contexto tipado
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loginUser = (userData: User) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
  };

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await fetch("http://localhost:8000/api/users/profile", {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook para usar o contexto
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
