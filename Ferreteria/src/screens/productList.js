import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Alert, Dimensions, ScrollView } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { appFirebase } from '../../DataBase/firebaseConfig'; 

export default function ProductList() {
    const db = getFirestore(appFirebase);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    
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

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productCarousel}>
                {filteredProducts.map((item) => (
                    <View key={item.id} style={styles.productCard}>
                        <Image source={item.image} style={styles.productImage} />
                        <Text style={styles.productName}>{item.productName}</Text>
                        <Text style={styles.productDescription}>{item.description}</Text>
                        <Text style={styles.productBrand}>{item.brand}</Text>
                        <Text style={styles.productPrice}>${item.price}</Text>
                        <TouchableOpacity 
                            style={styles.buyButton} 
                            onPress={() => handleBuy(item.productName)}
                        >
                            <Text style={styles.buyButtonText}>Comprar</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const { width } = Dimensions.get('window');

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
    productCarousel: {
        marginBottom: 20,
    },
    productCard: {
        width: width * 0.6, // Ajustar ancho de la tarjeta
        marginRight: 15,
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
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    productDescription: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 10,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 10,
    },
    buyButton: {
        backgroundColor: '#ff5722',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    buyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
