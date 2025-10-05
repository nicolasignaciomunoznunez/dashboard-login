import { api } from './api';

export const datosPlantaService = {
  // Obtener datos de una planta
  obtenerDatosPlanta: async (plantId, limite = 100, pagina = 1) => {
    const response = await api.get(`/datos-planta/planta/${plantId}?limite=${limite}&pagina=${pagina}`);
    return response.data;
  },

  // Obtener datos por rango de fechas
  obtenerDatosRangoFechas: async (plantId, fechaInicio, fechaFin) => {
    const response = await api.get(`/datos-planta/planta/${plantId}/rango?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    return response.data;
  },

  // Obtener últimos datos de todas las plantas
  obtenerUltimosDatos: async () => {
    const response = await api.get('/datos-planta/ultimos');
    return response.data;
  },

  // Crear nuevo dato (para sistemas automáticos)
  crearDato: async (datoData) => {
    const response = await api.post('/datos-planta', datoData);
    return response.data;
  },
};