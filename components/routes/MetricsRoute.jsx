import { ScrollView, StyleSheet } from "react-native"
import Cards from "../Cards"

export default function MetricsRoute({ filteredAnimals }) {
    const total = filteredAnimals.length
    const mediaPeso = filteredAnimals.reduce((ac, curr) => ac + curr.peso, 0) / total
    const { inseminado, prenha, cio } = getAnimalsStatus()
    const data = [
        {
            id: 1,
            title: "Geral",
            "quantidade de animais": filteredAnimals.length,
            "peso médio": mediaPeso,
        },
        {
            id: 2,
            title: "Inseminação",
            "quantidade de animais": inseminado,
            "taxa de serviço": "R$ " + inseminado * 100,
        },
        {
            id: 3,
            title: "Prenha",
            "quantidade de animais": prenha,
            "taxa de concepção": "R$ " + prenha * 100,
        },
        {
            id: 4,
            title: "Cio",
            "quantidade de animais": cio,
            "taxa de detecção": "R$ " + cio * 100,
        },
    ]




    function getAnimalsStatus() {
        return {
            inseminado: filteredAnimals.filter((animal) => animal.inseminado).length,
            prenha: filteredAnimals.filter((animal) => animal.prenha).length,
            cio: filteredAnimals.filter((animal) => animal.cio).length,
        }
    }


    return (
        <ScrollView style={styles.metrics}>

            {filteredAnimals.length > 0 ?
                <Cards
                    data={data} /> :
                <Cards data={[{ id: 1, title: "Nenhum animal encontrado" }]} />
            }


        </ScrollView>
    )
}


const styles = StyleSheet.create({
    metrics: {
        backgroundColor: "#DBFFCB",
        flex: 1,
        paddingHorizontal: 20,
    },
    metricText: {
        fontSize: 18,
        marginVertical: 8,
        color: "#3F704D",
    },
})