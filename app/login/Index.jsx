import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
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
import { appStyles } from "../../styles/app"
import { isEmailValid, isPasswordValid } from "../../functions/app"


export default function LoginScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleResetPassword, setModalVisibleResetPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nome, setNome] = useState("");
    const { signIn, signUp, loading, resetPassword } = useAuth()
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

            if(!isEmailValid(email)){
                return null
            }

            if(!isPasswordValid(password)){
                return null
            }

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

            if(!isEmailValid(email)){
                return null
            }
            if(!isPasswordValid(password)){
                return null
            }

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

    async function onHandleResetPassword() {

        try {
            if(!isEmailValid(email)){
                return null
            }
            await resetPassword(email)
            AlertMessage("E-mail de redefinição enviado! Verifique sua caixa de entrada e o lixo eletrônico.")
            setModalVisibleResetPassword(false)
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error.message);
            AlertMessage(`Falha ao enviar e-mail: ${error.message}`);
        }
    }

    if (loading) {
        return (
            <View contentContainerStyle={styles.container}>
                <ActivityIndicator />
            </View>
        )
    }



    return (

        <ScrollView contentContainerStyle={appStyles.container}>
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

            <CustomButton buttonText={"Entrar"}
                customTouchableStyle={appStyles.customTouchableStyleSubmit}
                customButtonStyle={appStyles.customButtonStyleSubmit}
                onPress={onSignIn} />



            <TouchableOpacity
                onPress={() => setModalVisibleResetPassword(true)}
                style={styles.linkContainer}>
                <Text style={styles.linkText}>Esqueceu a senha? ?</Text>
                <Text style={[styles.linkText, { fontWeight: "bold", color: "#6c63ff" }]}> clique aqui</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.linkContainer}>
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

                <View style={appStyles.modalActionsButtons}>

                    <CustomButton
                        buttonText={"Cancelar"}
                        onPress={() => setModalVisible(false)}
                        customTouchableStyle={appStyles.customTouchableStyleCancel}
                        customButtonStyle={appStyles.customButtonStyleCancel}

                    />

                    <CustomButton
                        buttonText={"Cadastrar"}
                        onPress={onSignUp}
                        customTouchableStyle={appStyles.customTouchableStyleSubmit}
                        customButtonStyle={appStyles.customButtonStyleSubmit}
                    />


                </View>
            </CustomModal>


            <CustomModal
                modalVisible={modalVisibleResetPassword}
                setModalVisible={setModalVisibleResetPassword}
                modalTitle={"Recuperar acesso"}
            >
                <RenderInput
                    icon={"mail"}
                    placeholder={"Email"}
                    value={email}
                    setValue={setEmail}
                    isPassword={false}
                    keyboardType={"email-address"}
                    onSubmitEditing={onHandleResetPassword}
                />

                <View style={appStyles.modalActionsButtons}>

                    <CustomButton
                        buttonText={"Cancelar"}
                        onPress={() => setModalVisibleResetPassword(false)}
                        customTouchableStyle={appStyles.customTouchableStyleCancel}
                        customButtonStyle={appStyles.customButtonStyleCancel}

                    />

                    <CustomButton
                        buttonText={"Enviar"}
                        onPress={onHandleResetPassword}
                        customTouchableStyle={appStyles.customTouchableStyleSubmit}
                        customButtonStyle={appStyles.customButtonStyleSubmit}
                    />


                </View>
            </CustomModal>
        </ScrollView >

    );
}

const styles = StyleSheet.create({

    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 32,
        color: "#333",
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
});
