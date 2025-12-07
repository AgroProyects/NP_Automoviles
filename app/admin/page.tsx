'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Vehicle } from '@/lib/types';
import { formatPrice, formatKilometers } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, LogOut, Edit, Trash2, Car, TrendingUp, Package, LayoutGrid, List, Search, Filter } from 'lucide-react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { ToastContainer } from '@/components/ui/toast';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMarca, setFilterMarca] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; vehicleId: string | null }>({ isOpen: false, vehicleId: null });
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchVehicles();
    }
  }, [status]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      const data = await response.json();
      if (data.success) {
        setVehicles(data.data);
        setFilteredVehicles(data.data);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect for filtering vehicles
  useEffect(() => {
    let filtered = [...vehicles];

    // Filter by search term (marca, modelo)
    if (searchTerm) {
      filtered = filtered.filter((v) =>
        `${v.marca} ${v.modelo}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by marca
    if (filterMarca) {
      filtered = filtered.filter((v) => v.marca === filterMarca);
    }

    setFilteredVehicles(filtered);
  }, [searchTerm, filterMarca, vehicles]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const openDeleteModal = (vehicleId: string) => {
    setDeleteModal({ isOpen: true, vehicleId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, vehicleId: null });
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVehicles(vehicles.filter((v) => v.id !== id));
        showToast('Vehículo eliminado correctamente', 'success');
      } else {
        showToast('Error al eliminar el vehículo', 'error');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      showToast('Error al eliminar el vehículo', 'error');
    }
  };

  const confirmDelete = () => {
    if (deleteModal.vehicleId) {
      handleDelete(deleteModal.vehicleId);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#044bab] border-r-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const totalVehiculos = vehicles.length;
  const vehiculosDestacados = vehicles.filter((v) => v.destacado).length;
  const uniqueMarcas = Array.from(new Set(vehicles.map((v) => v.marca))).sort();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Panel de Administración
                </h1>
                <p className="text-base md:text-lg text-gray-600">
                  Bienvenido, <span className="font-semibold text-[#044bab]">{session.user?.email}</span>
                </p>
              </div>
              {/* Cerrar Sesión - Desktop */}
              <div className="hidden md:block">
                <Button
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>

            {/* Cerrar Sesión - Mobile */}
            <div className="md:hidden">
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Cerrar Sesión
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-[#044bab] to-[#3495ca] text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">Total Vehículos</p>
                    <p className="text-3xl font-bold mt-1">{totalVehiculos}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Car className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#44a0dc] to-[#6eb4d3] text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">Destacados</p>
                    <p className="text-3xl font-bold mt-1">{vehiculosDestacados}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#5b91b8] to-[#849cc4] text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">Disponibles</p>
                    <p className="text-3xl font-bold mt-1">{totalVehiculos}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Package className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vehicles List */}
        <Card className="shadow-lg">
          <CardHeader className="bg-white border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Gestión de Vehículos
              </CardTitle>

              {/* View Toggle - Desktop */}
              <div className="hidden lg:flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                    viewMode === 'table'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                  Tabla
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                    viewMode === 'cards'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Tarjetas
                </button>
              </div>
            </div>

            {/* Nuevo Vehículo Button - Above Filters */}
            <div className="mt-4 mb-4">
              <Link href="/admin/vehiculos/nuevo" className="block md:inline-block">
                <Button className="w-full md:w-auto bg-[#044bab] hover:bg-[#0e417e] text-white shadow-md">
                  <Plus className="mr-2 h-5 w-5" />
                  Nuevo Vehículo
                </Button>
              </Link>
            </div>

            {/* Filters */}
            {vehicles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar vehículo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 placeholder:text-gray-500 bg-white"
                  />
                </div>

                {/* Filter by Marca */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={filterMarca}
                    onChange={(e) => setFilterMarca(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500">Todas las marcas</option>
                    {uniqueMarcas.map((marca) => (
                      <option key={marca} value={marca} className="text-gray-900">
                        {marca}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {(searchTerm || filterMarca) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterMarca('');
                    }}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6">
            {filteredVehicles.length === 0 && vehicles.length === 0 ? (
              <div className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Car className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay vehículos registrados
                </h3>
                <p className="text-gray-600 mb-6">
                  Comienza agregando tu primer vehículo al inventario
                </p>
                <Link href="/admin/vehiculos/nuevo">
                  <Button className="bg-[#044bab] hover:bg-[#0e417e]">
                    <Plus className="mr-2 h-5 w-5" />
                    Agregar Primer Vehículo
                  </Button>
                </Link>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No se encontraron vehículos
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta con otros filtros de búsqueda
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterMarca('');
                  }}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <>
                {/* Table View - Desktop only */}
                <div className={`${viewMode === 'table' ? 'hidden lg:block' : 'hidden'} overflow-x-auto`}>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="pb-4 text-left font-bold text-gray-900 text-sm uppercase tracking-wider">
                          Vehículo
                        </th>
                        <th className="pb-4 text-left font-bold text-gray-900 text-sm uppercase tracking-wider">
                          Año
                        </th>
                        <th className="pb-4 text-left font-bold text-gray-900 text-sm uppercase tracking-wider">
                          Precio
                        </th>
                        <th className="pb-4 text-left font-bold text-gray-900 text-sm uppercase tracking-wider">
                          Kilometraje
                        </th>
                        <th className="pb-4 text-left font-bold text-gray-900 text-sm uppercase tracking-wider">
                          Destacado
                        </th>
                        <th className="pb-4 text-center font-bold text-gray-900 text-sm uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredVehicles.map((vehicle) => (
                        <tr
                          key={vehicle.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              {(() => {
                                const primaryImage = vehicle.images?.find(img => img.is_primary) || vehicle.images?.[0];
                                return primaryImage?.url && (
                                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image
                                      src={primaryImage.url}
                                      alt={`${vehicle.marca} ${vehicle.modelo}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                );
                              })()}
                              <div>
                                <div className="font-bold text-gray-900 text-base">
                                  {vehicle.marca} {vehicle.modelo}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {vehicle.combustible} • {vehicle.transmision}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="font-semibold text-gray-900">{vehicle.anio}</span>
                          </td>
                          <td className="py-4">
                            <span className="font-bold text-[#044bab] text-base">
                              {formatPrice(vehicle.precio)}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className="text-gray-900 font-medium">
                              {formatKilometers(vehicle.kilometraje)}
                            </span>
                          </td>
                          <td className="py-4">
                            {vehicle.destacado ? (
                              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#044bab] to-[#3495ca] px-3 py-1 text-xs font-bold text-white shadow-sm">
                                ⭐ Destacado
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                No
                              </span>
                            )}
                          </td>
                          <td className="py-4">
                            <div className="flex justify-center gap-2">
                              <Link href={`/admin/vehiculos/${vehicle.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[#044bab] text-[#044bab] hover:bg-[#044bab] hover:text-white"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                              </Link>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteModal(vehicle.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Eliminar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cards View - Mobile & Optional Desktop */}
                <div className={`${viewMode === 'cards' ? 'block' : 'lg:hidden'} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
                  {filteredVehicles.map((vehicle) => {
                    const primaryImage = vehicle.images?.find(img => img.is_primary) || vehicle.images?.[0];
                    return (
                      <Card key={vehicle.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                        {/* Image */}
                        {primaryImage?.url && (
                          <div className="relative h-48 bg-gray-100">
                            <Image
                              src={primaryImage.url}
                              alt={`${vehicle.marca} ${vehicle.modelo}`}
                              fill
                              className="object-cover"
                            />
                            {vehicle.destacado && (
                              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full px-3 py-1.5 shadow-lg">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-bold text-white">⭐ Destacado</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                      <CardContent className="p-5">
                        {/* Title */}
                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                          {vehicle.marca} {vehicle.modelo}
                        </h3>

                        {/* Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Año:</span>
                            <span className="font-semibold text-gray-900">{vehicle.anio}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Precio:</span>
                            <span className="font-bold text-[#044bab]">{formatPrice(vehicle.precio)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Kilometraje:</span>
                            <span className="font-medium text-gray-900">{formatKilometers(vehicle.kilometraje)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Combustible:</span>
                            <span className="font-medium text-gray-900">{vehicle.combustible}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Transmisión:</span>
                            <span className="font-medium text-gray-900">{vehicle.transmision}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                          <Link href={`/admin/vehiculos/${vehicle.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full border-[#044bab] text-[#044bab] hover:bg-[#044bab] hover:text-white"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            onClick={() => openDeleteModal(vehicle.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Eliminar Vehículo"
        message="¿Estás seguro de que quieres eliminar este vehículo? Esta acción eliminará toda la información del vehículo incluyendo sus imágenes y no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
