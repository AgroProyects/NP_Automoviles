'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Vehicle, VehicleImage } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  MARCAS_POPULARES,
  COMBUSTIBLE_OPTIONS,
  TRANSMISION_OPTIONS,
} from '@/lib/types';
import { getVehicleSlug } from '@/lib/utils';
import { Save, X, Star, ImagePlus, ArrowLeft, ExternalLink, DollarSign } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ToastContainer } from '@/components/ui/toast';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface VehicleFormProps {
  vehicle?: Vehicle;
}

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<VehicleImage[]>(
    vehicle?.images || []
  );
  const [showMarcaSuggestions, setShowMarcaSuggestions] = useState(false);
  const [marcaInput, setMarcaInput] = useState(vehicle?.marca || '');
  const [errors, setErrors] = useState<{
    anio?: string;
    precio?: string;
    kilometraje?: string;
  }>({});
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; imageId: string | null }>({
    isOpen: false,
    imageId: null,
  });

  const [formData, setFormData] = useState({
    marca: vehicle?.marca || '',
    modelo: vehicle?.modelo || '',
    anio: vehicle?.anio || new Date().getFullYear(),
    precio: vehicle?.precio || '',
    kilometraje: vehicle?.kilometraje || '',
    combustible: vehicle?.combustible || '',
    transmision: vehicle?.transmision || '',
    descripcion: vehicle?.descripcion || '',
    color: vehicle?.color || '',
    destacado: vehicle?.destacado || false,
  });

  const filteredMarcas = MARCAS_POPULARES.filter((marca) =>
    marca.toLowerCase().includes(marcaInput.toLowerCase())
  );

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? value === '' ? '' : value
          : type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate numeric fields
    const newErrors: { anio?: string; precio?: string; kilometraje?: string } = {};

    // Validate año
    if (!formData.anio) {
      newErrors.anio = 'El año es requerido';
    } else {
      const anioNum = Number(formData.anio);
      if (isNaN(anioNum) || anioNum < 1900 || anioNum > 2100) {
        newErrors.anio = 'Ingrese un año válido entre 1900 y 2100';
      }
    }

    // Validate precio
    if (!formData.precio || formData.precio === '') {
      newErrors.precio = 'El precio es requerido';
    } else {
      const precioNum = Number(formData.precio);
      if (isNaN(precioNum) || precioNum < 0) {
        newErrors.precio = 'Ingrese un precio válido mayor a 0';
      }
    }

    // Validate kilometraje
    if (!formData.kilometraje || formData.kilometraje === '') {
      newErrors.kilometraje = 'El kilometraje es requerido';
    } else {
      const kmNum = Number(formData.kilometraje);
      if (isNaN(kmNum) || kmNum < 0) {
        newErrors.kilometraje = 'Ingrese un kilometraje válido mayor o igual a 0';
      }
    }

    // If there are errors, set them and don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const url = vehicle
        ? `/api/vehicles/${vehicle.id}`
        : '/api/vehicles';
      const method = vehicle ? 'PUT' : 'POST';

      // Convert numeric strings to numbers before sending
      const dataToSend = {
        ...formData,
        anio: Number(formData.anio),
        precio: Number(formData.precio),
        kilometraje: Number(formData.kilometraje),
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Vehículo guardado correctamente', 'success');
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 1000);
      } else {
        showToast('Error al guardar el vehículo', 'error');
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      showToast('Error al guardar el vehículo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !vehicle?.id) {
      if (!vehicle?.id) {
        showToast('Primero debes guardar el vehículo antes de subir imágenes', 'error');
      }
      return;
    }

    setUploading(true);
    let uploadedCount = 0;
    let errorCount = 0;

    try {
      // Determinar si es la primera imagen que se sube
      const isFirstUpload = images.length === 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('vehicleId', vehicle.id);
        // Solo la primera imagen de la primera subida será principal
        formData.append('isPrimary', (isFirstUpload && i === 0) ? 'true' : 'false');
        formData.append('displayOrder', (images.length + i).toString());

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setImages((prev) => [...prev, data.data]);
          uploadedCount++;
        } else {
          showToast(`Error al subir imagen: ${data.error || 'Error desconocido'}`, 'error');
          errorCount++;
        }
      }

      if (uploadedCount > 0) {
        showToast(
          `${uploadedCount} ${uploadedCount === 1 ? 'imagen subida' : 'imágenes subidas'} correctamente`,
          'success'
        );
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      showToast('Error al subir imágenes', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/upload?imageId=${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        showToast('Imagen eliminada correctamente', 'success');
      } else {
        showToast('Error al eliminar imagen', 'error');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      showToast('Error al eliminar imagen', 'error');
    }
  };

  const openDeleteModal = (imageId: string) => {
    setDeleteModal({ isOpen: true, imageId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, imageId: null });
  };

  const confirmDelete = () => {
    if (deleteModal.imageId) {
      handleDeleteImage(deleteModal.imageId);
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/upload`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, isPrimary: true }),
      });

      if (response.ok) {
        setImages((prev) =>
          prev.map((img) => ({
            ...img,
            is_primary: img.id === imageId,
          }))
        );
      }
    } catch (error) {
      console.error('Error setting primary image:', error);
    }
  };

  const vehicleSlug = vehicle ? getVehicleSlug(vehicle) : '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin')}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Panel
            </Button>

            {vehicle && (
              <Link
                href={`/vehiculos/${vehicleSlug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-dark px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-md hover:shadow-lg"
              >
                <ExternalLink className="h-4 w-4" />
                Ver en sitio público
              </Link>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900">
            {vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
          </h1>
          <p className="text-gray-600 mt-2">
            {vehicle
              ? 'Actualiza la información del vehículo'
              : 'Completa el formulario para agregar un nuevo vehículo'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del Vehículo */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#044bab] to-[#3495ca] text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold">
                Información del Vehículo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-8 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                {/* Marca - Autocomplete */}
                <div className="relative">
                  <Label htmlFor="marca" className="text-gray-900 font-bold text-sm mb-2 block">
                    Marca *
                  </Label>
                  <Input
                    id="marca"
                    name="marca"
                    value={marcaInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setMarcaInput(value);
                      setFormData((prev) => ({ ...prev, marca: value }));
                      setShowMarcaSuggestions(true);
                    }}
                    onFocus={() => setShowMarcaSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowMarcaSuggestions(false), 200)}
                    className="h-11 border-gray-300 text-gray-900 font-medium"
                    placeholder="Escribir o seleccionar marca"
                    required
                    autoComplete="off"
                  />
                  {showMarcaSuggestions && marcaInput && filteredMarcas.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredMarcas.map((marca) => (
                        <button
                          key={marca}
                          type="button"
                          onClick={() => {
                            setMarcaInput(marca);
                            setFormData((prev) => ({ ...prev, marca }));
                            setShowMarcaSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-primary/10 text-gray-900 font-medium transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {marca}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Puedes escribir cualquier marca o seleccionar de la lista
                  </p>
                </div>

                {/* Modelo */}
                <div>
                  <Label htmlFor="modelo" className="text-gray-900 font-bold text-sm mb-2 block">
                    Modelo *
                  </Label>
                  <Input
                    id="modelo"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    className="h-11 border-gray-300 text-gray-900 font-medium"
                    placeholder="Ej: Corolla, Focus, Civic"
                    required
                  />
                </div>

                {/* Año */}
                <div>
                  <Label htmlFor="anio" className="text-gray-900 font-bold text-sm mb-2 block">
                    Año *
                  </Label>
                  <Input
                    id="anio"
                    name="anio"
                    type="number"
                    min="1900"
                    max="2100"
                    value={formData.anio}
                    onChange={handleChange}
                    className={`h-11 text-gray-900 font-medium ${
                      errors.anio ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.anio && (
                    <p className="mt-1 text-sm text-red-600 font-medium">
                      {errors.anio}
                    </p>
                  )}
                </div>

                {/* Precio en USD */}
                <div>
                  <Label htmlFor="precio" className="text-gray-900 font-bold text-sm mb-2 block">
                    Precio (USD) *
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <Input
                      id="precio"
                      name="precio"
                      type="number"
                      min="0"
                      step="100"
                      value={formData.precio}
                      onChange={handleChange}
                      className={`h-11 text-gray-900 font-medium pl-10 ${
                        errors.precio ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: 15000"
                      required
                    />
                  </div>
                  {errors.precio ? (
                    <p className="mt-1 text-sm text-red-600 font-medium">
                      {errors.precio}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      Precio en dólares estadounidenses (USD)
                    </p>
                  )}
                </div>

                {/* Kilometraje */}
                <div>
                  <Label htmlFor="kilometraje" className="text-gray-900 font-bold text-sm mb-2 block">
                    Kilometraje (km) *
                  </Label>
                  <Input
                    id="kilometraje"
                    name="kilometraje"
                    type="number"
                    min="0"
                    value={formData.kilometraje}
                    onChange={handleChange}
                    className={`h-11 text-gray-900 font-medium ${
                      errors.kilometraje ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: 50000"
                    required
                  />
                  {errors.kilometraje && (
                    <p className="mt-1 text-sm text-red-600 font-medium">
                      {errors.kilometraje}
                    </p>
                  )}
                </div>

                {/* Color */}
                <div>
                  <Label htmlFor="color" className="text-gray-900 font-bold text-sm mb-2 block">
                    Color
                  </Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="h-11 border-gray-300 text-gray-900 font-medium"
                    placeholder="Ej: Blanco, Negro, Rojo"
                  />
                </div>

                {/* Combustible */}
                <div>
                  <Label htmlFor="combustible" className="text-gray-900 font-bold text-sm mb-2 block">
                    Combustible *
                  </Label>
                  <Select
                    id="combustible"
                    name="combustible"
                    value={formData.combustible}
                    onChange={handleChange}
                    className="h-11 border-gray-300 text-gray-900 font-medium"
                    required
                  >
                    <option value="">Seleccionar combustible</option>
                    {COMBUSTIBLE_OPTIONS.map((combustible) => (
                      <option key={combustible} value={combustible}>
                        {combustible}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Transmisión */}
                <div>
                  <Label htmlFor="transmision" className="text-gray-900 font-bold text-sm mb-2 block">
                    Transmisión *
                  </Label>
                  <Select
                    id="transmision"
                    name="transmision"
                    value={formData.transmision}
                    onChange={handleChange}
                    className="h-11 border-gray-300 text-gray-900 font-medium"
                    required
                  >
                    <option value="">Seleccionar transmisión</option>
                    {TRANSMISION_OPTIONS.map((transmision) => (
                      <option key={transmision} value={transmision}>
                        {transmision}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <Label htmlFor="descripcion" className="text-gray-900 font-bold text-sm mb-2 block">
                  Descripción
                </Label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={4}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#044bab] focus-visible:ring-offset-2"
                  placeholder="Descripción detallada del vehículo, características especiales, estado, etc."
                />
              </div>

              {/* Destacado */}
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <input
                  type="checkbox"
                  id="destacado"
                  name="destacado"
                  checked={formData.destacado}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-300 text-[#044bab] focus:ring-[#044bab] cursor-pointer"
                />
                <Label htmlFor="destacado" className="cursor-pointer font-bold text-gray-900">
                  ⭐ Marcar como destacado (aparecerá en la página principal)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Gestión de Imágenes */}
          {vehicle && (
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#44a0dc] to-[#6eb4d3] text-white rounded-t-lg">
                <CardTitle className="text-xl font-bold flex items-center">
                  <ImagePlus className="mr-2 h-6 w-6" />
                  Imágenes del Vehículo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-8">
                <div className="space-y-6">
                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                    <Label htmlFor="images" className="text-gray-900 font-bold text-sm mb-3 block">
                      Subir Imágenes
                    </Label>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#044bab] file:text-white hover:file:bg-[#0e417e]"
                    />
                    {uploading && (
                      <div className="mt-4 flex items-center text-[#044bab]">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-[#044bab] border-t-transparent rounded-full"></div>
                        <p className="text-sm font-semibold">Subiendo imágenes...</p>
                      </div>
                    )}
                    <p className="mt-3 text-sm text-gray-600">
                      Formatos aceptados: JPG, PNG, WEBP. Tamaño máximo: 5MB por imagen.
                    </p>
                  </div>

                  {/* Images Grid */}
                  {images.length > 0 ? (
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-4">
                        {images.length} imagen{images.length !== 1 ? 'es' : ''} cargada{images.length !== 1 ? 's' : ''}
                      </p>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {images.map((image) => (
                          <div
                            key={image.id}
                            className="group relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 hover:border-[#044bab] transition-all"
                          >
                            <Image
                              src={image.url}
                              alt="Vehicle image"
                              fill
                              className="object-cover"
                            />

                            {/* Primary Badge */}
                            {image.is_primary && (
                              <div className="absolute left-2 top-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full px-2 py-1 shadow-lg">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-white text-white" />
                                  <span className="text-xs font-bold text-white">Principal</span>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              {!image.is_primary && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(image.id)}
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 shadow-lg transition-all"
                                  title="Marcar como principal"
                                >
                                  <Star className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => openDeleteModal(image.id)}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-all"
                                title="Eliminar imagen"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ImagePlus className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="font-semibold">No hay imágenes cargadas</p>
                      <p className="text-sm">Sube imágenes del vehículo para mostrarlo en el catálogo</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info message for new vehicles */}
          {!vehicle && (
            <Card className="shadow-lg border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <ImagePlus className="h-6 w-6 text-[#044bab] mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Nota sobre las imágenes
                    </h3>
                    <p className="text-sm text-gray-700">
                      Primero debes <strong>guardar el vehículo</strong>, luego podrás editarlo para agregar las imágenes. Esto es necesario para asociar correctamente las fotos al vehículo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-gradient-to-r from-[#044bab] to-[#3495ca] hover:from-[#0e417e] hover:to-[#044bab] text-white font-bold text-base shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {vehicle ? 'Actualizar Vehículo' : 'Guardar Vehículo'}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin')}
              className="h-12 px-8 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Eliminar Imagen"
        message="¿Estás seguro de que quieres eliminar esta imagen? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
