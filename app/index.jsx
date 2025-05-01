import { View, ActivityIndicator } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import FloatButton from "../components/FloatButton"
import CustomModal from "../components/CustomModal";
import RenderInput from "../components/RenderInput";
import CustomButon from "../components/CustomButton";
import Cards from "../components/Cards";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import 'react-native-get-random-values';
import { v4 } from "uuid"
import { AlertMessage } from "@/functions/Alert";
import { appStyles } from "../styles/app"
import { checkFormFarm } from "@/functions/app";

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

    if (!userSnapshot.exists()) {
      console.log("Documento NÃO existe");
      await setDoc(userDoc, {
        nome: "",
        email: user.email,
        fazendas: [],
        animais: [],
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      })
      console.log("feito a criação");
    
      const newSnapshot = await getDoc(userDoc);
      const userData = newSnapshot.data();
    
      setFarms(userData.fazendas || []);
      setAnimals(userData.animais || []);
      setDataLoading(false);
      return;
    }



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

      if (!checkFormFarm(newFarm)) {
        return
      }

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

      if (!checkFormFarm(farmEdit)) {
        return
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

    setDataLoading(true)
    try {

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

    setDataLoading(false)
  }


  function onCardPress(id) {
    router.push(`/animals/${id}`);
  }

  function clearForm() {
    setNewFarmName("");
    setNewFarmOwner("")
    setNewFarmAddress("");
    setNewFarmEmail("")
    setNewFarmPhone("")

  }


  if (loading || dataLoading) {
    return (
      <View style={appStyles.container}>
        <ActivityIndicator size={"large"} />
      </View>
    )
  }



  return (
    <View style={appStyles.container}>
      <Cards
        data={farms}
        icons={true}
        leftIcons={true}
        onEdit={onEdit}
        onDelete={onDelete}
        onCardPress={onCardPress}
        renderKeys={["nome", "proprietario", "endereco", "email", "telefone"]}
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

        <View style={appStyles.modalActionsButtons}>
          <CustomButon
            buttonText={"Cancelar"}
            onPress={() => {
              setModalVisible(false)
              setIsEditing(false)
              clearForm()
            }}
            customTouchableStyle={appStyles.customTouchableStyleCancel}
            customButtonStyle={appStyles.customButtonStyleCancel}

          />

          <CustomButon
            buttonText={isEditing ? "Editar" : "Adicionar"}
            onPress={() => {
              isEditing ? onHandleEditFarm() : onHandleAddFarm()
            }}
            customTouchableStyle={appStyles.customTouchableStyleSubmit} // verde mais claro
            customButtonStyle={appStyles.customButtonStyleSubmit} // verde mais claro
          />
        </View>

      </CustomModal>
    </View>
  );
}

