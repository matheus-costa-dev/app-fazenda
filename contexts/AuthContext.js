import { createContext, useContext, useState, useEffect } from "react";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const authContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Remove o listener quando o componente for desmontado
        return () => unsubscribe();
    }, []);

    async function signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            setUser(userCredential.user)
            return userCredential.user
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            throw error;
        }

    }

    async function signUp(email, password){
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            setUser(userCredential.user)
            return userCredential.user
        } catch (error) {
            console.log("Erro ao criar conta:", error);
            throw error;
        }
    }

    async function signOut() {
        try {
            await auth.signOut();
            setUser(null);
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    }

    return (
        <authContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext);
}