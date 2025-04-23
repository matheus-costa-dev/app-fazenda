import { Modal, View, Text } from "react-native"
import { appStyles } from "@/styles/app"

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
            <View style={appStyles.modalOverlay}>
                <View style={appStyles.modalContent}>
                    <Text style={appStyles.modalTitle}> {modalTitle} </Text>
                    {children}
                </View>
            </View>
        </Modal>
    )
}
