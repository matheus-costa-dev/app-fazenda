import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import AnimalModal from "../AnimalModal";
import Cards from "../Cards";
import FloatButton from "../FloatButton";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase/firebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { v4 } from "uuid"
import { AlertMessage } from "../../functions/Alert";
import { checkFormAnimal, parseAnimalToSubmit, transformToDate } from "../../functions/app";
import { appStyles } from "../../styles/app";
import CustomButton from "../CustomButton";


export default function ListRoute({ filteredAnimals, setFilteredAnimals, farmId }) {
    const animalForm = {
        farmId,
        id: "", //id do animal
        nome: "",
        dataNacimento: new Date(),
        peso: "", // apagar
        obs: "",
        cio: false,
        dataCio: new Date(),
        prenha: false,
        dataPrenha: new Date(),
        inseminacao: [],
    }

    const { user } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [newAnimal, setNewAnimal] = useState(animalForm);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmting, setIsSubmting] = useState(false)

    const renderKeys = Object.keys(newAnimal).filter((key) => !["farmId", "id", "inseminacao"].includes(key));

    function onAdd() {

        setIsEditing(false);
        setModalVisible(true);
    }


    async function onSubmitAdd() {

        setIsSubmting(true)

        try {
            if (!checkFormAnimal(newAnimal)) {
                return
            }

            const animalToSubmit = {
                ...parseAnimalToSubmit(newAnimal),
                id: v4(),
            }

            const userDoc = doc(db, "users", user.uid);
            await updateDoc(userDoc, {
                animais: arrayUnion(animalToSubmit)
            })


            setFilteredAnimals((prev) => {
                return [...prev, animalToSubmit]
            })

            setModalVisible(false)
            clearForm()

        } catch (error) {
            console.log(error)
            AlertMessage(error)
        }

        setIsSubmting(false)

    }

    function onEdit(animal) {



        const parsedAnimal = {
            ...animal,
            peso: animal.peso.toString().replace(".", ","),
            dataNacimento: transformToDate(animal.dataNacimento),
            dataCio: transformToDate(animal.dataCio),
            dataPrenha: transformToDate(animal.dataPrenha),
            dataInseminacao: transformToDate(animal.dataInseminacao),
            dataConfirmacaoInseminacao: transformToDate(animal.dataConfirmacaoInseminacao),
            dataPrevisaoParto: transformToDate(animal.dataPrevisaoParto),

        }

        setNewAnimal(parsedAnimal);

        setIsEditing(true);
        setModalVisible(true);
    }

    async function onSubmitEdit() {
        setIsSubmting(true)

        try {
            if (!checkFormAnimal(newAnimal)) {
                return
            }


            const animalToSubmit = parseAnimalToSubmit(newAnimal)
            const updatedAnimals = filteredAnimals.map(animal =>
                animal.id === animalToSubmit.id ? animalToSubmit : animal
            );
            const userDoc = doc(db, "users", user.uid)
            await updateDoc(userDoc, { animais: updatedAnimals });
            setFilteredAnimals(updatedAnimals);

        } catch (error) {
            AlertMessage(error)
        }

        setIsEditing(false)
        setModalVisible(false)
        setIsSubmting(false)
    }


    async function onDelete(id) {
        const userDoc = doc(db, "users", user.uid)
        await updateDoc(userDoc, {
            animais: arrayRemove(filteredAnimals.find((animal) => animal.id === id))
        })
        const animals = filteredAnimals.filter((animal) => animal.id != id)
        setFilteredAnimals(animals)
    }

    function clearForm() {
        setNewAnimal(animalForm)
    }


    if (isSubmting) {
        <View style={appStyles.container}>
            <ActivityIndicator size={"large"} />
        </View>
    }

    return (
        <View style={appStyles.container}>
            {filteredAnimals.length > 0 ?
                <Cards
                    data={filteredAnimals}
                    icons={true}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    renderKeys={renderKeys}
                    buttonInseminacao={true}
                    

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
                }}
                onPressCancel={clearForm}

            />
        </View>
    );
}