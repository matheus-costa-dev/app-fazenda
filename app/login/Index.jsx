import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { useState, useRef } from "react";
import CustomModal from "../../components/CustomModal";
import RenderInput from "../../components/RenderInput";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { AlertMessage } from "../../functions/Alert";



export default function LoginScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nome, setNome] = useState("");
    const { signIn, signUp, loading, user } = useAuth()
    const router = useRouter()
    const passwordRef = useRef(null);
    const nomeRef = useRef(null);
    const emailCadastroRef = useRef(null);
    const senhaCadastroRef = useRef(null);


    function isFormInvalid(...args) {
        const system = Platform.OS

        if (!args.every(arg => arg)) {

            AlertMessage("Preencha todos os campos")

            return true;
        }

        return false
    }

    async function onSignIn() {


        if (isFormInvalid(email, password)) {
            return null;
        }

        try {

            await signIn(email, password)
            router.replace("/")

        } catch (error) {
            AlertMessage(`Erro ao fazer login\n${error.message}`)
        }

    }

    async function onSignUp() {
        if (isFormInvalid(nome, email, password)) {
            return null;
        }

        try {
            const newUser = await signUp(email, password)
            const userDoc = doc(db, "users", newUser.uid)
            await setDoc(userDoc, {
                nome,
                email, email,
                fazendas: [],
                animais: [],
                criadoEm: new Date(),
                atualizadoEm: new Date(),
            })
            router.replace("/")

        } catch (error) {
            AlertMessage(`Erro ao criar conta\n${error.message}`)
        }

        setModalVisible(false);
    }

    if (loading) {
        return (
            <View contentContainerStyle={styles.container}>
                <ActivityIndicator />
            </View>
        )
    }

    return (

        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Bem-vindo de volta 👋</Text>

            <RenderInput
                icon={"mail-outline"}
                placeholder={"Email"}
                value={email}
                setValue={setEmail}
                isPassword={false}
                keyboardType={"email-address"}
                onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <RenderInput
                icon={"lock-closed-outline"}
                placeholder={"Senha"}
                value={password}
                setValue={setPassword}
                isPassword={true}
                onSubmitEditing={onSignIn}
                ref={passwordRef}
            />

            <CustomButton buttonText={"Entrar"} customButtonStyle={{ color: "white" }} onPress={onSignIn} />

            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.linkContainer}>
                <Text style={styles.linkText}>Não tem uma conta?</Text>
                <Text style={[styles.linkText, { fontWeight: "bold", color: "#6c63ff" }]}> Cadastre-se</Text>
            </TouchableOpacity>

            <CustomModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                modalTitle={"Cadastrar"}
            >

                <RenderInput
                    icon={"person-outline"}
                    placeholder={"Nome"}
                    value={nome}
                    setValue={setNome}
                    isPassword={false}
                    onSubmitEditing={() => emailCadastroRef.current?.focus()}
                />

                <RenderInput
                    icon={"mail"}
                    placeholder={"Email"}
                    value={email}
                    setValue={setEmail}
                    isPassword={false}
                    keyboardType={"email-address"}
                    onSubmitEditing={() => senhaCadastroRef.current?.focus()}
                />

                <RenderInput
                    icon={"lock-closed-outline"}
                    placeholder={"Senha"}
                    value={password}
                    setValue={setPassword}
                    isPassword={true}
                    onSubmitEditing={onSignUp}
                />

                <View style={styles.modalButtons}>

                    <CustomButton
                        buttonText={"Cancelar"}
                        onPress={() => setModalVisible(false)}
                        customTouchableStyle={{ backgroundColor: "white", borderWidth: 1, borderColor: "red" }}
                        customButtonStyle={styles.cancelButton}
                    />

                    <CustomButton
                        buttonText={"Cadastrar"}
                        onPress={onSignUp}
                        customButtonStyle={{ color: "white" }}
                    />


                </View>
            </CustomModal>
        </ScrollView >

    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#f4e7ff",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 32,
        color: "#333",
    },
    cancelButton: {
        color: "red",
    },
    linkContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    linkText: {
        color: "#555",
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 24,
        gap: 12,
    },
});
