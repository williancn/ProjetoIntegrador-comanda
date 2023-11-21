import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { api } from "../../services/api";

type RouteDetailParams = {
  FinishOrder: {
    number: string | number;
    order_id: string;
  };
};

type FinishOrderRouteProp = RouteProp<RouteDetailParams, "FinishOrder">;

export function FinishOrder() {
  const route = useRoute<FinishOrderRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const [totalValue, setTotalValue] = useState<number | null>(null);

  useEffect(() => {
    async function fetchTotalValue() {
      try {
        const response = await api.get("order/total", {
          params: {
            order_id: route.params?.order_id,
          },
        });
        setTotalValue(response.data);
      } catch (err) {
        console.error("Erro ao obter o valor total do pedido");
      }
    }

    fetchTotalValue();
  }, []);

  async function handleFinish() {
    try {
      await api.put(
        "order/finish",
        {
          order_id: route.params?.order_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigation.popToTop();
    } catch (err) {
      console.error("Erro ao finalizar o pedido, tente mais tarde");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.alert}>Deseja fechar essa mesa?</Text>
      <Text style={styles.title}>Mesa {route.params?.number}</Text>
      {totalValue !== null && (
        <Text style={styles.total}>
          Valor total: R$ {totalValue.toFixed(2)}
        </Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.textButton}>Fechar Mesa</Text>
        <Feather name="shopping-cart" size={20} color="#1d1d2e" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d2e",
    paddingVertical: "5%",
    paddingHorizontal: "4%",
    alignItems: "center",
    justifyContent: "center",
  },

  alert: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 12,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },

  total: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#ff3f4b",
    flexDirection: "row",
    width: "65%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },

  textButton: {
    fontSize: 18,
    marginRight: 8,
    fontWeight: "bold",
    color: "#1d1d2e",
  },
});