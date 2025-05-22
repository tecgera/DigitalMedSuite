/**
 * @file pacienteController.js
 * @description Controlador para la gestión de pacientes
 */

import PacienteService from '../services/pacienteService.js';
import PacienteUI from './pacienteUI.js';

const PacienteController = {
  pacientes: [],
  pacienteSeleccionado: null,
  modoEdicion: false,
  filtroActual: 'todos',

  async init() {
    // Inicializar eventos
    this.initEventos();
    // Cargar pacientes iniciales
    await this.cargarPacientes();
  },

  initEventos() {
    // Eventos de filtros
    document.querySelectorAll('.filter-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filtroActual = btn.getAttribute('data-filter');
        this.cargarPacientes();
      });
    });

    // Evento de búsqueda
    const busquedaInput = document.getElementById('buscarPaciente');
    if (busquedaInput) {
      busquedaInput.addEventListener('input', (e) => {
        this.filtrarPacientes(e.target.value);
      });
    }

    // Evento de registro
    const btnRegistrar = document.getElementById('btnRegistrarPaciente');
    if (btnRegistrar) {
      btnRegistrar.addEventListener('click', () => {
        this.modoEdicion = false;
        this.pacienteSeleccionado = null;
        PacienteUI.mostrarFormulario();
      });
    }
  },

  async cargarPacientes() {
    try {
      PacienteUI.mostrarCargando();
      const response = await PacienteService.getAll();
      this.pacientes = response || [];
      
      const filtrados = this.filtroActual === 'todos' 
        ? this.pacientes
        : this.pacientes.filter(p => p.EstatusNombre?.toLowerCase() === this.filtroActual.toLowerCase());
      
      PacienteUI.mostrarPacientes(filtrados, this.seleccionarPaciente.bind(this));
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      PacienteUI.mostrarError(error);
    }
  },

  async seleccionarPaciente(elemento, paciente) {
    this.pacienteSeleccionado = paciente;
    PacienteUI.seleccionarPaciente(elemento, paciente, this.modoEdicion);
    
    // Configurar eventos de acciones
    const btnEditar = document.getElementById('btnEditarPaciente');
    const btnEliminar = document.getElementById('btnEliminarPaciente');
    
    if (btnEditar) {
      btnEditar.addEventListener('click', () => this.editarPaciente(paciente));
    }
    
    if (btnEliminar) {
      btnEliminar.addEventListener('click', () => this.confirmarEliminarPaciente(paciente));
    }
  },

  async editarPaciente(paciente) {
    this.modoEdicion = true;
    this.pacienteSeleccionado = paciente;
    PacienteUI.mostrarFormulario(paciente);
  },

  async confirmarEliminarPaciente(paciente) {
    if (!confirm(`¿Está seguro que desea eliminar al paciente ${paciente.Nombre} ${paciente.Apellido_Paterno}?`)) {
      return;
    }
    
    try {
      await PacienteService.delete(paciente.ID_Paciente);
      PacienteUI.mostrarMensaje('Paciente eliminado correctamente', 'success');
      await this.cargarPacientes();
      PacienteUI.limpiarSeccionDetalle();
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      PacienteUI.mostrarMensaje('Error al eliminar paciente: ' + error.message, 'error');
    }
  },

  filtrarPacientes(query) {
    if (!this.pacientes.length) return;
    
    const filtrados = this.pacientes.filter(p => {
      const nombreCompleto = `${p.Nombre} ${p.Apellido_Paterno} ${p.Apellido_Materno || ''}`.toLowerCase();
      return nombreCompleto.includes(query.toLowerCase()) || 
             (p.CURP && p.CURP.toLowerCase().includes(query.toLowerCase()));
    });
    
    PacienteUI.mostrarPacientes(filtrados, this.seleccionarPaciente.bind(this));
  }
};

export default PacienteController;
