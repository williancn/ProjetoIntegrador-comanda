import Modal from "react-modal"
import styles from './styles.module.scss'

import { FiX } from "react-icons/fi"

import { OrderItemDetailProps } from "@/pages/dashboard"

interface ModalOrderProsps {
  isOpen: boolean;
  onRequestClose: () => void;
  order: OrderItemDetailProps[];
  handleFinishOrder: (id: string) => void;
}


export function ModalOrder({ isOpen, onRequestClose, order, handleFinishOrder }: ModalOrderProsps) {

  const customStyles = {
    content: {
      top: '50%',
      bottom: 'auto',
      left: '50%',
      right: 'auto',
      padding: '30px',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#1d1d23'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >




      <div className={styles.container}>
        <div className={styles.contanerHeader}>
          <h2>Detalhes do pedido</h2>

          <button
            type="button"
            onClick={onRequestClose}
            className="react-modal-close"
            style={{ background: 'transparent', border: 0 }}
          >
            <FiX size={45} color="#f34748" />
          </button>
        </div>

        <span className={styles.table}>
          Mesa: <strong>{order[0].order.table}</strong>
        </span>

        { order[0].items.map(item => (
          <section key={item.id} className={styles.containerItem}>
            <span>{item.amount} - <strong>{item.product.name}</strong></span>
            <span className={styles.description}>{item.product.description}</span>
          </section>
        ))}

        <button className={styles.buttonOrder} onClick={() => handleFinishOrder(order[0].order.id)}>
          Concluir pedido
        </button>


      </div>

    </Modal>
  )
}