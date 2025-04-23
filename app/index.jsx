import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import FloatButton from "../components/FloatButton"
import CustomModal from "../components/CustomModal";
import RenderInput from "../components/RenderInput";
import CustomButon from "../components/CustomButton";
import Cards from "../components/Cards";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import 'react-native-get-random-values';
import { v4 } from "uuid"
import { AlertMessage } from "@/functions/Alert";

export default function Index() {
  const router = useRouter();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [newFarmName, setNewFarmName] = useState("");
  const [newFarmOwner, setNewFarmOwner] = useState("")
  const [newFarmAddress, setNewFarmAddress] = useState("");
  const [newFarmEmail, setNewFarmEmail] = useState("");
  const [newFarmPhone, setNewFarmPhone] = useState("");
  const [farms, setFarms] = useState([]);
  const [animals, setAnimals] = useState([])
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editFarmId, setEditFarmId] = useState("")
  const [dataLoading, setDataLoading] = useState(true)
  const ownerRef = useRef(null)
  const addressRef = useRef(null)
  const emailRef = useRef(null)
  const phoneRef = useRef(null)



  useEffect(() => {
    navigation.setOptions({
      title: "Fazendas", // título da página inicial
      headerShown: true,
    });

    fetchData()

  }, [user]);

  async function fetchData() {
    if (!user) return

    const userDoc = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDoc);
    const userData = userSnapshot.data();
    setFarms(userData.fazendas || []);
    setAnimals(userData.animais || [])
    setDataLoading(false)
  }

  async function onHandleAddFarm() {

    try {
      const newFarm = {
        id: v4(),
        nome: newFarmName,
        proprietario: newFarmOwner,
        endereco: newFarmAddress,
        email: newFarmEmail,
        telefone: newFarmPhone,
      };

      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, {
        fazendas: arrayUnion(newFarm),
      })

      setFarms(prev => [...prev, newFarm])
      setModalVisible(false);
      clearForm()

    } catch (error) {
      console.error(error)
      AlertMessage(`Erro ao adicionar fazenda\n${error.message}`)
    }

  }

  async function onEdit(farm) {
    setIsEditing(true)
    setModalVisible(true);

    setEditFarmId(farm.id)
    setNewFarmName(farm.nome);
    setNewFarmOwner(farm.proprietario)
    setNewFarmAddress(farm.endereco);
    setNewFarmEmail(farm.email)
    setNewFarmPhone(farm.telefone)
    

  }

  async function onHandleEditFarm() {


    try {
      const farmEdit = {
        id: editFarmId,
        nome: newFarmName,
        proprietario: newFarmOwner,
        endereco: newFarmAddress,
        email: newFarmEmail,
        telefone: newFarmPhone,
      }

      const updatedFarms = [
        ...farms.filter(farm => farm.id !== editFarmId),
        farmEdit
      ];

      const userDoc = doc(db, "users", user.uid)
      await updateDoc(userDoc, {
        fazendas: updatedFarms
      })

      setIsEditing(false)
      setModalVisible(false)

      setFarms(updatedFarms)

      
      clearForm()
    } catch (error) {
      AlertMessage(`Erro ao editar fazenda\n${error.message}`)
    }

  }

  async function onDelete(farmId) {
    try {
      // Remove a fazenda do array
      const updatedFarms = farms.filter(farm => farm.id !== farmId);
      const updatedAnimals = animals.filter(animal => animal.farmId !== farmId);
  
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, {
        fazendas: updatedFarms,
        animais: updatedAnimals
      });
  
      // Atualiza o estado local
      setFarms(updatedFarms);
  
    } catch (error) {
      console.error(error);
      AlertMessage(`Erro ao deletar fazenda\n${error.message}`);
    }
  }
  

  function onCardPress(id) {
    router.push(`/animals/${id}`);
  }

  function clearForm(){
    setNewFarmName("");
    setNewFarmOwner("")
    setNewFarmAddress("");
    setNewFarmEmail("")
    setNewFarmPhone("")

  }


  if (loading || dataLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center", backgroundColor: "#DBFFCB" }}>
        <ActivityIndicator size={"large"} />
      </View>
    )
  }



  return (
    <View style={styles.container}>
      <Cards
        data={farms}
        icons={true}
        onEdit={onEdit}
        onDelete={onDelete}
        onCardPress={onCardPress}
      />


      <FloatButton iconName={"add-outline"} onPress={() => setModalVisible(true)} />
      <CustomModal 
      modalTitle={"Adicionar fazenda"} 
      modalVisible={modalVisible} 
      setModalVisible={setModalVisible}
      onRequestClose={clearForm}
      >
        <RenderInput
          icon={"home-outline"}
          placeholder={"Nome da fazenda"}
          value={newFarmName}
          setValue={setNewFarmName}
          isPassword={false}
          keyboardType={"default"}
          onSubmitEditing={() => ownerRef.current?.focus()}
        />

        <RenderInput
          icon={"person-outline"}
          placeholder={"Nome do proprietário"}
          value={newFarmOwner}
          setValue={setNewFarmOwner}
          isPassword={false}
          keyboardType={"default"}
          onSubmitEditing={() => addressRef.current?.focus()}
          ref={ownerRef}
        />
        <RenderInput
          icon={"location-outline"}
          placeholder={"Endereço"}
          value={newFarmAddress}
          setValue={setNewFarmAddress}
          isPassword={false}
          keyboardType={"default"}
          ref={addressRef}
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <RenderInput
          icon={"mail-outline"}
          placeholder={"Email"}
          value={newFarmEmail}
          setValue={setNewFarmEmail}
          isPassword={false}
          keyboardType={"email-address"}
          ref={emailRef}
          onSubmitEditing={() => phoneRef.current?.focus()}
        />
        <RenderInput
          icon={"phone-portrait-outline"}
          placeholder={"Telefone"}
          value={newFarmPhone}
          setValue={setNewFarmPhone}
          isPassword={false}
          keyboardType={"phone-pad"}
          ref={phoneRef}
          onSubmitEditing={() => isEditing ? onHandleEditFarm() : onHandleAddFarm()}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <CustomButon
            buttonText={"Cancelar"}
            onPress={() => { 
              setModalVisible(false)
              setIsEditing(false)
              clearForm()
            }}
            customTouchableStyle={styles.cancelButton}
            
          />

          <CustomButon
            buttonText={isEditing ? "Editar" : "Adicionar"}
            onPress={() => {
              isEditing ? onHandleEditFarm() : onHandleAddFarm()
            }}
            customButtonStyle={{ color: "#fff", backgroundColor: "#4CAF50" }} // verde mais claro
            customTouchableStyle={{ backgroundColor: "#4CAF50" }} // verde mais claro
          />
        </View>

      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DBFFCB", // fundo leve e agradável
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#A8D5BA", // verde mais fechado e bonito
    padding: 20,
    marginVertical: 10,
    borderRadius: 16,
    width: "100%",
    elevation: 3, // sombra para Android
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2F4F4F", // verde escuro, estilo floresta
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#3F704D", // tom mais escuro mas ainda natural
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff4d4d",
  },

});
