import { Modal, View, Text,StyleSheet } from "react-native"

export default function CustomModal({ modalVisible, setModalVisible, modalTitle, children, onRequestClose }) {
    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => {
                setModalVisible(false)
                onRequestClose
            }}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}> {modalTitle} </Text>
                    {children}
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        width: "90%",
        elevation: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 24,
        color: "#333",
    },

})