import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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
  const [ shouldCheckProfile, setShouldCheckProfile ] = useState( true );

  const loginUser = useCallback( ( userData: User ) => {
    setUser( userData );
    setShouldCheckProfile( true ); // Reabilita verificação após login
  }, [] );

  const logoutUser = useCallback( () => {
    setIsLoggingOut( true );
    setShouldCheckProfile( false ); // Desabilita verificação durante logout
    setUser( null );
    setLoading( false ); // Para que não fique carregando após logout

    // Após um pequeno delay, limpa o estado de logout
    setTimeout( () => {
      setIsLoggingOut( false );
      setShouldCheckProfile( true ); // Reabilita para futuras navegações
    }, 500 );
  }, [] );

  useEffect( () => {
    let mounted = true;

    // Se não devemos verificar o perfil (durante logout), não executa
    if ( !shouldCheckProfile || isLoggingOut ) {
      return;
    }

    // Se estamos em páginas de auth, não faz a verificação
    if ( typeof window !== "undefined" && window.location.pathname.startsWith( "/auth" ) ) {
      setLoading( false );
      return;
    }

    ( async () => {
      try {
        const res = await fetch( "/api/bff/me", {
          credentials: "include",
          cache: "no-store",
        } );
        if ( !mounted ) return;

        if ( res.status === 200 ) {
          const data = await res.json().catch( () => ( {} ) );
          setUser( data.user ?? null );
        } else if ( res.status === 401 ) {
          // só redireciona quando de fato NÃO está autenticado
          setUser( null );
          if (
            typeof window !== "undefined" &&
            window.location.pathname.startsWith( "/private" )
          ) {
            window.location.replace( "/auth/login" );
          }
        } else {
          // 404/5xx/timeouts: não redireciona para não criar loop
          console.warn( "Profile check failed:", res.status );
          setUser( null );
        }
      } catch ( e ) {
        console.error( "Profile check error:", e );
        setUser( null );
        // sem redirect aqui
      } finally {
        if ( mounted ) setLoading( false );
      }
    } )();

    return () => {
      mounted = false;
    };
  }, [ shouldCheckProfile, isLoggingOut ] );


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
