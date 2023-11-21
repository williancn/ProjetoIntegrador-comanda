import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Dashboard from "../pages/Dashboard";
import Order from "../pages/Order";
import { SendOrder } from "../pages/SendOrder";
import OpenOrder from "../pages/OpenOrder";
import { FinishOrder } from "../pages/FinishOrder";

export type StackParamsList = {
    Dashboard: undefined;
    OpenOrder: undefined;
    Order: {
        number: number | string;
        order_id: string;
        editable: boolean;
    };
    SendOrder: {
        number: number | string;
        order_id: string;
        editable: boolean;
    };
    FinishOrder: {
        number: number | string;
        order_id: string;
    }
};

const Stack = createNativeStackNavigator<StackParamsList>();

function AppRoutes(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}}/>
            <Stack.Screen name="OpenOrder" component={OpenOrder} options={{headerShown: false}}/>
            <Stack.Screen name="Order" component={Order} options={{headerShown: false}}/>
            <Stack.Screen 
            name="SendOrder" 
            component={SendOrder} 
            options={{title: 'Criar/Salvar', headerStyle:{
                backgroundColor: '#1d1d2e'
            },
            headerTintColor: '#fff'
            }}/>
            <Stack.Screen 
            name="FinishOrder" 
            component={FinishOrder} 
            options={{title: 'Fechar Mesa', headerStyle:{
                backgroundColor: '#1d1d2e'
            },
            headerTintColor: '#fff'
            }}/>
        </Stack.Navigator>
    )
}

export default AppRoutes;