import { Reporte } from "../models/reporteModel.js";
import PDFDocument from 'pdfkit'; 
export const crearReporte = async (req, res) => {
    try {
        const { plantId, tipo, descripcion, periodo, rutaArchivo } = req.body;
        const generadoPor = req.usuarioId;

        if (!plantId || !rutaArchivo) {
            return res.status(400).json({
                success: false,
                message: "plantId y rutaArchivo son requeridos"
            });
        }

        // ✅ USAR SOLO EL MODELO
        const nuevoReporte = await Reporte.crear({
            plantId,
            generadoPor,
            tipo,
            descripcion,
            periodo,
            rutaArchivo,
            fecha: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Reporte generado correctamente",
            reporte: nuevoReporte
        });
    } catch (error) {
        console.log("Error al crear reporte:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const obtenerReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const reporte = await Reporte.buscarPorId(id);

        if (!reporte) {
            return res.status(404).json({
                success: false,
                message: "Reporte no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            reporte
        });
    } catch (error) {
        console.log("Error al obtener reporte:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const obtenerReportes = async (req, res) => {
    try {
        const { limite = 10, pagina = 1 } = req.query;
        
        console.log('🔍 [REPORTE CONTROLLER] Parámetros query:', { 
            limite, 
            pagina,
            tipoLimite: typeof limite,
            tipoPagina: typeof pagina
        });

        // Convertir a números
        const limitNum = parseInt(limite) || 10;
        const paginaNum = parseInt(pagina) || 1;

        console.log('🔢 [REPORTE CONTROLLER] Parámetros numéricos:', { limitNum, paginaNum });

        const reportes = await Reporte.obtenerTodos(limitNum, paginaNum);

        res.status(200).json({
            success: true,
            reportes,
            paginacion: {
                limite: limitNum,
                pagina: paginaNum
            }
        });
    } catch (error) {
        console.log("Error al obtener reportes:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const obtenerReportesPlanta = async (req, res) => {
    try {
        const { plantId } = req.params;
        const reportes = await Reporte.obtenerPorPlanta(plantId);

        res.status(200).json({
            success: true,
            reportes
        });
    } catch (error) {
        console.log("Error al obtener reportes de planta:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const obtenerReportesUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const reportes = await Reporte.obtenerPorUsuario(usuarioId);

        res.status(200).json({
            success: true,
            reportes
        });
    } catch (error) {
        console.log("Error al obtener reportes del usuario:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const eliminarReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Reporte.eliminar(id);

        if (!eliminado) {
            return res.status(404).json({
                success: false,
                message: "Reporte no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Reporte eliminado correctamente"
        });
    } catch (error) {
        console.log("Error al eliminar reporte:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



export const descargarReporte = async (req, res) => {
    try {
        const { rutaArchivo } = req.params;
        
        console.log('📄 Generando PDF para:', rutaArchivo);
        
        // ✅ CREAR PDF REAL CON PDFKIT
        const doc = new PDFDocument();
        
        // Configurar headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${rutaArchivo}"`);
        
        // Pipe el PDF a la respuesta
        doc.pipe(res);
        
        // Agregar contenido al PDF
        doc.fontSize(20)
           .text('REPORTE DEL SISTEMA', 100, 100)
           .fontSize(12)
           .text(`Archivo: ${rutaArchivo}`, 100, 150)
           .text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 100, 170)
           .text('Sistema de Gestión de Plantas', 100, 190)
           .moveDown(2);
        
        // Agregar más contenido según el tipo de reporte
        doc.fontSize(16)
           .text('Resumen del Reporte', 100, 250)
           .fontSize(12)
           .text('• Este es un reporte generado automáticamente por el sistema.', 100, 280)
           .text('• Contiene información resumida de las operaciones.', 100, 300)
           .text('• Los datos se actualizan periódicamente.', 100, 320)
           .moveDown(2);
        
        // Agregar tabla de ejemplo
        doc.fontSize(14)
           .text('Datos del Sistema:', 100, 380);
        
        const tableTop = 410;
        const itemMargin = 30;
        
        doc.fontSize(10)
           .text('Parámetro', 100, tableTop)
           .text('Valor', 250, tableTop)
           .text('Estado', 350, tableTop)
           .moveTo(100, tableTop + 20)
           .lineTo(450, tableTop + 20)
           .stroke();
        
        // Datos de ejemplo
        const datos = [
            { parametro: 'Plantas activas', valor: '11', estado: 'OK' },
            { parametro: 'Incidencias abiertas', valor: '5', estado: 'Pendiente' },
            { parametro: 'Mantenimientos programados', valor: '2', estado: 'En curso' },
            { parametro: 'Reportes generados', valor: '1', estado: 'Completado' }
        ];
        
        datos.forEach((fila, index) => {
            const y = tableTop + 40 + (index * itemMargin);
            doc.text(fila.parametro, 100, y)
               .text(fila.valor, 250, y)
               .text(fila.estado, 350, y);
        });
        
        // Agregar pie de página
        const pageHeight = doc.page.height;
        doc.fontSize(8)
           .text(`Generado el: ${new Date().toLocaleString('es-ES')}`, 50, pageHeight - 50)
           .text('Sistema de Gestión - Todos los derechos reservados', 50, pageHeight - 30);
        
        // Finalizar el PDF
        doc.end();
        
    } catch (error) {
        console.log("Error al generar PDF:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};