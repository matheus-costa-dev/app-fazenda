import { View, StyleSheet } from "react-native";
import { useState } from "react";
import AnimalModal from "../AnimalModal";
import Cards from "../Cards";
import FloatButton from "../FloatButton";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase/firebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { v4 } from "uuid"
import { AlertMessage } from "../../functions/Alert";


export default function ListRoute({ filteredAnimals, setFilteredAnimals, farmId }) {
    const { user } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [newAnimal, setNewAnimal] = useState({
        farmId,
        id: "", //id do animal
        nome: "",
        especie: "",
        peso: "",
        dataNacimento: new Date(),
        cio: false,
        dataCio: "",
        prenha: false,
        dataPrenha: "",
        inseminado: false,
        dataInseminacao: "",
        dataConfirmacaoInseminacao: new Date(),
        dataPrevisaoParto: new Date(),
        tipoInseminacao: "",
        touroUsadoInseminacao: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    // const [dataInsemincao, setDataInseminacao] = useState(new Date())
    const renderKeys = Object.keys(newAnimal).filter((key) => !["farmId", "id"].includes(key));


    function onAdd() {
        // if (filteredAnimals){
        //     setNewAnimal((prev) => {
        //         return {
        //             ...prev,
        //             id: v4(),
        //             nome: "",
        //             especie: "",
        //             peso: 0,
        //             dataNacimento: "",
        //             cio: false,
        //             dataCio: "",
        //             prenha: false,
        //             dataPrenha: "",
        //             inseminado: false,
        //             dataInseminacao: "",
        //             dataConfirmacaoInseminacao: "",
        //             dataPrevisaoParto: "",
        //             tipoInseminacao: "",
        //             touroUsadoInseminacao: ""
        //         }
        //     })
        // } else {

        //     setNewAnimal({
        //             id: v4(),
        //             nome: "",
        //             especie: "",
        //             peso: 0,
        //             dataNacimento: new Date(),
        //             cio: false,
        //             dataCio: "",
        //             prenha: false,
        //             dataPrenha: "",
        //             inseminado: false,
        //             dataInseminacao: "",
        //             dataConfirmacaoInseminacao: new Date(),
        //             dataPrevisaoParto: new Date(),
        //             tipoInseminacao: "",
        //             touroUsadoInseminacao: ""
        //     })
        // }
       

        setIsEditing(false);
        setModalVisible(true);
    }



    async function onSubmitAdd() {
       
        if (!newAnimal.peso) {
            AlertMessage("Insira o peso do animal")
            return
        }
  
        try {
            const animalToAdd = {
                ...newAnimal,
                peso: checkNumericValues(newAnimal.peso, true), // Converte para float
            };
            
           
            const userDoc = doc(db, "users", user.uid);
            await updateDoc(userDoc, {
                animais: arrayUnion(animalToAdd)
            })
            

            setFilteredAnimals((prev) => {
                return [...prev, animalToAdd]
            })
            
            setModalVisible(false)
        } catch (error) {
            console.log(error)
            AlertMessage(error)
        }

    }

    function onEdit(animal) {
        console.log("clicou")
        // const parsedAnimal = Object.fromEntries(
        //     Object.entries(animal).map(([key, val]) => {
        //       if (
        //         val &&
        //         typeof val === "object" &&
        //         "seconds" in val &&
        //         "nanoseconds" in val
        //       ) {
        //         const date = new Date(val.seconds * 1000);
        //         return [key, date];
        //       }
        //       return [key, val];
        //     })
        //   );

        //   console.log(parsedAnimal)
       
        // setNewAnimal({
        //     ...animal,
        //     peso: animal.peso.toString().replace(".", ",")
        // });

        // setIsEditing(true);
        // setModalVisible(true);
    }

    async function onSubmitEdit() {

        try {

            const animalEdited = {
                ...newAnimal,
                peso: checkNumericValues(newAnimal.peso, true), // Converte para float
            };
            const userDoc = doc(db, "users", user.uid)
            await updateDoc(userDoc, {
                animais: arrayRemove(filteredAnimals.find((animal) => animal.id === animalEdited.id))
            })

            await updateDoc(userDoc, {
                animais: arrayUnion(animalEdited)
            })

            setFilteredAnimals((prev) => {
                return [...prev.filter((animal) => animal.id != animalEdited.id), animalEdited]
            })

        } catch (error) {
            AlertMessage(error)
        }

        setIsEditing(false)
        setModalVisible(false)

    }

    function checkNumericValues(data, float) {

        const regex = /[0-9.,]+/g
        let num = data.replace(",", ".").match(regex)
        num = float ? parseFloat(num) : parseInt(num)

        if (isNaN(num)) {
            num = 0
        }

        return num
    }
    async function onDelete(id) {
        const userDoc = doc(db, "users", user.uid)
        await updateDoc(userDoc, {
            animais: arrayRemove(filteredAnimals.find((animal) => animal.id === id))
        })
        const animals = filteredAnimals.filter((animal) => animal.id != id)
        setFilteredAnimals(animals)
    }


    return (
        <View style={styles.container}>
            {filteredAnimals.length > 0 ?
                <Cards
                    data={filteredAnimals}
                    icons={true}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    renderKeys={renderKeys}
                /> :
                <Cards data={[{ id: 1, title: "Nenhum animal cadastrado" }]} />
            }

            <FloatButton onPress={onAdd} iconName={"add-outline"} />


            <AnimalModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                animal={newAnimal}
                setAnimal={setNewAnimal}
                titleSubmitButton={isEditing ? "editar" : "adicionar"}
                onSubmit={() => {
                    if (isEditing) {
                        onSubmitEdit()
                    } else {
                        onSubmitAdd()
                    }


                    // setModalVisible(false);
                }}
            // dataInsemincao={dataInsemincao} 
            // setDataInseminacao= {setDataInseminacao}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DBFFCB",
        paddingVertical: 20,
        paddingHorizontal: 16,
        position: "relative"
    },
});
