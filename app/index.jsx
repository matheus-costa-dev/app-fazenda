import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import FloatButton from "../components/FloatButton"
import CustomModal from "../components/CustomModal";
import RenderInput from "../components/RenderInput";
import CustomButon from "../components/CustomButton";
import Cards from "../components/Cards";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import 'react-native-get-random-values';
import { v4 } from "uuid"
import { AlertMessage } from "@/functions/Alert";

export default function Index() {
  const router = useRouter();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [newFarmName, setNewFarmName] = useState("");
  const [newFarmAddress, setNewFarmAddress] = useState("");
  const [farms, setFarms] = useState([]);
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editFarmId, setEditFarmId] = useState("")
  const [dataLoading, setDataLoading] = useState(true)

  

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

    setDataLoading(false)
  }

  async function onHandleAddFarm() {
 
    try {
      const newFarm = {
        id: v4(),
        name: newFarmName,
        localization: newFarmAddress,
      };
  
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, {
        fazendas: arrayUnion(newFarm),
      })

      fetchData()
      setModalVisible(false);
      setNewFarmName("");
      setNewFarmAddress("");
    } catch (error) {
      console.error(error)
      AlertMessage(`Erro ao adicionar fazenda\n${error.message}`)
    }

  }

  async function onEdit(farm){
    setIsEditing(true)
    setModalVisible(true);
    setNewFarmName(farm.name);
    setNewFarmAddress(farm.localization);
    setEditFarmId(farm.id)
    
  }

  async function onHandleEditFarm(){


    try {
      const farmEdit ={
        id: editFarmId,
        name: newFarmName,
        localization: newFarmAddress,
      }
      const userDoc = doc(db, "users",user.uid)
      await updateDoc(userDoc, {
        fazendas: arrayRemove(farms.find(farm => farm.id === editFarmId))
      })
  
      await updateDoc(userDoc, {
        fazendas: arrayUnion(farmEdit)
      })
  
      setIsEditing(false)
      setNewFarmName("")
      setNewFarmAddress("")
      setModalVisible(false)
      
      setFarms((prev) => {
        return [...prev.filter(farm => farm.id !== editFarmId), farmEdit]
      })

    } catch (error) {
      AlertMessage(`Erro ao editar fazenda\n${error.message}`)  
    }
    
  }


  async function onDelete(farmId){
    const userDoc = doc(db,"users",user.uid)
    const farmToDelete = farms.find(farm => farm.id == farmId)
    await updateDoc(userDoc, {
      fazendas: arrayRemove(farmToDelete)
    });
    
    setFarms((prev)=>{
      return prev.filter(farm => farm.id !== farmId)  
    })
  }

  function onCardPress(id){
    router.push(`/animals/${id}`);
  }


  if (loading || dataLoading) {
    return (
        <View style={{flex:1, justifyContent:"center",alignContent:"center", backgroundColor:"#DBFFCB"}}>
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
      <CustomModal modalTitle={"Adicionar fazenda"} modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <RenderInput
          icon={"home-outline"}
          placeholder={"Nome da fazenda"}
          value={newFarmName}
          setValue={setNewFarmName}
          isPassword={false}
          keyboardType={"default"}
        />
        <RenderInput
          icon={"location-outline"}
          placeholder={"Endereço"}
          value={newFarmAddress}
          setValue={setNewFarmAddress}
          isPassword={false}
          keyboardType={"default"}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <CustomButon
            buttonText={"Cancelar"}
            onPress={() => setModalVisible(false)}
            customTouchableStyle={styles.cancelButton}
          />

          <CustomButon
            buttonText={isEditing ? "Editar" : "Adicionar"}
            onPress={() => isEditing ? onHandleEditFarm() : onHandleAddFarm()}
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
