import { Dimensions, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router"
import { useEffect, useState } from "react";
import { TabView, TabBar } from "react-native-tab-view"
import ListRoute from "../../components/routes/ListRoute";
import MetricsRoute from "../../components/routes/MetricsRoute";
import ChartsRoute from "../../components/routes/ChartsRoute";
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import { tabViewStyles, appStyles } from "../../styles/app";


function Animals() {
    const { user, loading } = useAuth()
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [farmName, setFarmName] = useState("")
    const [dataLoading, setDataLoading] = useState(true)

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
        const farm = userData.fazendas.find((farm) => farm.id === id)

        setFilteredAnimals(farmAnimals || []);
        setFarmName(farm?.nome)
        setDataLoading(false)

    }

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'list':
                return (
                    <ListRoute
                        filteredAnimals={filteredAnimals}
                        setFilteredAnimals={setFilteredAnimals}
                        farmId={id}
                    />
                );
            case 'metrics':
                return <MetricsRoute filteredAnimals={filteredAnimals} />;
            case 'charts':
                return <ChartsRoute filteredAnimals={filteredAnimals} />;
            default:
                return (
                    <View>
                        <Text>Rota inválida.</Text>
                    </View>
                );
        }
    };


    if (loading || dataLoading) {
        return (
            <View style={appStyles.container}>
                <ActivityIndicator  size={"large"}  />
            </View>
        )
    }

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get("window").width }}
            renderTabBar={(props) => (
                <TabBar
                    {...props}
                    indicatorStyle={tabViewStyles.indicatorStyle}
                    style={tabViewStyles.tabBarStyle}
                    labelStyle={tabViewStyles.labelStyle}
                />
            )}
        />
    )
}





export default Animals;