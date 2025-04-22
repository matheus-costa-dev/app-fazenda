import { Modal, Text, Button, StyleSheet, View, TextInput, ScrollView } from "react-native"
import RenderInput from "../components/RenderInput"
import { useRef, useState } from "react"
import CustomButton from "../components/CustomButton"
import RenderInputDate from "./RenderInputDate"
import { buttonCancelStyle, buttonSubmitStyle, buttonStatusAnimalStyle } from "../styles/app"
import DatePickerToggle from "./DatePickerToggle"
import { Picker } from '@react-native-picker/picker';



export default function AnimalModal({ modalVisible, setModalVisible, animal, setAnimal, titleSubmitButton, onSubmit }) {
    const specieRef = useRef(null)
    const weightRef = useRef(null)
    const [showDateInseminacao, setShowDateInseminacao] = useState(false)
    const [showDateCio, setShowDateCio] = useState(false)
    const [showDatePrenha, setShowDatePrenha] = useState(false)
    const [showBirdthDate, setShowBirdthDate] = useState(false)
    const [showDateConfirmationInseminacao, setShowDateConfirmationInseminacao] = useState(false)


    function formatDate(date) {
        if (!date) return "";
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês começa em 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function getBirthEstimate(date, string) {
        // return console.log(date instanceof Date)
        const futureDate = new Date(date)
        futureDate.setDate(futureDate.getDate() + 190) // 190 dias == 6 meses e alguns dias
        const dateString = futureDate.toLocaleDateString()
        return string ? dateString : futureDate

    }
    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <ScrollView style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Novo Animal</Text>
                    <RenderInput
                        icon={"id-card-outline"}
                        placeholder={"Nome"}
                        value={animal.nome}
                        setValue={(text) => setAnimal({ ...animal, nome: text })}
                        isPassword={false}
                        keyboardType={"default"}
                        onSubmitEditing={() => specieRef.current?.focus()}
                    />

                    <RenderInput
                        placeholder={"Espécie"}
                        icon={"logo-octocat"}
                        value={animal.especie}
                        setValue={(text) => setAnimal({ ...animal, especie: text })}
                        isPassword={false}
                        keyboardType={"default"}
                        ref={specieRef}
                        onSubmitEditing={() => weightRef.current?.focus()}
                    />

                    <RenderInput
                        placeholder="Peso"
                        icon={"barbell-outline"}
                        value={animal.peso}
                        setValue={(text) => setAnimal({ ...animal, peso: text })}
                        keyboardType="decimal-pad"
                        isPassword={false}
                        ref={weightRef}
                    />

                    <Text>Data de nascimento</Text>
                    <RenderInputDate
                        icon={"calendar-clear-outline"}
                        placeholder={"Data de nascimento"}
                        value={formatDate(animal.dataNacimento)}
                        editable={false}
                        onPress={() => setShowBirdthDate(true)}
                    />

                    <DatePickerToggle
                        show={showBirdthDate}
                        value={animal.dataNacimento}
                        onChange={(date) => setAnimal({ ...animal, dataNacimento: date })}
                        onClose={() => setShowBirdthDate(false)}
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



                        <CustomButton
                            buttonText={`Inseminado: ${animal.inseminado ? (
                                `Sim\n${formatDate(animal.dataInseminacao)}`

                            ) : "Não"}`}
                            onPress={() => {
                                setAnimal({ ...animal, inseminado: !animal.inseminado })
                                !animal.inseminado ? setShowDateInseminacao(true) : setShowDateInseminacao(false)
                            }}
                            customTouchableStyle={buttonStatusAnimalStyle.customTouchableStyle}
                            customButtonStyle={buttonStatusAnimalStyle.customButtonStyle}
                        />


                        <DatePickerToggle
                            show={showDateInseminacao}
                            value={animal.dataInseminacao}
                            onChange={(date) => setAnimal({ ...animal, dataInseminacao: date , dataPrevisaoParto: getBirthEstimate(date, false)})}
                            onClose={() => setShowDateInseminacao(false)}
                        />


                    </View>

                    {animal.inseminado ? (
                        <View style={{ marginTop: 30 }}>
                            <Text>Dia da confirmação da inseminação</Text>
                            <RenderInputDate
                                icon={"calendar-clear-outline"}
                                editable={false}
                                onPress={() => setShowDateConfirmationInseminacao(true)}
                                value={formatDate(animal.dataConfirmacaoInseminacao)}
                            />

                            <DatePickerToggle
                                value={animal.dataConfirmacaoInseminacao}
                                show={showDateConfirmationInseminacao}
                                onChange={(date) => setAnimal({
                                    ...animal,
                                    dataConfirmacaoInseminacao: date,
                                    dataPrevisaoParto: getBirthEstimate(date, false)
                                })}
                                onClose={() => setShowDateConfirmationInseminacao(false)}
                            />


                            <Text>Data da previsão do parto</Text>
                            <RenderInput
                                editable={false}
                                icon={"calendar-outline"}
                                value={formatDate(animal.dataPrevisaoParto)}
                            />


                            <Text>Tipo de insimenição</Text>
                            <Picker
                                selectedValue={animal.tipoInseminacao}
                                onValueChange={(tipo) => setAnimal({ ...animal, tipoInseminacao: tipo })}
                            >
                                <Picker.Item label="Monta" value="Monta" />
                                <Picker.Item label="Inseminação artificial" value="Artificial" />
                            </Picker>

                            <RenderInput
                                icon={"paw-outline"}
                                placeholder={"Touro usado"}
                                value={animal.touroUsadoInseminacao}
                                setValue={(text) => setAnimal({ ...animal, touroUsadoInseminacao: text })} />
                        </View>

                    ) : (null)}

                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10, marginBottom: 30 }}>

                        <CustomButton
                            buttonText={"Cancelar"}
                            onPress={() => setModalVisible(false)}
                            customTouchableStyle={buttonCancelStyle.customTouchableStyle}
                            customButtonStyle={buttonCancelStyle.customButtonStyle}
                        />
                        <CustomButton
                            buttonText={titleSubmitButton}
                            onPress={onSubmit}
                            customTouchableStyle={buttonSubmitStyle.customTouchableStyle}
                            customButtonStyle={buttonSubmitStyle.customButtonStyle}
                        />

                    </View>
                </ScrollView>
            </View>
        </Modal>

    )

}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        width: "85%",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)", // Substitui shadowColor, shadowOffset, shadowOpacity, shadowRadius,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },

})