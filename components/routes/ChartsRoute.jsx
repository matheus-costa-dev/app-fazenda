import { View, StyleSheet, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useWindowDimensions } from "react-native";

export default function ChartsRoute({ filteredAnimals }) {
    if (!filteredAnimals || filteredAnimals.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.chartsText}>Nenhum dado disponível para exibir gráficos.</Text>
            </View>
        );
    }

    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;

    // Processamento dos dados sem arquero
    const categories = ["cio", "prenha", "inseminado"];
    const dataByCategory = categories.map((category) => {
        const valueSum = filteredAnimals.reduce((sum, animal) => sum + (animal[category] || 0), 0);
        return { category, valueSum };
    });

    const chartData = {
        labels: dataByCategory.map((item) => item.category),
        datasets: [
            {
                data: dataByCategory.map((item) => item.valueSum),
            },
        ],
    };

    return (
        <View style={styles.container}>
            <BarChart
                data={chartData}
                width={windowWidth * 0.9} // Largura do gráfico
                height={windowHeight * 0.5} // Altura do gráfico
                fromZero={true} // Garante que o eixo Y comece em 0
                yAxisInterval={1} // Define o intervalo do eixo Y como 1
                chartConfig={{
                    backgroundColor: "#f4f4f4", // Cor sólida de fundo
                    backgroundGradientFrom: "#ffffff", // Gradiente inicial (branco)
                    backgroundGradientTo: "#e0f7fa", // Gradiente final (azul claro)
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Cor dos dados (preto com opacidade)
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Cor dos rótulos (preto com opacidade)
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#DBFFCB",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    chartsText: {
        fontSize: 18,
        marginVertical: 8,
        color: "#3F704D",
    },
});

