import { Request, Response } from "express";
import { TotalOrderService } from "../../services/order/TotalOrderService";

class TotalOrderController{
    async handle(req: Request, res: Response){
        const order_id = req.query.order_id as string;

        const finishOrderService = new TotalOrderService();

        const orders = await finishOrderService.execute({
            order_id
        })

        return res.json(orders);

    }
}

export { TotalOrderController }