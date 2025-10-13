
import { CVData } from "../types/cv.types";

/**
 * Función que convierte los datos del CV a una cadena HTML con CSS.
 * @param cvData Los datos del CV
 * @returns Cadena HTML
 */
export const generateCVHtml = (cvData: CVData): string => {
    const { personalInfo, experiences, education, skills } = cvData;


    // 1. Imagen de Perfil
    const profileImageHtml = personalInfo.profileImage
        ? `<img src="${personalInfo.profileImage}" class="profileImage" />`
        : '';

    // 2. Experiencia Laboral
    const experiencesHtml = experiences.length > 0 ? `
        <div class="section">
            <h2 class="sectionTitle">Experiencia Laboral</h2>
            ${experiences.map(exp => `
                <div class="item">
                    <h3 class="itemTitle">${exp.position}</h3>
                    <p class="itemSubtitle">${exp.company}</p>
                    <p class="itemDate">${exp.startDate} - ${exp.endDate || "Actual"}</p>
                    ${exp.description ? `<p class="itemDescription">${exp.description}</p>` : ''}
                </div>
            `).join('')}
        </div>
    ` : '';

    // 3. Educación
    const educationHtml = education.length > 0 ? `
        <div class="section">
            <h2 class="sectionTitle">Educación</h2>
            ${education.map(edu => `
                <div class="item">
                    <h3 class="itemTitle">${edu.degree}</h3>
                    ${edu.field ? `<p class="itemSubtitle">${edu.field}</p>` : ''}
                    <p class="itemSubtitle">${edu.institution}</p>
                    <p class="itemDate">${edu.graduationYear}</p>
                </div>
            `).join('')}
        </div>
    ` : '';

    // 4. Habilidades
    const skillsHtml = skills.map(skill => `
        <div class="skillItem">
            <span class="skillName">${skill.name}</span>
            <span class="skillLevel">(${skill.level})</span>
        </div>
    `).join('');

    const skillsSectionHtml = skills.length > 0 ? `
        <div class="section">
            <h2 class="sectionTitle">Habilidades Técnicas</h2>
            <div class="skillsContainer"> 
                ${skillsHtml}
            </div>
        </div>
    ` : '';

    // --- PLANTILLA HTML FINAL CON CSS ---
    return `
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                <title>${personalInfo.fullName || 'Currículum Vitae'}</title>
                <style>
                    body { font-family: 'Arial', sans-serif; padding: 20px; line-height: 1.5; color: #2c3e50; }
                    
                    /* Estilos del Header */
                    .header { display: flex; align-items: center; margin-bottom: 24px; padding-bottom: 10px; border-bottom: 2px solid #ccc; }
                    .profileImage { width: 100px; height: 100px; border-radius: 50%; margin-right: 16px; border: 3px solid #3498db; object-fit: cover; }
                    .headerText { flex: 1; }
                    .name { font-size: 28px; font-weight: bold; color: #2c3e50; margin-bottom: 4px; }
                    .contact { font-size: 14px; color: #7f8c8d; margin-bottom: 2px; }

                    /* Estilos de Sección */
                    .section { margin-bottom: 24px; }
                    .sectionTitle { 
                        font-size: 20px; font-weight: bold; color: #3498db; margin-bottom: 12px; 
                        border-bottom: 2px solid #3498db; padding-bottom: 4px;
                    }
                    .text { font-size: 14px; margin-bottom: 10px; }
                    
                    /* Estilos de Item (Experiencia/Educación) */
                    .item { margin-bottom: 16px; }
                    .itemTitle { font-size: 16px; font-weight: 600; color: #2c3e50; margin-bottom: 4px; }
                    .itemSubtitle { font-size: 14px; color: #7f8c8d; margin-bottom: 2px; }
                    .itemDate { font-size: 12px; color: #95a5a6; margin-bottom: 4px; }
                    .itemDescription { font-size: 14px; margin-top: 4px; }
                    
                    /* Estilos de Habilidades */
                    .skillsContainer { display: flex; flex-wrap: wrap; }
                    .skillItem { 
                        display: inline-block; 
                        background-color: #ecf0f1; 
                        border-radius: 15px; 
                        padding: 5px 10px; 
                        margin-right: 8px; 
                        margin-bottom: 8px;
                    }
                    .skillName { font-size: 14px; font-weight: 400; color: #181c20; }
                    .skillLevel { font-size: 12px; color: #3498db; margin-left: 5px; font-weight: normal; }
                </style>
            </head>
            <body>
                <div class="header">
                    ${profileImageHtml}
                    <div class="headerText">
                        <h1 class="name">${personalInfo.fullName || "Nombre"}</h1>
                        ${personalInfo.email ? `<p class="contact">📧 ${personalInfo.email}</p>` : ''}
                        ${personalInfo.phone ? `<p class="contact">📱 ${personalInfo.phone}</p>` : ''}
                        ${personalInfo.location ? `<p class="contact">📍 ${personalInfo.location}</p>` : ''}
                    </div>
                </div>

                ${personalInfo.summary ? `
                    <div class="section">
                        <h2 class="sectionTitle">Resumen Profesional</h2>
                        <p class="text">${personalInfo.summary}</p>
                    </div>
                ` : ''}

                ${experiencesHtml}

                ${educationHtml}

                ${skillsSectionHtml}
            </body>
        </html>
    `;
};