import { Modal, Text, View, ScrollView } from "react-native"
import RenderInput from "../components/RenderInput"
import { useRef, useState } from "react"
import CustomButton from "../components/CustomButton"
import RenderInputDate from "./RenderInputDate"
import { buttonStatusAnimalStyle, appStyles } from "../styles/app"
import DatePickerToggle from "./DatePickerToggle"
import { useRouter } from "expo-router"
import { formatDate } from "../functions/app"


export default function AnimalModal({ modalVisible, setModalVisible, animal, setAnimal, titleSubmitButton, onSubmit, onPressCancel }) {
    const dataNascimentoRef = useRef(null)
    const weightRef = useRef(null)
    const obsRef = useRef(null)
    const [showDateCio, setShowDateCio] = useState(false)
    const [showDatePrenha, setShowDatePrenha] = useState(false)
    const [showBirdthDate, setShowBirdthDate] = useState(false)
    const router = useRouter()



    function modalContent() {
        return (
            <View>

                <Text style={appStyles.modalTitle}>Novo Animal</Text>
                <RenderInput
                    icon={"id-card-outline"}
                    placeholder={"Nome"}
                    value={animal.nome}
                    setValue={(text) => setAnimal({ ...animal, nome: text })}
                    isPassword={false}
                    keyboardType={"default"}
                    onSubmitEditing={() => dataNascimentoRef.current?.focus()}
                />


                <Text>Data de nascimento</Text>
                <RenderInputDate
                    icon={"calendar-clear-outline"}
                    placeholder={"Data de nascimento"}
                    value={formatDate(animal.dataNacimento)}
                    editable={false}
                    onPress={() => setShowBirdthDate(true)}
                    onSubmitEditing={() => weightRef.current?.focus()}
                />

                <DatePickerToggle
                    show={showBirdthDate}
                    value={animal.dataNacimento}
                    onChange={(date) => setAnimal({ ...animal, dataNacimento: date })}
                    onClose={() => setShowBirdthDate(false)}
                />


                <RenderInput
                    placeholder="Peso"
                    icon={"barbell-outline"}
                    value={animal.peso}
                    setValue={(text) => setAnimal({ ...animal, peso: text })}
                    keyboardType="decimal-pad"
                    isPassword={false}
                    onSubmitEditing={() => obsRef.current?.focus()}
                />

                <RenderInput
                    placeholder="Obs"
                    icon={"document-outline"}
                    value={animal.obs}
                    setValue={(text) => setAnimal({ ...animal, obs: text })}
                    keyboardType="default"
                    isPassword={false}
                    ref={obsRef}
                />


                {/* Booleans podem ser checkboxes/switches futuramente */}
                <View style={{ flexDirection: "row", gap: 10, borderRadius: 25, justifyContent: "center", flexWrap: "wrap", }}>


                    <CustomButton
                        buttonText={`Cio: ${animal.cio ? (
                            `Sim\n${formatDate(animal.dataCio)}`

                        ) : "Não"}`}
                        onPress={() => {
                            setAnimal({ ...animal, cio: !animal.cio })
                            !animal.cio ? setShowDateCio(true) : setShowDateCio(false)
                        }}
                        customTouchableStyle={buttonStatusAnimalStyle.customTouchableStyle}
                        customButtonStyle={buttonStatusAnimalStyle.customButtonStyle}
                    />


                    <DatePickerToggle
                        show={showDateCio}
                        value={animal.dataCio}
                        onChange={(date) => setAnimal({ ...animal, dataCio: date })}
                        onClose={() => setShowDateCio(false)}
                    />

                    <CustomButton
                        buttonText={`Prenha: ${animal.prenha ? (
                            `Sim\n${formatDate(animal.dataPrenha)}`

                        ) : "Não"}`}
                        onPress={() => {
                            setAnimal({ ...animal, prenha: !animal.prenha })
                            !animal.prenha ? setShowDatePrenha(true) : setShowDatePrenha(false)
                        }}
                        customTouchableStyle={buttonStatusAnimalStyle.customTouchableStyle}
                        customButtonStyle={buttonStatusAnimalStyle.customButtonStyle}
                    />

                    <DatePickerToggle
                        show={showDatePrenha}
                        value={animal.dataPrenha}
                        onChange={(date) => setAnimal({ ...animal, dataPrenha: date })}
                        onClose={() => setShowDatePrenha(false)}
                    />



                </View>


                {/* <CustomButton
                    buttonText={"Inseminação >"}
                    onPress={() => {
                        console.log(animal)
                        router.push({
                            pathname: "inseminacao",
                            params: { data: JSON.stringify(animal.inseminacao) }
                        })
                    }}
                /> */}



                <View style={appStyles.modalActionsButtons}>

                    <CustomButton
                        buttonText={"Cancelar"}
                        onPress={() => {
                            setModalVisible(false)
                            onPressCancel()
                        }}
                        customTouchableStyle={appStyles.customTouchableStyleCancel}
                        customButtonStyle={appStyles.customButtonStyleCancel}
                    />
                    <CustomButton
                        buttonText={titleSubmitButton}
                        onPress={onSubmit}
                        customTouchableStyle={appStyles.customTouchableStyleSubmit}
                        customButtonStyle={appStyles.customButtonStyleSubmit}
                    />

                </View>
            </View>
        )
    }

    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={appStyles.modalOverlay}>
                <View style={appStyles.modalContent}>
                    {modalContent()}
                </View>
            </View>
        </Modal>

    )

}
