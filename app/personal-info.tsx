import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { PersonalInfo } from "../types/cv.types";

export default function PersonalInfoScreen() {
    const router = useRouter();
    const { cvData, updatePersonalInfo } = useCVContext();

    const [formData, setFormData] = useState<PersonalInfo>(cvData.personalInfo);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setFormData(cvData.personalInfo);
    }, [cvData.personalInfo]);

    const validateField = (field: string, value: string) => {
        let error = "";
        if (field === "fullName" && !value) error = "El nombre es obligatorio";
        if (field === "email" && value && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
            error = "Email inválido";
        if (field === "phone" && value && !/^\d{10}$/.test(value))
            error = "El teléfono debe tener 10 dígitos numéricos";
        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handleSave = () => {
        let newErrors: { [key: string]: string } = {};
        if (!formData.fullName) newErrors.fullName = "El nombre es obligatorio";
        if (!formData.email) newErrors.email = "El email es obligatorio";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
            newErrors.email = "Email inválido";
        if (formData.phone && !/^\d{10}$/.test(formData.phone))
            newErrors.phone = "El teléfono debe tener 10 dígitos numéricos";
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        updatePersonalInfo(formData);
        Alert.alert(
            "Confirmación",
            "¿Desea guardar la información?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Guardar",
                    onPress: () => {
                        Alert.alert("Éxito", "Información guardada correctamente", [
                            { text: "OK", onPress: () => router.back() },
                        ]);
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <InputField
                    label="Nombre Completo *"
                    placeholder="Juan Pérez"
                    value={formData.fullName}
                    onChangeText={(text) => {
                        setFormData({ ...formData, fullName: text });
                        validateField("fullName", text);
                    }}
                    error={errors.fullName}
                />

                <InputField
                    label="Email *"
                    placeholder="juan@email.com"
                    value={formData.email}
                    onChangeText={(text) => {
                        setFormData({ ...formData, email: text });
                        validateField("email", text);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email}
                />

                <InputField
                    label="Teléfono"
                    placeholder="0999999999"
                    value={formData.phone}
                    onChangeText={(text) => {
                        setFormData({ ...formData, phone: text });
                        validateField("phone", text);
                    }}
                    keyboardType="phone-pad"
                    error={errors.phone}
                />

                <InputField
                    label="Ubicación"
                    placeholder="Quito, Ecuador"
                    value={formData.location}
                    onChangeText={(text) => setFormData({ ...formData, location: text })}
                />

                <InputField
                    label="Resumen Profesional"
                    placeholder="Describe brevemente tu perfil profesional..."
                    value={formData.summary}
                    onChangeText={(text) => setFormData({ ...formData, summary: text })}
                    multiline
                    numberOfLines={4}
                    style={{ height: 100, textAlignVertical: "top" }}
                />

                <NavigationButton title="Guardar Información" onPress={handleSave} />

                <NavigationButton
                    title="Cancelar"
                    onPress={() => router.back()}
                    variant="secondary"
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#eaf6fb", // Cambia el color de fondo aquí
	},
    
    content: {
        padding: 20,
    },
});