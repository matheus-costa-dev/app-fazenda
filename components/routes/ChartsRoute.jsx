import { View, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useWindowDimensions } from "react-native";
import * as aq from "arquero";
import { op } from "arquero"

export default function ChartsRoute({ filteredAnimals }) {

    
    if (filteredAnimals.length === 0) {
        return null
    }

    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    const df = aq.from(filteredAnimals)
    const df_plot = df
        .fold(["cio", "prenha", "inseminado"], { as: ["category", "value"] })
        .select(["category", "value"])
        .groupby("category")
        .rollup({ value_sum: op.sum("value") })

    const chartData = {
        labels: df_plot.objects().map((item) => item.category),
        datasets: [
            {
                data: df_plot.objects().map((item) => item.value_sum)
            }
        ]
    }



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