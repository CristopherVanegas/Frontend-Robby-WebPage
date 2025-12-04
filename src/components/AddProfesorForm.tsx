import { useState } from "react";
import { createProfesor } from "../services/api";

interface Props {
  onClose: () => void;
  refresh: () => void;
}

const AddProfesorForm = ({ onClose, refresh }: Props) => {
  const [formData, setFormData] = useState({
    first_name: "",
    second_name: "",
    surname1: "",
    surname2: "",
    email: "",
    username: "",
    rol_id: "docente",
    password: "123456",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // -----------------------------------
  // VALIDACIÓN POR CAMPO
  // -----------------------------------
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "first_name":
        if (!value.trim()) return "El nombre es obligatorio.";
        break;

      case "surname1":
        if (!value.trim()) return "El primer apellido es obligatorio.";
        break;

      case "email":
        if (!value.includes("@") || !value.includes(".")) {
          return "Ingrese un correo válido.";
        }
        break;

      case "username":
        if (!value.trim()) return "El nombre de usuario es obligatorio.";
        break;
    }
    return "";
  };

  // -----------------------------------
  // VALIDAR FORMULARIO COMPLETO
  // -----------------------------------
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    for (const [key, value] of Object.entries(formData)) {
      const err = validateField(key, value);
      if (err) newErrors[key] = err;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------------
  // HANDLE CHANGE
  // -----------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // validación inmediata
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  // -----------------------------------
  // HANDLE SUBMIT
  // -----------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createProfesor(formData);
      refresh();
      onClose();
    } catch (error: any) {
      console.error("API ERROR:", error);

      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;

        if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) {
          alert("Error: " + detail[0].msg);
        } else {
          alert("Error del servidor: " + detail);
        }
      } else {
        alert("No se pudo conectar al servidor.");
      }
    }
  };

  // -----------------------------------
  // RENDER
  // -----------------------------------
  return (
    <div className="card p-3 mb-3">
      <h4 className="mb-3">Añadir Profesor</h4>

      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="mb-2">
          <input
            name="first_name"
            className={`form-control ${
              errors.first_name ? "is-invalid" : formData.first_name ? "is-valid" : ""
            }`}
            placeholder="Nombre"
            onChange={handleChange}
          />
          {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
        </div>

        {/* Segundo nombre */}
        <div className="mb-2">
          <input
            name="second_name"
            className="form-control"
            placeholder="Segundo Nombre"
            onChange={handleChange}
          />
        </div>

        {/* Primer apellido */}
        <div className="mb-2">
          <input
            name="surname1"
            className={`form-control ${
              errors.surname1 ? "is-invalid" : formData.surname1 ? "is-valid" : ""
            }`}
            placeholder="Primer Apellido"
            onChange={handleChange}
          />
          {errors.surname1 && <div className="invalid-feedback">{errors.surname1}</div>}
        </div>

        {/* Segundo apellido */}
        <div className="mb-2">
          <input
            name="surname2"
            className="form-control"
            placeholder="Segundo Apellido"
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="mb-2">
          <input
            name="email"
            className={`form-control ${
              errors.email ? "is-invalid" : formData.email ? "is-valid" : ""
            }`}
            placeholder="Correo Electrónico"
            onChange={handleChange}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        {/* Username */}
        <div className="mb-2">
          <input
            name="username"
            className={`form-control ${
              errors.username ? "is-invalid" : formData.username ? "is-valid" : ""
            }`}
            placeholder="Usuario"
            onChange={handleChange}
          />
          {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        </div>

        <button className="btn btn-success me-2" type="submit">
          Guardar
        </button>
        <button className="btn btn-secondary" type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default AddProfesorForm;
