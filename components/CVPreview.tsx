// components/CVPreview.tsx

import React, { useCallback } from "react";
import { Image, ScrollView, StyleSheet, Text, View, Button } from "react-native";
import { CVData } from "../types/cv.types";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generateCVHtml } from '../types/cvHTMLGenerator'; 

interface CVPreviewProps {
    cvData: CVData;
}

export const CVPreview = ({ cvData }: CVPreviewProps) => {
    const { personalInfo, experiences, education, skills } = cvData;

    // Función que genera el PDF y lo comparte
    const printToFile = useCallback(async () => {
        try {
            // 1. Generar el HTML usando la función separada
            const htmlContent = generateCVHtml(cvData);

            // 2. Generar el PDF
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
            });

            console.log('PDF guardado temporalmente en:', uri);

            // 3. Compartir/Abrir el PDF
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Compartir Currículum Vitae',
                });
            } else {
                alert('La función de compartir no está disponible en este dispositivo.');
            }
        } catch (error) {
            console.error('Error al generar o compartir el PDF:', error);
            alert('Ocurrió un error al generar el PDF. Revisa la consola para más detalles.');
        }
    }, [cvData]);


    return (
        <View style={{ flex: 1 }}>
            {/* Botón de Impresión/Compartir (Colocado fijo) */}
            <View style={styles.buttonContainer}>
                <Button
                    title="Convertir y Compartir PDF"
                    onPress={printToFile}
                    color="#27ae60"
                />
            </View>

            {/* Previsualización normal de React Native (tu código original) */}
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    {/* Header con foto */}
                    <View style={styles.header}>
                        {personalInfo.profileImage && (
                            <Image
                                source={{ uri: personalInfo.profileImage }}
                                style={styles.profileImage}
                            />
                        )}
                        <View style={styles.headerText}>
                            <Text style={styles.name}>{personalInfo.fullName || "Nombre"}</Text>
                            {personalInfo.email && (
                                <Text style={styles.contact}>📧 {personalInfo.email}</Text>
                            )}
                            {personalInfo.phone && (
                                <Text style={styles.contact}>📱 {personalInfo.phone}</Text>
                            )}
                            {personalInfo.location && (
                                <Text style={styles.contact}>📍 {personalInfo.location}</Text>
                            )}
                        </View>
                    </View>

                    {/* Resumen */}
                    {personalInfo.summary && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Resumen Profesional</Text>
                            <Text style={styles.text}>{personalInfo.summary}</Text>
                        </View>
                    )}

                    {/* Experiencia */}
                    {experiences.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Experiencia Laboral</Text>
                            {experiences.map((exp) => (
                                <View key={exp.id} style={styles.item}>
                                    <Text style={styles.itemTitle}>{exp.position}</Text>
                                    <Text style={styles.itemSubtitle}>{exp.company}</Text>
                                    <Text style={styles.itemDate}>
                                        {exp.startDate} - {exp.endDate || "Actual"}
                                    </Text>
                                    {exp.description && (
                                        <Text style={styles.itemDescription}>{exp.description}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Educación */}
                    {education.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Educación</Text>
                            {education.map((edu) => (
                                <View key={edu.id} style={styles.item}>
                                    <Text style={styles.itemTitle}>{edu.degree}</Text>
                                    {edu.field && (
                                        <Text style={styles.itemSubtitle}>{edu.field}</Text>
                                    )}
                                    <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                                    <Text style={styles.itemDate}>{edu.graduationYear}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Habilidad */}
                    {skills.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Habilidades Técnicas</Text>
                            <View style={styles.skillsContainer}>
                                {skills.map((skill) => (
                                    <View key={skill.id} style={styles.skillItem}>
                                        <Text style={styles.skillName}>{skill.name}</Text>
                                        <Text style={styles.skillLevel}>({skill.level})</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        padding: 20,
        paddingBottom: 80, // Espacio para el botón fijo
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 10,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        marginBottom: 24,
        alignItems: "center",
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 16,
        borderWidth: 3,
        borderColor: "#3498db",
    },
    headerText: {
        flex: 1,
    },
    name: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 8,
    },
    contact: {
        fontSize: 14,
        color: "#7f8c8d",
        marginBottom: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#3498db",
        marginBottom: 12,
        borderBottomWidth: 2,
        borderBottomColor: "#3498db",
        paddingBottom: 4,
    },
    text: {
        fontSize: 14,
        color: "#2c3e50",
        lineHeight: 20,
    },
    item: {
        marginBottom: 16,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: 4,
    },
    itemSubtitle: {
        fontSize: 14,
        color: "#7f8c8d",
        marginBottom: 2,
    },
    itemDate: {
        fontSize: 12,
        color: "#95a5a6",
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 14,
        color: "#2c3e50",
        lineHeight: 20,
        marginTop: 4,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skillItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 8,
        marginBottom: 8,
    },
    skillName: {
        fontSize: 14,
        fontWeight: '400',
        color: '#181c20ff',
    },
    skillLevel: {
        fontSize: 12,
        color: '#3498db',
        marginLeft: 5,
        fontWeight: 'normal',
    }
});