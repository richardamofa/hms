import { useEffect, useState } from 'react'
import { doctorApi } from '@/api/doctors'
import DataTable from '@/components/DataTable'
import Modal from '@/components/Modal'
import FormInput from '@/components/FormInput'
import LoadingSpinner from '@/components/LoadingSpinner'
import type { Doctor } from '@/types'
import './Doctors.css'

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
  })

  const loadDoctors = async () => {
    setIsLoading(true)
    try {
      const data = await doctorApi.getAll()
      setDoctors(data)
    } catch (err) {
      console.error('Failed to load doctors:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({ name: '', specialization: '', phone: '' })
    setEditingDoctor(null)
  }

  const openAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      phone: doctor.phone,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingDoctor) {
        await doctorApi.update(editingDoctor.id, formData)
      } else {
        await doctorApi.create(formData)
      }
      setIsModalOpen(false)
      resetForm()
      loadDoctors()
    } catch (err) {
      console.error('Failed to save doctor:', err)
      alert(err instanceof Error ? err.message : 'Failed to save doctor')
    }
  }

  const handleDelete = async (doctor: Doctor) => {
    if (!confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) return

    try {
      await doctorApi.delete(doctor.id)
      loadDoctors()
    } catch (err) {
      console.error('Failed to delete doctor:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete doctor')
    }
  }

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'specialization', header: 'Specialization' },
    { key: 'phone', header: 'Phone' },
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="doctors-page">
      <div className="page-header">
        <div>
          <h1>Doctors</h1>
          <p>Manage doctor records</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + Add Doctor
        </button>
      </div>

      <DataTable
        columns={columns}
        data={doctors}
        onEdit={openEditModal}
        onDelete={handleDelete}
        emptyMessage="No doctors found. Add your first doctor!"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoctor ? 'Edit Doctor' : 'Add Doctor'}
      >
        <form onSubmit={handleSubmit} className="modal-form">
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Doctor full name"
          />
          <FormInput
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
            placeholder="e.g. Cardiology, Pediatrics"
          />
          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Phone number"
          />
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingDoctor ? 'Update' : 'Add'} Doctor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Doctors
