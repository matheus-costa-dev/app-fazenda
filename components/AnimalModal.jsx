import { Modal, Text, TextInput, Button, StyleSheet, View } from "react-native"
import RenderInput from "../components/RenderInput"

export default function AnimalModal({ modalVisible, setModalVisible, animal, setAnimal, titleSubmitButton, onSubmit }) {
    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Novo Animal</Text>
                    <RenderInput 
                    icon={"id-card-outline"}
                    placeholder={"Nome"}
                    value={animal.nome}
                    setValue={(text)=> setAnimal({ ...animal, nome: text })}
                    isPassword={false}
                    keyboardType={"default"}
                    />

                    <RenderInput 
                    placeholder={"Espécie"}
                    icon={"logo-octocat"}
                    value={animal.especie}
                    setValue={(text) => setAnimal({ ...animal, especie: text })}
                    isPassword={false}
                    keyboardType={"default"}
                    />
                    
                    <RenderInput 
                        placeholder="Peso"
                        icon={"barbell-outline"}
                        value={animal.peso}
                        setValue={(text) => setAnimal({ ...animal, peso: text})}
                        keyboardType="decimal-pad"
                        isPassword={false}
                    />
                    
                    {/* Booleans podem ser checkboxes/switches futuramente */}
                    <View style={{ flexDirection: "row", gap: 10, borderRadius: 25, justifyContent: "center", flexWrap: "wrap" }}>
                        <Button
                            title={`Cio: ${animal.cio ? "Sim" : "Não"}`}
                            onPress={() => setAnimal({ ...animal, cio: !animal.cio })}
                        />
                        <Button
                            title={`Prenha: ${animal.prenha ? "Sim" : "Não"}`}
                            onPress={() => setAnimal({ ...animal, prenha: !animal.prenha })}
                        />
                        <Button
                            title={`Inseminado: ${animal.inseminado ? "Sim" : "Não"}`}
                            onPress={() => setAnimal({ ...animal, inseminado: !animal.inseminado })}
                        />
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
                        <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                        <Button title={titleSubmitButton} onPress={() => {
                            // Aqui você pode salvar o animal
                            onSubmit()
                            setModalVisible(false);
                        }} />
                    </View>
                </View>
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