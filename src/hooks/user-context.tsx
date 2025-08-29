import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { createApiUrl } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  isLoggingOut: boolean;
  loginUser: ( userData: User ) => void;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>( undefined );

export function UserProvider( { children }: { children: ReactNode } ) {
  const [ user, setUser ] = useState<User | null>( null );
  const [ loading, setLoading ] = useState( true );
  const [ isLoggingOut, setIsLoggingOut ] = useState( false );
  const [ shouldCheckProfile, setShouldCheckProfile ] = useState( true );

  const loginUser = useCallback( ( userData: User ) => {
    setUser( userData );
    setShouldCheckProfile( true );
  }, [] );

  const logoutUser = useCallback( () => {
    setIsLoggingOut( true );
    setShouldCheckProfile( false );
    setUser( null );
    setLoading( false );

    setTimeout( () => {
      setIsLoggingOut( false );
      setShouldCheckProfile( true );
    }, 500 );
  }, [] );

  useEffect( () => {
    let mounted = true;

    if ( !shouldCheckProfile || isLoggingOut ) {
      return;
    }

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
          setUser( null );
          if (
            typeof window !== "undefined" &&
            window.location.pathname.startsWith( "/private" )
          ) {
            window.location.replace( "/auth/login" );
          }
        } else {
          console.warn( "Profile check failed:", res.status );
          setUser( null );
        }
      } catch ( e ) {
        console.error( "Profile check error:", e );
        setUser( null );
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

export function useUser() {
  const context = useContext( UserContext );
  if ( !context ) {
    throw new Error( "useUser must be used within a UserProvider" );
  }
  return context;
}
