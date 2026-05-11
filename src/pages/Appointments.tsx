import { useEffect, useState } from 'react'
import { appointmentApi } from '@/api/appointments'
import { patientApi } from '@/api/patients'
import { doctorApi } from '@/api/doctors'
import DataTable from '@/components/DataTable'
import Modal from '@/components/Modal'
import FormInput from '@/components/FormInput'
import LoadingSpinner from '@/components/LoadingSpinner'
import { formatDate } from '@/utils/helpers'
import type { Appointment, Patient, Doctor } from '@/types'
import './Appointments.css'

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    status: 'pending' as 'pending' | 'completed',
  })

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentApi.getAll(),
        patientApi.getAll(),
        doctorApi.getAll(),
      ])
      setAppointments(appointmentsData)
      setPatients(patientsData)
      setDoctors(doctorsData)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({ patient_id: '', doctor_id: '', appointment_date: '', status: 'pending' })
    setEditingAppointment(null)
  }

  const openAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setFormData({
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      appointment_date: appointment.appointment_date.slice(0, 16),
      status: appointment.status,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      patient_id: formData.patient_id,
      doctor_id: formData.doctor_id,
      appointment_date: formData.appointment_date,
      status: formData.status,
    }

    try {
      if (editingAppointment) {
        await appointmentApi.update(editingAppointment.id, payload)
      } else {
        await appointmentApi.create(payload)
      }
      setIsModalOpen(false)
      resetForm()
      loadData()
    } catch (err) {
      console.error('Failed to save appointment:', err)
      alert(err instanceof Error ? err.message : 'Failed to save appointment')
    }
  }

  const handleDelete = async (appointment: Appointment) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return

    try {
      await appointmentApi.delete(appointment.id)
      loadData()
    } catch (err) {
      console.error('Failed to delete appointment:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete appointment')
    }
  }

  const toggleStatus = async (appointment: Appointment) => {
    const newStatus = appointment.status === 'pending' ? 'completed' : 'pending'
    try {
      await appointmentApi.updateStatus(appointment.id, newStatus)
      loadData()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const columns = [
    {
      key: 'patient',
      header: 'Patient',
      render: (a: Appointment) => a.patient?.name || 'Unknown',
    },
    {
      key: 'doctor',
      header: 'Doctor',
      render: (a: Appointment) => a.doctor?.name || 'Unknown',
    },
    {
      key: 'appointment_date',
      header: 'Date & Time',
      render: (a: Appointment) => formatDate(a.appointment_date),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a: Appointment) => (
        <button
          className={`status-badge status-${a.status}`}
          onClick={() => toggleStatus(a)}
          title="Click to toggle status"
        >
          {a.status}
        </button>
      ),
    },
  ]

  const patientOptions = patients.map((p) => ({ value: p.id, label: p.name }))
  const doctorOptions = doctors.map((d) => ({ value: d.id, label: `${d.name} — ${d.specialization}` }))

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="appointments-page">
      <div className="page-header">
        <div>
          <h1>Appointments</h1>
          <p>Manage appointments</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + New Appointment
        </button>
      </div>

      <DataTable
        columns={columns}
        data={appointments}
        onEdit={openEditModal}
        onDelete={handleDelete}
        emptyMessage="No appointments found. Schedule your first appointment!"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAppointment ? 'Edit Appointment' : 'New Appointment'}
      >
        <form onSubmit={handleSubmit} className="modal-form">
          <FormInput
            label="Patient"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            required
            options={patientOptions}
          />
          <FormInput
            label="Doctor"
            name="doctor_id"
            value={formData.doctor_id}
            onChange={handleChange}
            required
            options={doctorOptions}
          />
          <FormInput
            label="Date & Time"
            name="appointment_date"
            type="datetime-local"
            value={formData.appointment_date}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingAppointment ? 'Update' : 'Schedule'} Appointment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Appointments
