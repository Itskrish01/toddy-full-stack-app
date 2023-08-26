import React, { createContext, useState, ReactNode, useEffect } from 'react';

type TokenContextType = {
    token: string | null;
    userAuthenticated: boolean;
    user: UserData | null; // Define UserData type for user information
    setNewToken: (newToken: string, expirationTime: number) => void;
    logout: () => void;
};

type UserData = {
    _id: string;
    username: string;
    email: string;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

type TokenProviderProps = {
    children: ReactNode;
};

const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token') || ''
    );

    const [userAuthenticated, setUserAuthenticated] = useState<boolean>(
        !!localStorage.getItem('token')
    );

    const [user, setUser] = useState<UserData | null>(null); // Initialize user state

    const setNewToken = (newToken: string, expirationTime: number) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('tokenExpiration', expirationTime.toString());
        setToken(newToken);
        setUserAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        setToken(null);
        setUserAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (token) {
                try {
                    const response = await fetch('https://todd-backend.onrender.com/current-user', {
                        headers: {
                            Authorization: token,
                        },
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error fetching current user:', error);
                }
            } else {
                setUser(null);
            }
        };

        fetchCurrentUser();
    }, [token]);

    return (
        <TokenContext.Provider value={{ token, userAuthenticated, user, setNewToken, logout }}>
            {children}
        </TokenContext.Provider>
    );
};

export { TokenContext, TokenProvider };
