import { Dimensions, ScrollView } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router"
import { useEffect, useState } from "react";
import { TabView, TabBar } from "react-native-tab-view"
import ListRoute from "../../components/routes/ListRoute";
import MetricsRoute from "../../components/routes/MetricsRoute";
import ChartsRoute from "../../components/routes/ChartsRoute";
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";

function Animals() {
    const { user } = useAuth()
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [filteredAnimals, setFilteredAnimals] = useState([])
    const [farmName, setFarmName] = useState("")

    useEffect(() => {

        fetchData()

        navigation.setOptions({
            title: farmName,
        })


    }, [farmName])

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "list", title: "Animais" },
        { key: "metrics", title: "Métricas" },
        { key: "charts", title: "Gráficos" },
    ])

    async function fetchData() {
        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();
        const allAnimals = userData.animais || [];
        const farmAnimals = allAnimals.filter((animal) => animal.farmId === id);

        setFilteredAnimals(farmAnimals || []);
        setFarmName(userData.fazendas.find((farm) => farm.id === id)?.name)

    }

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'list':
                return <ListRoute
                    filteredAnimals={filteredAnimals}
                    setFilteredAnimals={setFilteredAnimals}
                    farmId={id} />
            case 'metrics':
                return <MetricsRoute filteredAnimals={filteredAnimals} />
            case 'charts':
                return <ChartsRoute filteredAnimals={filteredAnimals} />
            default:
                return null;
        }
    };

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get("window").width }}
            renderTabBar={(props) => (
                <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: "#3F704D" }}
                    style={{ backgroundColor: "#A8D5BA" }}
                    labelStyle={{ color: "#2F4F4F", fontWeight: "bold" }}
                />
            )}
        />
    )
}





export default Animals;