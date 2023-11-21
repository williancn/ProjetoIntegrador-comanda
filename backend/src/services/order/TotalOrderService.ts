import prismaClient from "../../prisma";

interface TotalRequest{
    order_id: string;
}

class TotalOrderService {
    async execute({ order_id }: TotalRequest) {
        const orders = await prismaClient.item.findMany({
            where: {
                order_id: order_id
            },
            include: {
                product: true,
                order: true,
            }
        });

        // Calcula a soma dos preços
        const totalPrice = orders.reduce((acc, order) => {
            const price = parseFloat(order.product.price);
            const amount = order.amount;
            return acc + (price * amount);
        }, 0);

        return totalPrice;
    }
}

export { TotalOrderService }