import { createContext, useContext, useState, useEffect } from "react";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
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

    async function signUp(email, password) {
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

    async function resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            console.log("E-mail de redefinição enviado com sucesso!");
            // Você pode mostrar uma notificação ou feedback para o usuário
        } catch (error) {
            console.error("Erro ao enviar e-mail:", error.message);
        }
    }

    return (
        <authContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext);
}