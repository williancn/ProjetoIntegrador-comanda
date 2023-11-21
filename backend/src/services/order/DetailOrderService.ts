import prismaClient from "../../prisma";

interface DetailRequest{
    order_id: string;
}
class DetailOrderService {
    async execute({ order_id }: DetailRequest) {
        const orders = await prismaClient.item.findMany({
            where: {
                order_id: order_id
            },
            include: {
                product: true,
                order: true,
            }
        });

        const groupedOrders = orders.reduce((acc, item) => {
            if (!acc[item.order_id]) {
                acc[item.order_id] = {
                    order: {
                        id: item.order.id,
                        table: item.order.table,
                        status: item.order.status,
                        draft: item.order.draft,
                        name: item.order.name,
                    },
                    items: [],
                };
            }

            // Remover os campos created_at e updated_at do objeto order
            const { created_at: orderCreatedAt, updated_at: orderUpdatedAt, ...orderWithoutTimestamps } = item.order;


            // Remover a referência ao objeto order do item
            const { order, ...itemWithoutOrder } = item;

            // Remover os campos created_at e updated_at do objeto item
            const { created_at: itemCreatedAt, updated_at: itemUpdatedAt, ...itemWithoutTimestamps } = itemWithoutOrder;

            // Remover os campos created_at e updated_at do objeto product para cada item
            delete itemWithoutTimestamps.product.created_at;
            delete itemWithoutTimestamps.product.updated_at;

            acc[item.order_id].items.push(itemWithoutTimestamps);
            acc[item.order_id].order = orderWithoutTimestamps;

            return acc;
        }, {});

        const result = Object.values(groupedOrders);

        return result;
    }
}

export { DetailOrderService };
