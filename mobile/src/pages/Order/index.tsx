import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from "react-native";

import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";

import { Feather } from "@expo/vector-icons";
import { api } from "../../services/api";
import { ModalPicker } from "../../components/ModalPicker";
import { ListItem } from "../../components/ListItem";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

type RouteDetailParams = {
  Order: {
    number: number | string;
    order_id: string;
    editable: boolean;
  };
};

export type CategoryProps = {
  id: string;
  name: string;
};

type ProductProps = {
  id: string;
  name: string;
};

type ItemProps = {
  id: string;
  product_id: string;
  name: string;
  amount: number | string;
};

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  banner: string;
  category_id: string;
}

interface Item {
  id: string;
  amount: number;
  created_at: string;
  updated_at: string;
  order_id: string;
  product_id: string;
  product: Product;
}

interface Order {
  id: string;
  table: number;
  status: boolean;
  draft: boolean;
  name: null | string;
  items: Item[];
}

type OrderRouteProps = RouteProp<RouteDetailParams, "Order">;

export default function Order() {
  const route = useRoute<OrderRouteProps>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const [category, setCategory] = useState<CategoryProps[] | []>([]);
  const [categorySelected, setCategorySelected] = useState<
    CategoryProps | undefined
  >();
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

  const [products, setProducts] = useState<ProductProps[] | []>([]);
  const [productSelected, setProductSelected] = useState<
    ProductProps | undefined
  >();
  const [modalProductVisible, setModalProductVisible] = useState(false);

  const [amount, setAmount] = useState("1");
  const [items, setItems] = useState<ItemProps[]>([]);

  useEffect(() => {
    async function loadInfo() {
      const response = await api.get("/category");

      setCategory(response.data);
      setCategorySelected(response.data[0]);
    }

    loadInfo();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get("/category/product", {
        params: {
          category_id: categorySelected?.id,
        },
      });

      setProducts(response.data);
      setProductSelected(response.data[0]);
    }

    loadProducts();
  }, [categorySelected]);

  useEffect(() => {
    async function loadItems() {
      if (route.params?.editable) {
        try {
          const orderResponse = await api.get<Order[]>("/order/detail", {
            params: {
              order_id: route.params?.order_id,
            },
          });

          // Iterar sobre os itens do pedido e adicionar ao estado
          orderResponse.data.forEach((order: Order) => {
            order.items.forEach((item: Item) => {
              const data = {
                id: item.id,
                product_id: item.product.id,
                name: item.product.name,
                amount: item.amount,
              };

              setItems((oldArray) => [...oldArray, data]);
            });
          });
        } catch (err) {
          console.error("Erro ao carregar os itens do pedido:", err);
        }
      }
    }

    loadItems();
  }, [route.params?.editable, route.params?.order_id, setItems]);

  async function handleCloseOrder() {
    try {
      api.delete("/order", {
        params: {
          order_id: route.params?.order_id,
        },
      });

      navigation.goBack();
    } catch (err) {
      console.error("Erro ao fechar pedido tente novamente mais tarde !", err);
    }
  }

  function handleChangeCategory(item: CategoryProps) {
    setCategorySelected(item);
  }

  function handleChangeProduct(item: ProductProps) {
    setProductSelected(item);
  }

  async function handleAdd() {
    const response = await api.post("/order/add", {
      order_id: route.params.order_id,
      product_id: productSelected?.id,
      amount: Number(amount),
    });

    let data = {
      id: response.data.id,
      product_id: productSelected?.id as string,
      name: productSelected?.name as string,
      amount: amount,
    };

    setItems((oldArray) => [...oldArray, data]);
  }

  async function handleDeleteItem(item_id: string) {
    await api.delete("/order/remove", {
      params: {
        item_id: item_id,
      },
    });

    let removeItem = items.filter((item) => {
      return item.id !== item_id;
    });

    setItems(removeItem);
  }

  function handleFinishOrder() {
    navigation.navigate("SendOrder", {
      number: route.params.number,
      order_id: route.params.order_id,
      editable: route.params.editable,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mesa {route.params.number}</Text>
        <View style={styles.ButtonArea}>
          {items.length === 0 ? (
            <TouchableOpacity
              style={styles.trashButton}
              onPress={handleCloseOrder}
            >
              <Feather name="trash-2" size={28} color="#ff3f4b" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.finishButton}
              onPress={() => {
                navigation.navigate("FinishOrder", {
                  number: route.params.number,
                  order_id: route.params.order_id,
                });
              }}
            >
              <Text style={styles.finishButtonText}>Fechar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {category.length !== 0 && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalCategoryVisible(true)}
        >
          <Text style={{ color: "#fff" }}>{categorySelected?.name}</Text>
        </TouchableOpacity>
      )}

      {products.length !== 0 && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalProductVisible(true)}
        >
          <Text style={{ color: "#fff" }}>{productSelected?.name}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.qtdContainer}>
        <Text style={styles.qtdText}>Quantidade</Text>
        <TextInput
          style={[styles.input, { width: "60%" }]}
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#f0f0f0"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]}
          disabled={items.length === 0}
          onPress={handleFinishOrder}
        >
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginTop: 24 }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem data={item} deleteItem={handleDeleteItem} />
        )}
      />

      <Modal
        transparent={true}
        visible={modalCategoryVisible}
        animationType="fade"
      >
        <ModalPicker
          handleCloseModal={() => setModalCategoryVisible(false)}
          options={category}
          selectedItem={handleChangeCategory}
        />
      </Modal>

      <Modal
        transparent={true}
        visible={modalProductVisible}
        animationType="fade"
      >
        <ModalPicker
          handleCloseModal={() => setModalProductVisible(false)}
          options={products}
          selectedItem={handleChangeProduct}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d2e",
    paddingVertical: "5%",
    paddingEnd: "4%",
    paddingStart: "4%",
  },

  header: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
    marginTop: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 14,
  },

  ButtonArea: {
    flex: 1,
    display: "flex",
    justifyContent: "space-around",
  },

  finishButton: {
    backgroundColor: "#ff3f4b",
    borderRadius: 4,
    height: 40,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },

  trashButton: {
    height: 40,
    width: "20%",
    top: "10%",
    alignSelf: "flex-end",
  },

  finishButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#101026",
    borderRadius: 4,
    width: "100%",
    height: 40,
    marginBottom: 12,
    justifyContent: "center",
    paddingHorizontal: 8,
    color: "#fff",
    fontSize: 20,
  },

  qtdContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  qtdText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

  actions: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },

  buttonAdd: {
    width: "20%",
    backgroundColor: "#3fd1ff",
    borderRadius: 4,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#101026",
    fontSize: 18,
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#3fffae",
    borderRadius: 4,
    height: 40,
    width: "75%",
    alignItems: "center",
    justifyContent: "center",
  },
});
