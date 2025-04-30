import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appStyles, cardStyles } from "@/styles/app";
import { openWhatsApp, sendEmail } from "../functions/app"
import CustomButton from "./CustomButton";
import { useRouter } from "expo-router";


export default function Cards({ data, icons, leftIcons, onEdit, onDelete, onCardPress, renderKeys, buttonInseminacao }) {

    const router = useRouter()

    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            renderItem={({ item }) => {
                const CardContent = () => (
                    <>
                        {icons && (
                            <View style={cardStyles.cardIcons}>
                                {/* Grupo da esquerda - só aparece se leftIcons for true */}
                                {leftIcons && (
                                    <View style={cardStyles.cardIconsGroup}>
                                        <Ionicons
                                            name="logo-whatsapp"
                                            style={cardStyles.cardWhatsappIcon}
                                            onPress={() => openWhatsApp(item.telefone)}
                                        />
                                        <Ionicons
                                            name="mail-outline"
                                            style={cardStyles.cardEmailIcon}
                                            onPress={() => sendEmail(item.email)}
                                        />
                                    </View>
                                )}

                                {/* Grupo da direita - sempre aparece quando icons é true */}
                                <View style={[cardStyles.cardIconsGroup, !leftIcons && { marginLeft: "auto" }]}>
                                    <Ionicons
                                        name="pencil-outline"
                                        style={cardStyles.cardEditIcon}
                                        onPress={() => onEdit(item)}
                                    />
                                    <Ionicons
                                        name="trash-outline"
                                        style={cardStyles.cardDeletIcon}
                                        onPress={() => onDelete(item.id)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Restante do conteúdo do card... */}
                        {renderKeys ? (
                            <>
                                {renderKeys.map((key) => {
                                    const val = item[key]

                                    if (!val || val == "") return null
                                    if (val != undefined) {
                                        if (key === "title") {
                                            return (
                                                <View style={cardStyles.cardTitle} key={key}>
                                                    <Text style={cardStyles.cardTitleText}>{val}</Text>
                                                </View>
                                            );
                                        }



                                        return (
                                            <Text style={cardStyles.cardText} key={key}>
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
                                            <View style={cardStyles.cardTitle} key={`${key}-${index}`}>
                                                <Text style={cardStyles.cardTitleText}>{val}</Text>
                                            </View>
                                        );
                                    }
                                    return (
                                        <Text style={cardStyles.cardText} key={`${key}-${index}`}>
                                            <Text style={{ fontWeight: "bold", paddingHorizontal: 5 }}>
                                                {key}:
                                            </Text>
                                            <Text>
                                                {typeof val === "boolean" ? (val ? "Sim" : "Não") : val}
                                            </Text>
                                        </Text>
                                    );
                                })}
                            </>)
                        }
                        {buttonInseminacao ? (
                            <>
                                <CustomButton
                                    buttonText={"Inseminação >"}
                                    customButtonStyle={appStyles.customButtonStyleSubmit}
                                    customTouchableStyle={appStyles.customTouchableStyleSubmit}
                                    onPress={() => {
                                        router.push("inseminacao/" + item.id)
                                    }}
                                />
                            </>
                        ) : null}
                    </>
                );

                return onCardPress ? (
                    <TouchableOpacity style={cardStyles.card} onPress={() => onCardPress(item.id)}>
                        <CardContent />
                    </TouchableOpacity>
                ) : (
                    <View style={cardStyles.card}>
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