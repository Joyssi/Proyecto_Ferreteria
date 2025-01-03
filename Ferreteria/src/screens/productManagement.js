import React, { useEffect, useState } from 'react';
import { Text, View, Button, StyleSheet, Alert, FlatList, TextInput, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { appFirebase } from '../../DataBase/firebaseConfig'; 
import Icon from 'react-native-vector-icons/MaterialIcons';  // Importar los íconos

export default function ProductManagement() {
    const db = getFirestore(appFirebase);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false); // Estado para el refresh
    const [searchText, setSearchText] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    // Función para obtener productos
    const fetchProducts = async () => {
        setIsRefreshing(true); // Activar el refresh
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
            setIsRefreshing(false); // Desactivar el refresh
        }
    };

    // Función para eliminar un producto
    const deleteProduct = async (id) => {
        try {
            await deleteDoc(doc(db, 'colecProductos', id));
            setProducts(products.filter(product => product.id !== id));
            setFilteredProducts(filteredProducts.filter(product => product.id !== id));
            Alert.alert("Éxito", "Producto eliminado con éxito");
        } catch (error) {
            console.error("Error al eliminar el producto: ", error);
            Alert.alert("Error", "Hubo un problema al eliminar el producto");
        }
    };

    // Función para empezar a editar un producto
    const startEditing = (product) => {
        setSearchText(''); // Limpiar campo de búsqueda al editar
        setEditingProduct(product);
        setProductName(product.productName);
        setDescription(product.description);
        setBrand(product.brand);
        setPrice(product.price.toString());
        setStockQuantity(product.stockQuantity.toString());
    };

    // Función para actualizar un producto
    const updateProduct = async () => {
        if (!productName || !description || !brand || !price || !stockQuantity) {
            Alert.alert("Error", "Todos los campos son requeridos.");
            return;
        }

        const updatedProduct = {
            productName,
            description,
            brand,
            price: parseFloat(price),
            stockQuantity: parseInt(stockQuantity),
        };

        try {
            const productRef = doc(db, 'colecProductos', editingProduct.id);
            await updateDoc(productRef, updatedProduct);
            setProducts(products.map(product =>
                product.id === editingProduct.id ? { ...product, ...updatedProduct } : product
            ));
            setFilteredProducts(filteredProducts.map(product =>
                product.id === editingProduct.id ? { ...product, ...updatedProduct } : product
            ));
            setEditingProduct(null);
            Alert.alert("Éxito", "Producto actualizado con éxito");
        } catch (error) {
            console.error("Error al actualizar el producto: ", error);
            Alert.alert("Error", "Hubo un problema al actualizar el producto");
        }
    };

    // Función para filtrar productos
    const filterProducts = (text) => {
        setSearchText(text);

        const lowercasedText = text.toLowerCase();
        const filtered = products.filter(product => {
            const matchName = product.productName.toLowerCase().includes(lowercasedText);
            const matchBrand = product.brand.toLowerCase().includes(lowercasedText);
            const matchPrice = product.price.toString().includes(lowercasedText);

            return matchName || matchBrand || matchPrice;
        });

        setFilteredProducts(filtered);
    };

    return (
        <View style={styles.container}>

            {!editingProduct && (
                <TextInput
                    style={styles.input}
                    placeholder="Buscar por nombre, marca o precio"
                    value={searchText}
                    onChangeText={filterProducts}
                />
            )}

            {editingProduct ? (
                <View style={styles.form}>
                    <Text style={styles.formTitle}>Editar Producto</Text>
                    <Text style={styles.inputLabel}>Nombre del producto</Text>
                    <TextInput
                        style={styles.input}
                        value={productName}
                        onChangeText={setProductName}
                    />
                    <Text style={styles.inputLabel}>Descripción</Text>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                    />
                    <Text style={styles.inputLabel}>Marca</Text>
                    <TextInput
                        style={styles.input}
                        value={brand}
                        onChangeText={setBrand}
                    />
                    <Text style={styles.inputLabel}>Precio</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                    />
                    <Text style={styles.inputLabel}>Cantidad en stock</Text>
                    <TextInput
                        style={styles.input}
                        value={stockQuantity}
                        onChangeText={setStockQuantity}
                        keyboardType="numeric"
                    />
                    <View style={styles.buttonRow}>
                        <Button title="Actualizar Producto" onPress={updateProduct} />
                        <Button title="Cancelar" onPress={() => setEditingProduct(null)} />
                    </View>
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.productRow}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {/* Usamos la URI de la imagen desde Firestore */}
                                <Image
                                    source={{ uri: item.imageUrl }} 
                                    style={styles.productImage}
                                />
                                <View style={styles.productInfo}>
                                    <Text><Text style={styles.bold}>Nombre:</Text> {item.productName}</Text>
                                    <Text><Text style={styles.bold}>Descripción:</Text> {item.description}</Text>
                                    <Text><Text style={styles.bold}>Marca:</Text> {item.brand}</Text>
                                    <Text><Text style={styles.bold}>Precio:</Text> C$ {item.price}</Text>
                                    <Text><Text style={styles.bold}>Categoría: </Text>{item.category}</Text>
                                    <Text><Text style={styles.bold}>Cantidad en stock:</Text> {item.stockQuantity}</Text>
                                </View>
                            </ScrollView>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity onPress={() => startEditing(item)}>
                                    <Icon name="edit" size={24} color="#4CAF50" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    Alert.alert(
                                        "Confirmar Eliminación",
                                        "¿Estás seguro de que deseas eliminar este producto?",
                                        [
                                            { text: "Cancelar", style: "cancel" },
                                            { text: "Eliminar", onPress: () => deleteProduct(item.id) },
                                        ]
                                    );
                                }}>
                                    <Icon name="delete" size={24} color="#f44336" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={fetchProducts} // Función para recargar los productos
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#fff',
    },
    input: {
        borderColor: '#1357a6',
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#1663be'
    },
    form: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 20,
        elevation: 3,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        marginLeft: 70,
        color: '#104a8e'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    productRow: {
        flexDirection: 'row',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 10,
        alignItems: 'center',
    },
    productImage: {
        width: 100,
        height: 100,
        marginRight: 15,
        borderRadius: 5,
    },
    productInfo: {
        flex: 1,
        minWidth: 200,
    },
    bold: {
        fontWeight: 'bold',
    },
});
