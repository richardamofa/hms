import { useEffect, useState } from 'react'
import { patientApi } from '@/api/patients'
import DataTable from '@/components/DataTable'
import Modal from '@/components/Modal'
import FormInput from '@/components/FormInput'
import LoadingSpinner from '@/components/LoadingSpinner'
import type { Patient } from '@/types'
import './Patients.css'

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    phone: '',
  })

  const loadPatients = async () => {
    setIsLoading(true)
    try {
      const data = await patientApi.getAll()
      setPatients(data)
    } catch (err) {
      console.error('Failed to load patients:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({ name: '', age: '', gender: '', phone: '' })
    setEditingPatient(null)
  }

  const openAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient)
    setFormData({
      name: patient.name,
      age: String(patient.age),
      gender: patient.gender,
      phone: patient.phone,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender as 'male' | 'female' | 'other',
      phone: formData.phone,
    }

    try {
      if (editingPatient) {
        await patientApi.update(editingPatient.id, payload)
      } else {
        await patientApi.create(payload)
      }
      setIsModalOpen(false)
      resetForm()
      loadPatients()
    } catch (err) {
      console.error('Failed to save patient:', err)
      alert(err instanceof Error ? err.message : 'Failed to save patient')
    }
  }

  const handleDelete = async (patient: Patient) => {
    if (!confirm(`Are you sure you want to delete ${patient.name}?`)) return

    try {
      await patientApi.delete(patient.id)
      loadPatients()
    } catch (err) {
      console.error('Failed to delete patient:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete patient')
    }
  }

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'age', header: 'Age' },
    { key: 'gender', header: 'Gender', render: (p: Patient) => (
      <span className={`badge gender-${p.gender}`}>{p.gender}</span>
    )},
    { key: 'phone', header: 'Phone' },
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="patients-page">
      <div className="page-header">
        <div>
          <h1>Patients</h1>
          <p>Manage patient records</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + Add Patient
        </button>
      </div>

      <DataTable
        columns={columns}
        data={patients}
        onEdit={openEditModal}
        onDelete={handleDelete}
        emptyMessage="No patients found. Add your first patient!"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPatient ? 'Edit Patient' : 'Add Patient'}
      >
        <form onSubmit={handleSubmit} className="modal-form">
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Patient full name"
          />
          <FormInput
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
            placeholder="Patient age"
          />
          <FormInput
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
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
              {editingPatient ? 'Update' : 'Add'} Patient
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Patients
