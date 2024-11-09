import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, Alert, Dimensions, Animated } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { appFirebase } from '../../DataBase/firebaseConfig';

const { width } = Dimensions.get('window'); // Para el diseño responsivo y centralizado

export default function ProductList() {
    const db = getFirestore(appFirebase);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const scrollX = new Animated.Value(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'colecProductos'));
                const productsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    image: require('../../assets/taladro.jpg'), // Imagen local
                }));
                setProducts(productsList);
                setFilteredProducts(productsList);
            } catch (error) {
                console.log("Error al obtener los productos: ", error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter(product =>
            product.productName.toLowerCase().includes(searchText.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchText.toLowerCase()) ||
            product.price.toString().includes(searchText)
        );
        setFilteredProducts(filtered);
    }, [searchText, products]);

    const handleBuy = (productName) => {
        Alert.alert("Compra realizada", `Has comprado el producto: ${productName}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tienda Online</Text>
            
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
                            <Image source={item.image} style={styles.productImage} />
                            <Text style={styles.productName}>{item.productName}</Text>
                            <Text style={styles.productDescription}>{item.description}</Text>
                            <Text style={styles.productBrand}>{item.brand}</Text>
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
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    productCard: {
        width: width * 0.6,
        marginHorizontal: width * 0.05,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        padding: 10,
        alignItems: 'center',
    },
    productImage: {
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: 10,
        marginBottom: 10,
    },
    productName: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        color: '#0000FF',
    },
    productDescription: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 10,
    },
    productBrand: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
    },
    productPrice: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 10,
    },
    buyButton: {
        backgroundColor: '#ff5722',
        paddingVertical: 10,
        paddingHorizontal: 70,
        borderRadius: 10,
        marginTop: 10,
    },
    buyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
