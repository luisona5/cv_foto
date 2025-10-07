// app/_layout.tsx

import { Stack } from "expo-router";
import { CVProvider } from "../context/CVContext";

export default function RootLayout() {
  return (
    <CVProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1d2c2dff", // Un color oscuro elegante
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Crear CV",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="personal-info"
          options={{ title: "Información Personal" }}
        />
        <Stack.Screen
          name="experience"
          options={{ title: "Experiencia Laboral" }}
        />
        <Stack.Screen
          name="education"
          options={{ title: "Educación" }}
        />
        
        {/* 🚀 NUEVA PANTALLA: SKILLS (Habilidades) 🚀 */}
        <Stack.Screen 
          name="skills" // <-- Si tu archivo es 'app/skills.tsx'
          options={{ 
            title: "Habilidades/Skills" // El título que se mostrará en la barra
          }}
        />
        {/* ------------------------------------------- */}

        <Stack.Screen
          name="preview"
          options={{
            title: "Vista Previa",
            presentation: "modal",
          }}
        />
      </Stack>
    </CVProvider>
  );
}