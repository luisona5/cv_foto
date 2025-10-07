import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";

export default function EducationScreen() {
    const router = useRouter();
    const { cvData, addEducation, deleteEducation } = useCVContext();

    const [formData, setFormData] = useState<Omit<Education, "id">>({
        institution: "",
        degree: "",
        field: "",
        graduationYear: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showGradPicker, setShowGradPicker] = useState(false);

    const validateField = (field: string, value: string) => {
        let error = "";
        if (field === "institution" && (!value || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)))
            error = "La institución solo debe contener letras";
        if (field === "degree" && (!value || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)))
            error = "El título solo debe contener letras";
        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handleAdd = () => {
        let newErrors: { [key: string]: string } = {};
        if (!formData.institution) newErrors.institution = "La institución es obligatoria";
        if (!formData.degree) newErrors.degree = "El título es obligatorio";
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const newEducation: Education = {
            id: Date.now().toString(),
            ...formData,
        };

        addEducation(newEducation);

        setFormData({
            institution: "",
            degree: "",
            field: "",
            graduationYear: "",
        });

        setErrors({});
        Alert.alert("Éxito", "Educación agregada correctamente");
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Estás seguro de eliminar esta educación?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => {
                        deleteEducation(id);
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

                <InputField
                    label="Institución *"
                    placeholder="Nombre de la universidad/institución"
                    value={formData.institution}
                    onChangeText={(text) => {
                        setFormData({ ...formData, institution: text });
                        validateField("institution", text);
                    }}
                    error={errors.institution}
                />
                <InputField
                    label="Título/Grado *"
                    placeholder="Ej: Licenciatura, Maestría"
                    value={formData.degree}
                    onChangeText={(text) => {
                        setFormData({ ...formData, degree: text });
                        validateField("degree", text);
                    }}
                    error={errors.degree}
                />

                <InputField
                    label="Área de Estudio"
                    placeholder="Ej: Ingeniería en Sistemas"
                    value={formData.field}
                    onChangeText={(text) => setFormData({ ...formData, field: text })}
                />

                <InputField
                    label="Año de Graduación"
                    placeholder="Selecciona el año"
                    value={formData.graduationYear}
                    editable={false}
                />
                <TouchableOpacity onPress={() => setShowGradPicker(true)} style={{ marginBottom: 8 }}>
                    <Text style={{ color: "#3498db" }}>Seleccionar Año de Graduación</Text>
                </TouchableOpacity>
                {showGradPicker && (
                    <DateTimePicker
                        value={
                            formData.graduationYear
                                ? new Date(formData.graduationYear + "-01-01")
                                : new Date()
                        }
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowGradPicker(false);
                            if (date && date.getFullYear() <= 2025)
                                setFormData({
                                    ...formData,
                                    graduationYear: date.getFullYear().toString(),
                                });
                        }}
                        maximumDate={new Date("2025-12-31")}
                    />
                )}

                <NavigationButton title="Agregar Educación" onPress={handleAdd} />

                {cvData.education.length > 0 && (
                    <>
                        <Text style={styles.listTitle}>Educación Agregada</Text>
                        {cvData.education.map((edu) => (
                            <View key={edu.id} style={styles.card}>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{edu.degree}</Text>
                                    <Text style={styles.cardSubtitle}>{edu.field}</Text>
                                    <Text style={styles.cardInstitution}>{edu.institution}</Text>
                                    <Text style={styles.cardDate}>{edu.graduationYear}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDelete(edu.id)}
                                >
                                    <Text style={styles.deleteButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </>
                )}

                <NavigationButton
                    title="Volver"
                    onPress={() => router.back()}
                    variant="secondary"
                    style={{ marginTop: 16 }}
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2c3e50",
        marginTop: 24,
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#7f8c8d",
        marginBottom: 4,
    },
    cardInstitution: {
        fontSize: 14,
        color: "#95a5a6",
        marginBottom: 2,
    },
    cardDate: {
        fontSize: 12,
        color: "#95a5a6",
    },
    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#e74c3c",
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});