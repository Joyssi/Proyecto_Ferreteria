import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importar los íconos
import Entypo from '@expo/vector-icons/Entypo';
import formProduct from '../screens/formProduct';
import productList from '../screens/productList';
import productManagement from '../screens/productManagement';
import estadistics from '../estadistics/estadistics';

const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#1870d5', // Fondo blanco para la barra de navegación
                    height: 60, // Aumentar altura para hacerlo más grande
                    paddingBottom: 5,
                    borderTopWidth: 0, // Eliminar borde superior
                },
                tabBarLabelStyle: {
                    fontSize: 12, // Reducir el tamaño de la etiqueta
                    fontWeight: 'bold', // Etiquetas en negrita
                    marginBottom: 5, // Espacio entre íconos y etiquetas
                },
                tabBarActiveTintColor: '#fff', // Color activo
                tabBarInactiveTintColor: '#ded4', // Color inactivo
            }}
        >
            <Tab.Screen
                name="Productos"
                component={productList}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="list" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Nuevo"
                component={formProduct}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="add" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Gestión"
                component={productManagement}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="settings" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Estadísticas"
                component={estadistics}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="bar-graph" size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <MyTabs />
        </NavigationContainer>
    );
}
