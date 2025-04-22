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
        peso: 0,
        cio: false,
        prenha: false,
        inseminado: false,
    });
    const [isEditing, setIsEditing] = useState(false);

    function onAdd() {
        setNewAnimal((prev) => {
            return {
                ...prev,
                id: v4(),
                nome: "",
                especie: "",
                peso: "",
                cio: false,
                prenha: false,
                inseminado: false,
            }
        })

        setIsEditing(false);
        setModalVisible(true);
    }

    async function onSubmitAdd() {

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
        } catch (error) {
            AlertMessage(error)
        }

    }

    function onEdit(animal) {
        setNewAnimal({
            ...animal,
            peso: animal.peso.toString().replace(".", ",")
        });

        setIsEditing(true);
        setModalVisible(true);
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
                        renderKeys={["nome", "especie", "peso","cio","prenha","inseminado"]}
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


                    setModalVisible(false);
                }}
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
