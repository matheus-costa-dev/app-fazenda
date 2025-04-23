import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Cards({ data, icons, onEdit, onDelete, onCardPress, renderKeys }) {

    function formatFirebaseDate(timestamp) {
        if (!timestamp || !timestamp.seconds) return "";

        const date = new Date(timestamp.seconds * 1000);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // mês começa do zero
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }


    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            renderItem={({ item }) => {
                // Componente de conteúdo do card (reutilizável)

                const CardContent = () => (
                    <>
                        {icons && (
                            <View style={styles.cardIcons}>
                                <Ionicons
                                    name="pencil-outline"
                                    style={styles.cardEditIcon}
                                    onPress={() => onEdit(item)}
                                />
                                <Ionicons
                                    name="trash-outline"
                                    style={styles.cardDeletIcon}
                                    onPress={() => onDelete(item.id)}
                                />
                            </View>
                        )}

                        {renderKeys ? (

                            <>
                                {renderKeys.map((key) => {
                                    const val = item[key]

                                    if (!val || val =="") return null
                                    if (val != undefined) {
                                        if (key === "title") {
                                            return (
                                                <View style={styles.cardTitle} key={key}>
                                                    <Text style={styles.cardTitleText}>{val}</Text>
                                                </View>
                                            );
                                        }

                                        

                                        return (
                                            <Text style={styles.cardText} key={key}>
                                                <Text style={{ fontWeight: "bold", paddingHorizontal: 5 }}>{key}: </Text>
                                                <Text>{typeof val === "boolean" ? (val ? "Sim" : "Não") : val}</Text>
                                            </Text>
                                        );
                                    }
                                })}

                            </>) : (<>
                                {Object.entries(item).map(([key, val], index) => {
                                    if (["farmId", "id"].includes(key)) return null;
                                    if (key === "title") {
                                        return (
                                            <View style={styles.cardTitle} key={`${key}-${index}`}>
                                                <Text style={styles.cardTitleText}>{val}</Text>
                                            </View>
                                        );
                                    }
                                    return (
                                        <Text style={styles.cardText} key={`${key}-${index}`}>
                                            <Text style={{ fontWeight: "bold", paddingHorizontal: 5 }}>
                                                {key}:
                                            </Text>
                                            <Text>
                                                {typeof val === "boolean" ? (val ? "Sim" : "Não") : val}
                                            </Text>
                                        </Text>
                                    );
                                })}
                            </>)}


                    </>
                );

                return onCardPress ? (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => onCardPress(item.id)}
                    >
                        <CardContent />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.card}>
                        <CardContent />
                    </View>
                );
            }}
            ListEmptyComponent={() => (
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: "#555", fontSize: 16 }}>Nenhum card disponível</Text>
                </View>
            )}
        />
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#A8D5BA",
        padding: 20,
        marginVertical: 10,
        borderRadius: 16,
        width: "100%",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        elevation: 3,
    },
    cardIcons: {
        display: "flex",
        flexDirection: "row",
        gap: 15,
        justifyContent: "flex-end",
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