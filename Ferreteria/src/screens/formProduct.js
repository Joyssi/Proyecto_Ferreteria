import { View, Text, Button, StyleSheet, Image, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { collection, addDoc, getFirestore } from "firebase/firestore"; 
import * as ImagePicker from 'expo-image-picker';
import { appFirebase } from '../../DataBase/firebaseConfig.js';

export default function FormProductProduct() {
    const db = getFirestore(appFirebase);

    const [product, setProducts] = useState({
        productName: "",
        description: "",
        brand: "",
        stockQuantity: 0,
        price: 0,
        imageUrl: "https://example.com/default-image.png", // URL predeterminada
    });

    const establecerEstado = (name, value) => {
        setProducts({ ...product, [name]: value });
    };

    const [image, setImage] = useState(null);

    // Función que permite elegir una imagen de la galería
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Solo para mostrar la imagen seleccionada
        }
    };

    const validarDatos = () => {
        guardarProducto({ ...product, imageUrl: image || "https://example.com/default-image.png" });
        setProducts({
            productName: "",
            description: "",
            brand: "",
            stockQuantity: 0,
            price: 0,
            imageUrl: "https://example.com/default-image.png",
        });
        setImage(null);
        Alert.alert('Producto registrado');
    };

    const guardarProducto = async (product) => {
        try {
            const docRef = await addDoc(collection(db, "colecProductos"), product);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.titulo}>Nuevo Producto</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre del producto:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese el nombre"
                    value={product.productName}
                    onChangeText={(value) => establecerEstado("productName", value)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Descripción del producto:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese la descripción"
                    value={product.description}
                    onChangeText={(value) => establecerEstado("description", value)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Marca:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese la marca"
                    value={product.brand}
                    onChangeText={(value) => establecerEstado("brand", value)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Precio:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese el precio"
                    value={product.price}
                    onChangeText={(value) => establecerEstado("price", value)}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Cantidad en stock:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese la cantidad"
                    value={product.stockQuantity}
                    onChangeText={(value) => establecerEstado("stockQuantity", value)}
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Seleccionar Imagen</Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image }} style={styles.image} />}

            <TouchableOpacity style={styles.submitButton} onPress={validarDatos}>
                <Text style={styles.submitButtonText}>Registrar Producto</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    TextInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        width: '100%',
    },
    image: {
        width: 150,
        height: 150,
        marginVertical: 10,
        alignSelf: 'center',
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#008CBA',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
