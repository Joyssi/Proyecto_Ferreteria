import { View, Text, StyleSheet, Image, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { collection, addDoc, getFirestore } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { appFirebase } from '../../DataBase/firebaseConfig.js';
import RNPickerSelect from 'react-native-picker-select';  // Importamos el picker

export default function FormProductProduct() {
    const db = getFirestore(appFirebase);

    const [product, setProducts] = useState({
        productName: "",
        description: "",
        brand: "",
        stockQuantity: 0,
        price: 0,
        imageUrl: "",
        category: "", // Añadimos el campo category
    });

    const [image, setImage] = useState(null);

    const establecerEstado = (name, value) => {
        setProducts({ ...product, [name]: value });
    };

    // Función que permite elegir una imagen de la galería
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Guardar la URI de la imagen seleccionada
        }
    };

    const validarDatos = () => {
        if (!image) {
            Alert.alert('Error', 'Por favor selecciona una imagen.');
            return;
        }

        if (!product.category) {
            Alert.alert('Error', 'Por favor selecciona una categoría.');
            return;
        }

        guardarProducto({ ...product, imageUrl: image }); // Guardar la URI local en Firestore
        setProducts({
            productName: "",
            description: "",
            brand: "",
            stockQuantity: 0,
            price: 0,
            imageUrl: "",
            category: "",
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

    // Lista de categorías para el picker
    const categories = [
        { label: 'Herramientas Eléctricas', value: 'herramientas-electricas' },
        { label: 'Pinturas y Accesorios', value: 'pinturas-y-accesorios' },
        { label: 'Plomería', value: 'plomeria' },
        { label: 'Jardinería', value: 'jardineria' },
        { label: 'Seguridad', value: 'seguridad' },
        { label: 'Construcción', value: 'construccion' },
        { label: 'Accesorios de Automóvil', value: 'accesorios-de-automovil' },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>

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
                    value={product.price.toString()}
                    onChangeText={(value) => establecerEstado("price", value)}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Cantidad en stock:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese la cantidad"
                    value={product.stockQuantity.toString()}
                    onChangeText={(value) => establecerEstado("stockQuantity", value)}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Categoría:</Text>
                <RNPickerSelect
                    onValueChange={(value) => establecerEstado("category", value)}
                    items={categories}
                    value={product.category}
                    style={{
                        inputAndroid: styles.TextInput,
                    }}
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
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#009dff',
        alignContent: 'center',
        fontWeight: 'bold',
    },
    TextInput: {
        borderColor: '#1357a6',
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
        backgroundColor: '#104a8e',
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
