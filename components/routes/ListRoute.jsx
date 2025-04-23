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
    const animalForm = {
        farmId,
        id: "", //id do animal
        nome: "",
        especie: "",
        peso: "", // apagar
        cio: false,
        prenha: false,
        inseminado: false,
        dataNacimento: new Date(),
        dataCio: new Date(),
        dataPrenha: new Date(),
        dataInseminacao: new Date(),
        dataConfirmacaoInseminacao: new Date(),
        dataPrevisaoParto: new Date(),
        tipoInseminacao: "",
        touroUsadoInseminacao: ""
    }

    const { user } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [newAnimal, setNewAnimal] = useState(animalForm);


    const [isEditing, setIsEditing] = useState(false);
    // const [dataInsemincao, setDataInseminacao] = useState(new Date())
    const renderKeys = Object.keys(newAnimal).filter((key) => !["farmId", "id"].includes(key));

    function checkForm(animal) {
        if (!animal.nome || animal.nome === "") {
            AlertMessage("Preencha o nome do animal");
            return false;
        }
        if (!animal.especie || animal.especie === "") {
            AlertMessage("Preencha a espécie do animal");
            return false;
        }
        if (!animal.peso || animal.peso === "") {
            AlertMessage("Preencha o peso do animal");
            return false;
        }
    
        if (!(animal.dataNacimento instanceof Date)) {
            AlertMessage("Data de nascimento inválida");
            return false;
        }
        if (animal.cio && !(animal.dataCio instanceof Date)) {
            AlertMessage("Data de cio inválida");
            return false;
        }
        if (animal.prenha && !(animal.dataPrenha instanceof Date)) {
            AlertMessage("Data de prenhez inválida");
            return false;
        }
    
        if (animal.inseminado) {
            if (!(animal.dataInseminacao instanceof Date)) {
                AlertMessage("Data de inseminação inválida");
                return false;
            }
            if (!(animal.dataConfirmacaoInseminacao instanceof Date)) {
                AlertMessage("Data de confirmação da inseminação inválida");
                return false;
            }
            if (!(animal.dataPrevisaoParto instanceof Date)) {
                AlertMessage("Data de previsão de parto inválida");
                return false;
            }
            if (!animal.tipoInseminacao || animal.tipoInseminacao === "") {
                AlertMessage("Informe o tipo de inseminação");
                return false;
            }
            if (!animal.touroUsadoInseminacao || animal.touroUsadoInseminacao === "") {
                AlertMessage("Informe o touro usado na inseminação");
                return false;
            }
        }
    
        return true;
    }
    

    function parseAnimalToSubmit(animal) {
        const animalToSubmit = {
            ...animal,
            peso: checkNumericValues(animal.peso, true), // Converte para float
            dataNacimento: animal.dataNacimento != "" ? animal.dataNacimento.toLocaleDateString() : "",
            dataCio: animal.cio ? (animal.dataCio != "" ? animal.dataCio.toLocaleDateString() : "") : "",
            dataPrenha: animal.prenha ? (animal.dataPrenha != "" ? animal.dataPrenha.toLocaleDateString() : "") : "",
            dataInseminacao: animal.inseminado ? (animal.dataInseminacao != "" ? animal.dataInseminacao.toLocaleDateString() : "") : "",
            dataConfirmacaoInseminacao: animal.inseminado ? (animal.dataConfirmacaoInseminacao != "" ? animal.dataConfirmacaoInseminacao.toLocaleDateString() : "") : "",
            dataPrevisaoParto: animal.inseminado ? (animal.dataPrevisaoParto != "" ? animal.dataPrevisaoParto.toLocaleDateString() : "") : "",
        };

        return animalToSubmit
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

    function transformToDate(date) {

        if (!date || date == "") return ""

        if (date instanceof Date) return date;


        const [dia, mes, ano] = date.split("/");
        const data = new Date(ano, mes - 1, dia); // mês começa do 0 (janeiro)
        return data
    }

    function onAdd() {

        setIsEditing(false);
        setModalVisible(true);
    }



    async function onSubmitAdd() {

        

        try {
            if (!checkForm(newAnimal)) {
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

        try {

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
                }}
                onPressCancel={clearForm}

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
