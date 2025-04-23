import { StyleSheet } from "react-native";

export const headerStyles = StyleSheet.create({
    header: {
        backgroundColor: '#BBD8A3',
        color: "white",
    },
    statusbar: {
        backgroundColor: "#E9F5BE",
    },
    logout: {
        customTouchableStyle: {
            backgroundColor: "#D37676",
            borderRadius: 20,
            marginBottom: "10%"
        },
        customButtonStyle: {
            color: "#fff",
            fontSize: 12,
        },
    }
   
});

export const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#F3F7E3",
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    customTouchableStyleCancel: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#A94442",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    modalActionsButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 24,
        gap: 12,
    },
    customButtonStyleCancel: {
        color: "#f44336",
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center"
    },
    customTouchableStyleSubmit: {
        backgroundColor: "#6DA34D",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    customButtonStyleSubmit: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center"
    },
    // Modals
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#FEFAE0",
        borderRadius: 20,
        padding: 20,
        width: "85%",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#BDB76B",
        borderRadius: 12,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: "#333",
        paddingHorizontal: 20,
        borderRadius: 20,
    },
})

export const floatButtonStyles = StyleSheet.create({
    buttonContainer: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#90C67C",
        borderRadius: 50,
        width: 60,
        height: 60,
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.3)",
        zIndex: 10,
    },
    iconButton: {
        fontSize: 30,
        color: "#fff",
    }
})

export const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: "#E6F0DA",
        padding: 20,
        marginVertical: 10,
        borderRadius: 16,
        width: "100%",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        elevation: 3,
    },
    cardIcons: {
        flexDirection: "row",
        justifyContent: "space-between", // Isso separa os grupos
        width: "100%",
        marginBottom: 10,
    },
    cardIconsGroup: {
        flexDirection: "row",
        gap: 15,
    },
    cardWhatsappIcon: {
        fontSize: 26,
        color: "#6F826A",
    },
    cardEmailIcon: {
        fontSize: 26,
        color: "#5C7285",
    },
    cardEditIcon: {
        fontSize: 26,
        color: "orange",
    },
    cardDeletIcon: {
        fontSize: 26,
        color: "red",
    },
    cardTitle: {
        justifyContent: "center",
        alignItems: "center",
    },
    cardTitleText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2F4F4F",
        marginBottom: 6,
        alignItems: "center"
    },
    cardText: {
        fontSize: 16,
        color: "#3F704D",
        marginBottom: 6,
    }
})

export const tabViewStyles = StyleSheet.create({
    indicatorStyle: {
        backgroundColor: "#6DA34D",
    },
    tabBarStyle: {
        backgroundColor: "#6F826A",
    },
    labelStyle: {
        color: "#000",
        fontWeight: "bold",
    }

})

export const buttonStatusAnimalStyle = {
    customTouchableStyle: {
        backgroundColor: "#4682B4",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    customButtonStyle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center"
    }
};

export const colors = {
    inputIcon: "#4682B4",
}