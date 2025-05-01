import { View } from "react-native"
import Cards from "../Cards"
import { appStyles } from "../../styles/app"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";

export default function MetricsRoute({ filteredAnimals }) {
    const { user } = useAuth()
    const total = filteredAnimals.length
    const mediaPeso = filteredAnimals.reduce((ac, curr) => ac + curr.peso, 0) / total
    const { inseminacao, prenha, cio } = getAnimalsStatus()


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
            "quantidade de animais": inseminacao,
            "taxa de serviço": toPercentage(inseminacao, total),
        },
        {
            id: 3,
            title: "Cio",
            "quantidade de animais": cio,
            "Taxa de detecção do cio": toPercentage(cio, total),
        },
        {
            id: 4,
            title: "Prenha",
            "quantidade de animais": prenha,
            "taxa de prenhez": toPercentage(prenha, inseminacao),
            "taxa de concepção": toPercentage(prenha, total),
        },

    ]

    function toPercentage(val, total) {
        return " " + (val / total * 100).toFixed(2).toString() + "%"
    }



    function getAnimalsStatus() {
        // const totalInseminacao =  filteredAnimals.reduce((acc, cur) => acc + cur.inseminacao.length ,0)s
        const inseminacao = filteredAnimals.reduce((acc, cur) => cur.inseminacao.length > 0 ? acc + 1 : acc, 0)
        const prenha = filteredAnimals.reduce((acc, cur) => cur.prenha ? acc + 1 : acc, 0)
        const cio = filteredAnimals.reduce((acc, cur) => cur.cio ? acc + 1 : acc, 0)

        return {
            inseminacao,
            prenha,
            cio
        }
    }


    async function fetchData() {
        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();
        const allAnimals = userData.animais || [];
        const farmAnimals = allAnimals.filter((animal) => animal.farmId === id);
        const farm = userData.fazendas.find((farm) => farm.id === id)

        setFilteredAnimals(farmAnimals || []);

    }


    return (
        <View style={appStyles.container}>
            {filteredAnimals.length > 0 ? (
                <Cards data={data} />
            ) : (
                <Cards data={[{ id: 1, title: "Nenhum animal encontrado" }]} />
            )}
        </View>
    )
}

