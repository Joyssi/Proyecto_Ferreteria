import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, Alert, Dimensions, Animated, RefreshControl } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { appFirebase } from '../../DataBase/firebaseConfig';

const { width } = Dimensions.get('window'); // Para el diseño responsivo y centralizado

export default function ProductList() {
    const db = getFirestore(appFirebase);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false); // Estado para el control de actualización
    const scrollX = new Animated.Value(0);

    // Función para obtener los productos desde Firestore
    const fetchProducts = async () => {
        setIsRefreshing(true); // Activar el estado de carga
        try {
            const querySnapshot = await getDocs(collection(db, 'colecProductos'));
            const productsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productsList);
            setFilteredProducts(productsList);
        } catch (error) {
            console.log("Error al obtener los productos: ", error);
        } finally {
            setIsRefreshing(false); // Desactivar el estado de carga
        }
    };

    // Cargar los productos al inicio
    useEffect(() => {
        fetchProducts();
    }, []);

    // Filtrar productos en base al texto de búsqueda
    useEffect(() => {
        const filtered = products.filter(product =>
            product.productName.toLowerCase().includes(searchText.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchText.toLowerCase()) ||
            product.price.toString().includes(searchText)
        );
        setFilteredProducts(filtered);
    }, [searchText, products]);

    // Manejar la compra de un producto
    const handleBuy = (productName) => {
        Alert.alert("Compra realizada", `Has comprado el producto: ${productName}`);
    };

    // Función para manejar el evento de "pull-to-refresh"
    const onRefresh = () => {
        // Refrescar los productos
        fetchProducts();
    };

    return (
        <View style={styles.container}>

            <TextInput
                style={styles.searchInput}
                placeholder="Buscar productos..."
                value={searchText}
                onChangeText={setSearchText}
            />

            <Animated.FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: width * 0.1 }}
                snapToInterval={width * 0.7}
                decelerationRate="fast"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh} // Llamar a la función onRefresh
                    />
                }
                renderItem={({ item, index }) => {
                    const scale = scrollX.interpolate({
                        inputRange: [
                            (index - 1) * (width * 0.7),
                            index * (width * 0.7),
                            (index + 1) * (width * 0.7),
                        ],
                        outputRange: [0.9, 1, 0.9],
                        extrapolate: 'clamp',
                    });
                    return (
                        <Animated.View style={[styles.productCard, { transform: [{ scale }] }]}>
                            {/* Mostrar imagen según URI guardada en Firestore */}
                            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                            <Text style={styles.productName}>{item.productName}</Text>
                            <Text style={styles.productDescription}>{item.description}</Text>
                            <Text style={styles.productBrand}>Marca: {item.brand}</Text>
                            <Text style={styles.productCategory}>Categoría: {item.category}</Text>
                            <Text style={styles.productPrice}>C$ {item.price}</Text>
                            <TouchableOpacity 
                                style={styles.buyButton} 
                                onPress={() => handleBuy(item.productName)}
                            >
                                <Text style={styles.buyButtonText}>Comprar</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    searchInput: {
        height: 40,
        borderColor: '#1357a6',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    productCard: {
        width: width * 0.6,
        marginHorizontal: width * 0.05,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        padding: 10,
        alignItems: 'center',
    },
    productImage: {
        width: width * 0.55,
        height: width * 0.78,
        borderRadius: 10,
        marginBottom: 10,
    },
    productName: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        color: '#1e91ed',
    },
    productDescription: {
        fontSize: 12,
        color: '#4ca1f5',
        textAlign: 'justify',
        marginBottom: 10,
    },
    productBrand: {
        fontSize: 16,
        color: '#4ca1f5',
        textAlign: 'left',
    },
    productCategory: {
        fontSize: 12,
        color: '#4ca1f5',
        textAlign: 'left',
    },
    productPrice: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#1357a6',
    },
    buyButton: {
        backgroundColor: '#1663be',
        paddingVertical: 10,
        paddingHorizontal: 70,
        borderRadius: 20,
        marginTop: 10,
    },
    buyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
