import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { api } from "../../services/api";

interface Order {
  id: number;
  table: number;
}

export default function Dashboard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
    const intervalId = setInterval(() => {
      loadOrders();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [orders]);

  async function loadOrders() {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Erro ao carregar os pedidos", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pedidos Atuais</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("OpenOrder")}>
          <Text style={styles.buttonText}>Novo Pedido</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Order", {
                order_id: item.id.toString(),
                number: item.table,
                editable: true,
              })
            }
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <Text style={styles.orderText}>Mesa {item.table}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d2e",
    padding: 16,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  orderText: {
    color: "white",
    fontSize: 16,
  },
  buttonText: {
    color: "#101026",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },

  button: {
    backgroundColor: "#3fffae",
    borderRadius: 4,
    height: 50,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
});
