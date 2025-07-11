import { useState, useEffect, createContext, useContext } from "react";
import { User, LoginCredentials, RegisterCredentials } from "@/types/auth";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (credentials: LoginCredentials) => Promise<void>;
	register: (credentials: RegisterCredentials) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

export function useAuthState() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// TODO: Implement auth state management
		setLoading(false);
	}, []);

	const login = async (credentials: LoginCredentials) => {
		// TODO: Implement login logic
		console.log("Login:", credentials);
	};

	const register = async (credentials: RegisterCredentials) => {
		// TODO: Implement register logic
		console.log("Register:", credentials);
	};

	const logout = async () => {
		// TODO: Implement logout logic
		setUser(null);
	};

	return {
		user,
		loading,
		login,
		register,
		logout,
	};
}
