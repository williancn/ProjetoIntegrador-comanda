import { useState, useEffect } from "react";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import styles from "./style.module.scss";

import { Header } from "../../components/Header";
import { FiRefreshCcw } from "react-icons/fi";

import { setupAPIClient } from "@/services/api";

import { ModalOrder } from "@/components/ModalOrder";

import Modal from "react-modal";

type OrderItems = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
};

interface HomeProps {
  orders: OrderItems[];
}

export type OrderItemDetailProps = {
  order: OrderProps;
  items: OrderItemsProps[];
};

type OrderProps = {
  id: string;
  table: string | number;
  status: boolean;
  name: string | null;
};

type OrderItemsProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: ProductProps;
};

type ProductProps = {
  id: string;
  name: string;
  price: string;
  description: string;
  banner: string;
  category_id: string;
};

export default function Dashboard({ orders }: HomeProps) {
  const [orderList, setOrderList] = useState(orders || []);

  const [modalItem, setModalItem] = useState<OrderItemDetailProps[]>();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const apiCLient = setupAPIClient();
      const response = await apiCLient.get("/orders");
      setOrderList(response.data);
    }, 5000);

    // Cleanup do intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);
  
  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleOpenModalView(id: string) {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/order/detail", {
      params: {
        order_id: id,
      },
    });

    setModalItem(response.data);
    console.log(modalItem);
    setModalVisible(true);
  }

  async function handleFinishItem(id: string) {
    const apiClient = setupAPIClient();
    await apiClient.put("/order/finish", {
      order_id: id,
    });

    const response = await apiClient.get("/orders");
    setOrderList(response.data);
    setModalVisible(false);
  }

  async function handleRefreshOrders() {
    const apiCLient = setupAPIClient();

    const response = await apiCLient.get("/orders");
    setOrderList(response.data);
  }

  Modal.setAppElement("#__next");

  return (
    <>
      <Head>
        <title>Painel - Pizzaria Casanova</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Últimos pedidos</h1>
            <button onClick={handleRefreshOrders}>
              <FiRefreshCcw size={25} color="#3fffa3" />
            </button>
          </div>

          <article className={styles.listOrders}>
            {orderList.length === 0 && (
              <span className={styles.emptyList}>
                Nenhum pedido aberto foi encontado...
              </span>
            )}

            {orderList.map((item) => (
              <section key={item.id} className={styles.orderItem}>
                <button onClick={() => handleOpenModalView(item.id)}>
                  <div className={styles.tag}></div>
                  <span>Mesa {item.table}</span>
                </button>
              </section>
            ))}
          </article>
        </main>

        {modalVisible && (
          <ModalOrder
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            order={modalItem}
            handleFinishOrder={handleFinishItem}
          />
        )}
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/orders");

  return {
    props: {
      orders: response.data,
    },
  };
});
