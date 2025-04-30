import { View, StyleSheet, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit"; // alterado aqui
import { appStyles } from "../../styles/app";
import Cards from "../Cards";

function ChartsRoute({ filteredAnimals }) {
    const { width } = Dimensions.get("window");

    if (!filteredAnimals || filteredAnimals.length === 0) {
        return (
            <View style={appStyles.container}>
                <Cards data={[{ id: 1, title: "Nenhum dado disponível para exibir gráficos" }]} />
            </View>
        );
    }

    const categories = ["cio", "prenha", "inseminacao"];

    const total = filteredAnimals.length;

    const dataByCategory = categories.map((category) => {
        let value = 0;

        if (category === "inseminacao") {
            value = filteredAnimals.reduce((sum, animal) => sum + (animal.inseminacao?.length > 0 ? 1 : 0), 0);
        } else {
            value = filteredAnimals.reduce((sum, animal) => sum + (animal[category] ? 1 : 0), 0);
        }

        const percentage = ((value / total) * 100).toFixed(1);

        return {
            name:`${category.slice(0, 8)} (${percentage}%)`, // exibe percentual na legenda
            value,
            color:
                category === "cio"
                    ? "#f39c12"
                    : category === "prenha"
                        ? "#27ae60"
                        : "#2980b9",
            legendFontColor: "#333",
            legendFontSize: 14,
            
        };
    });

    return (
        <View style={appStyles.container}>
            <PieChart
                data={dataByCategory}
                width={width * 0.9}
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={"value"}
                backgroundColor={"transparent"}
                
                absolute
                paddingLeft="-5"
            />
        </View>
    );
}

export default ChartsRoute;
