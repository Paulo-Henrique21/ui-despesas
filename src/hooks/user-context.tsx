import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createApiUrl } from "@/lib/api";

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
  isLoggingOut: boolean;
  loginUser: ( userData: User ) => void;
  logoutUser: () => void;
}

// Criação do contexto tipado
const UserContext = createContext<UserContextType | undefined>( undefined );

// Provider
export function UserProvider( { children }: { children: ReactNode } ) {
  const [ user, setUser ] = useState<User | null>( null );
  const [ loading, setLoading ] = useState( true );
  const [ isLoggingOut, setIsLoggingOut ] = useState( false );

  const loginUser = ( userData: User ) => {
    setUser( userData );
  };

  const logoutUser = () => {
    setIsLoggingOut( true );
    setUser( null );
  };

  useEffect( () => {
    async function fetchUserProfile() {
      try {
        const res = await fetch(`/api/bff/me`, { method: "GET", credentials: "include", cache: "no-store" })

        const data = await res.json();

        if ( res.ok ) {
          setUser( data.user );
        } else {
          setUser( null );
          // Se estivermos em uma rota privada e não conseguirmos carregar o perfil,
          // redireciona para login
          if ( typeof window !== 'undefined' && window.location.pathname.startsWith( '/private' ) ) {
            window.location.href = '/auth/login';
          }
        }
      } catch ( error ) {
        console.error( "Erro ao carregar perfil:", error );
        setUser( null );
        // Se estivermos em uma rota privada e houver erro ao carregar o perfil,
        // redireciona para login
        if ( typeof window !== 'undefined' && window.location.pathname.startsWith( '/private' ) ) {
          window.location.href = '/auth/login';
        }
      } finally {
        setLoading( false );
      }
    }

    fetchUserProfile();
  }, [] );

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, loading, isLoggingOut }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook para usar o contexto
export function useUser() {
  const context = useContext( UserContext );
  if ( !context ) {
    throw new Error( "useUser must be used within a UserProvider" );
  }
  return context;
}
