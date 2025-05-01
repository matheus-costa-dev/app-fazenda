import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation } from "expo-router";
import Cards from '../../components/Cards';
import FloatButton from '../../components/FloatButton';
import { appStyles } from '../../styles/app';
import { useEffect, useState } from 'react';
import CustomModal from "../../components/CustomModal"
import RenderInput from '../../components/RenderInput';
import RenderInputDate from '../../components/RenderInputDate';
import DatePickerToggle from '../../components/DatePickerToggle';
import { formatDate, getBirthEstimate, transformToDate } from '../../functions/app';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../../components/CustomButton';
import { v4 } from 'uuid';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";


export default function Inseminacao() {
    const { user } = useAuth()
    const { id } = useLocalSearchParams()
    const [inseminacaoList, setInseminacaoList] = useState([])
    const [animals, setAnimals] = useState()
    const [modalVisible, setModalVisible] = useState(false)
    const [showBirdthDate, setShowBirdthDate] = useState(false)
    const [newInseminacao, setNewInseminacao] = useState({
        id: "",
        dataInseminacao: new Date(),
        dataConfirmacao: new Date(),
        tipoInseminacao: "Monta",
        touroUsadoInseminacao: ""
    })
    const [showDateConfirmationInseminacao, setShowDateConfirmationInseminacao] = useState(false)
    const navigation = useNavigation()
    const [dataLoading, setDataLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        navigation.setOptions({
            title: "animal",
        })
        fetchData()

    }, [])

    async function fetchData() {
        try {
            const userDoc = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDoc);
            const userData = userSnap.data();

            const allAnimals = userData?.animais || [];
            setAnimals(allAnimals);

            const filteredAnimal = allAnimals.find(an => an.id === id);
            setInseminacaoList(filteredAnimal?.inseminacao || []);

            navigation.setOptions({
                title: filteredAnimal.nome,
            })

            setDataLoading(false)
        } catch (error) {
            console.error("Erro ao buscar dados do Firestore:", error);
        }
    }


    async function onSubmitAdd() {

        setDataLoading(true)


        try {


            const parsedInseminacaoToSubmit = {
                ...newInseminacao,
                id: v4(),
                dataInseminacao: formatDate(newInseminacao.dataInseminacao),
                dataConfirmacao: formatDate(newInseminacao.dataConfirmacao),
            }

            const inseminacaoUpdated = ([...inseminacaoList, parsedInseminacaoToSubmit])
            const animalsUpdated = animals.map(animal => animal.id === id ? { ...animal, inseminacao: inseminacaoUpdated } : animal)

            const userDoc = doc(db, "users", user.uid)
            await updateDoc(userDoc, {
                animais: animalsUpdated
            })


            setInseminacaoList(inseminacaoUpdated)
            setAnimals(animalsUpdated)
            setModalVisible(false)

        } catch (error) {
            console.error(error)
        }

        setDataLoading(false)
    }

    function onEdit(item) {
        try {

            setNewInseminacao({
                id: item.id,
                dataInseminacao: transformToDate(item.dataInseminacao),
                dataConfirmacao: transformToDate(item.dataConfirmacao),
                tipoInseminacao: item.tipoInseminacao,
                touroUsadoInseminacao: item.touroUsadoInseminacao
            })

            setIsEditing(true)
            setModalVisible(true)
        } catch (error) {
            console.error(error)
        }
    }

    async function onSubmitEdit() {
        try {
            const parsedInseminacaoToSubmit = {
                ...newInseminacao,
                dataInseminacao: formatDate(newInseminacao.dataInseminacao),
                dataConfirmacao: formatDate(newInseminacao.dataConfirmacao),
            }
            const inseminacaoUpdated = inseminacaoList.map(inseminacao => inseminacao.id === newInseminacao.id ? parsedInseminacaoToSubmit : inseminacao)
            const animalsUpdated = animals.map(animal => animal.id === id ? { ...animal, inseminacao: inseminacaoUpdated } : animal)

            const userDoc = doc(db, "users", user.uid)
            await updateDoc(userDoc, {
                animais: animalsUpdated
            })

            setInseminacaoList(inseminacaoUpdated)
            setAnimals(animalsUpdated)

        } catch (error) {
            console.error(error)
        }

        setIsEditing(false)
    }


    async function onDelete(itemID) {
        setDataLoading(true)
        try {
            const inseminacaoUpdated = inseminacaoList.filter(inseminacao => inseminacao.id != itemID)
            const animalsUpdated = animals.map(an => an.id === id ? {
                ...an,
                inseminacao: inseminacaoUpdated
            } : an)

            const userDoc = doc(db, "users", user.uid)
            await updateDoc(userDoc, {
                animais: animalsUpdated
            })

            setInseminacaoList(inseminacaoUpdated)
            setAnimals(animalsUpdated)
            setModalVisible(false)

        } catch (error) {
            console.error(error)
        }
        setDataLoading(false)

    }

    if (dataLoading) {
        return (
            <View style={appStyles.container}>
                <ActivityIndicator size={"large"} />
            </View>
        )
    }


    return (
        <View style={appStyles.container}>
            <Cards
                data={inseminacaoList}
                icons={true}
                onEdit={(item) => onEdit(item)}
                onDelete={(itemID) => onDelete(itemID)}
                renderKeys={["dataInseminacao", "dataConfirmacao", "tipoInseminacao","touroUsadoInseminacao"]}
            />

            <FloatButton
                iconName={"add-outline"}
                onPress={() => setModalVisible(true)}
            />


            <CustomModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                modalTitle={!isEditing ? "Adicionar inseminação" : "Editar inseminação"}

            >
                <RenderInputDate
                    icon={"calendar-clear-outline"}
                    placeholder={"Data de nascimento"}
                    value={formatDate(newInseminacao.dataInseminacao)}
                    editable={false}
                    onPress={() => setShowBirdthDate(true)}
                />

                <DatePickerToggle
                    show={showBirdthDate}
                    value={newInseminacao.dataInseminacao}
                    onChange={(date) => setNewInseminacao({ ...newInseminacao, dataInseminacao: date })}
                    onClose={() => setShowBirdthDate(false)}
                />

                <Text>data previsão do parto</Text>
                <RenderInput
                    icon={"calendar-clear-outline"}
                    placeholder={"Data de nascimento"}
                    value={getBirthEstimate(newInseminacao.dataInseminacao, true)}
                    editable={false}
                />

                <Text>Dia da confirmação da inseminação</Text>
                <RenderInputDate
                    icon={"calendar-clear-outline"}
                    editable={false}
                    onPress={() => setShowDateConfirmationInseminacao(true)}
                    value={formatDate(newInseminacao.dataConfirmacao)}
                />

                <DatePickerToggle
                    value={newInseminacao.dataConfirmacao}
                    show={showDateConfirmationInseminacao}
                    onChange={(date) => setNewInseminacao({
                        ...newInseminacao,
                        dataConfirmacao: date,
                    })}
                    onClose={() => setShowDateConfirmationInseminacao(false)}
                />


                <Text>Tipo de insimenição</Text>
                <Picker
                    selectedValue={newInseminacao.tipoInseminacao}
                    onValueChange={(tipo) => setNewInseminacao({ ...newInseminacao, tipoInseminacao: tipo })}
                >
                    <Picker.Item label="Monta" value="Monta" />
                    <Picker.Item label="Inseminação artificial" value="Inseminação artificial" />
                </Picker>

                <RenderInput
                    icon={"paw-outline"}
                    placeholder={"Touro usado"}
                    value={newInseminacao.touroUsadoInseminacao}
                    setValue={(text) => setNewInseminacao({ ...newInseminacao, touroUsadoInseminacao: text })}

                />

                <View style={appStyles.modalActionsButtons}>

                    <CustomButton
                        buttonText={"Cancelar"}
                        onPress={() => {
                            setModalVisible(false)
                        }}
                        customTouchableStyle={appStyles.customTouchableStyleCancel}
                        customButtonStyle={appStyles.customButtonStyleCancel}
                    />
                    <CustomButton
                        buttonText={!isEditing ? "Adicionar" : "Editar"}
                        customTouchableStyle={appStyles.customTouchableStyleSubmit}
                        customButtonStyle={appStyles.customButtonStyleSubmit}
                        onPress={() => {
                            !isEditing ? onSubmitAdd() : onSubmitEdit()
                            setModalVisible(false)
                        }}

                    />

                </View>



            </CustomModal>
        </View>
    );
}