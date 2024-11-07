import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, Alert, Dimensions, ScrollView } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { appFirebase } from '../../DataBase/firebaseConfig'; 

export default function ProductList() {
    const db = getFirestore(appFirebase);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    
    // Obtener productos desde Firestore
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
                setFilteredProducts(productsList); // Inicialmente se mostrarán todos los productos
            } catch (error) {
                console.log("Error al obtener los productos: ", error);
            }
        };

        fetchProducts();
    }, []);

    // Filtrar productos basado en el texto de búsqueda
    useEffect(() => {
        const filtered = products.filter(product =>
            product.productName.toLowerCase().includes(searchText.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchText.toLowerCase()) ||
            product.price.toString().includes(searchText)
        );
        setFilteredProducts(filtered);
    }, [searchText, products]);

    // Función para el botón de "Compra"
    const handleBuy = (productName) => {
        Alert.alert("Compra realizada", `Has comprado el producto: ${productName}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tienda Online</Text>
            
            {/* Barra de búsqueda */}
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar productos..."
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* Lista de productos */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productCarousel}>
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id}
                    numColumns={3} // Mostrar los productos en 3 columnas
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <Image source={item.image} style={styles.productImage} />
                            <Text style={styles.productName}>{item.productName}</Text>
                            <Text style={styles.productDescription}>{item.description}</Text>
                            <Text style={styles.productBrand}>{item.brand}</Text>
                            <Text style={styles.productPrice}>${item.price}</Text>
                            <TouchableOpacity 
                                style={styles.buyButton} 
                                onPress={() => handleBuy(item.productName)} // Llamada a la función de compra
                            >
                                <Text style={styles.buyButtonText}>Comprar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    );
}

const { width } = Dimensions.get('window'); // Para hacer el diseño responsivo

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
        flex: 1,
        margin: 10,
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
        width: width * 0.4, // 40% del ancho de la pantalla
        height: width * 0.4, // 40% del ancho de la pantalla para hacer la imagen cuadrada
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
