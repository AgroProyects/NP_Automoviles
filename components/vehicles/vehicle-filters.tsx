'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  COMBUSTIBLE_OPTIONS,
  TRANSMISION_OPTIONS,
} from '@/lib/types';
import { Search, RotateCcw, Filter, X } from 'lucide-react';

interface VehicleFiltersProps {
  availableBrands: string[];
}

export function VehicleFilters({ availableBrands }: VehicleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    marca: searchParams.get('marca') || '',
    combustible: searchParams.get('combustible') || '',
    transmision: searchParams.get('transmision') || '',
    anioMin: searchParams.get('anioMin') || '',
    anioMax: searchParams.get('anioMax') || '',
    precioMin: searchParams.get('precioMin') || '',
    precioMax: searchParams.get('precioMax') || '',
  });

  const handleFilterChange = (
    key: string,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`/vehiculos?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      marca: '',
      combustible: '',
      transmision: '',
      anioMin: '',
      anioMax: '',
      precioMin: '',
      precioMax: '',
    });

    startTransition(() => {
      router.push('/vehiculos');
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#044bab] hover:bg-[#033d8f] text-white font-semibold h-12 text-base shadow-md"
        >
          <Filter className="mr-2 h-5 w-5" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-white text-[#044bab] rounded-full px-2 py-0.5 text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      <div
        className={`
          rounded-lg border-2 border-[#044bab] bg-white shadow-lg
          ${isOpen ? 'block' : 'hidden'} lg:block
        `}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#044bab] to-[#3495ca]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block p-6 pb-4 bg-gradient-to-r from-[#044bab] to-[#3495ca]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </h2>
        </div>

        <div className="p-6 space-y-4">
        <div>
          <Label htmlFor="search">Buscar</Label>
          <Input
            id="search"
            type="text"
            placeholder="Buscar por marca o modelo..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="marca">Marca</Label>
          <Select
            id="marca"
            value={filters.marca}
            onChange={(e) => handleFilterChange('marca', e.target.value)}
          >
            <option value="">Todas las marcas</option>
            {availableBrands.map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="combustible">Combustible</Label>
          <Select
            id="combustible"
            value={filters.combustible}
            onChange={(e) => handleFilterChange('combustible', e.target.value)}
          >
            <option value="">Todos</option>
            {COMBUSTIBLE_OPTIONS.map((combustible) => (
              <option key={combustible} value={combustible}>
                {combustible}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="transmision">Transmisión</Label>
          <Select
            id="transmision"
            value={filters.transmision}
            onChange={(e) => handleFilterChange('transmision', e.target.value)}
          >
            <option value="">Todas</option>
            {TRANSMISION_OPTIONS.map((transmision) => (
              <option key={transmision} value={transmision}>
                {transmision}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Año</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Desde"
              value={filters.anioMin}
              onChange={(e) => handleFilterChange('anioMin', e.target.value)}
              min="1900"
              max="2100"
            />
            <Input
              type="number"
              placeholder="Hasta"
              value={filters.anioMax}
              onChange={(e) => handleFilterChange('anioMax', e.target.value)}
              min="1900"
              max="2100"
            />
          </div>
        </div>

        <div>
          <Label>Precio</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Mínimo"
              value={filters.precioMin}
              onChange={(e) => handleFilterChange('precioMin', e.target.value)}
              min="0"
            />
            <Input
              type="number"
              placeholder="Máximo"
              value={filters.precioMax}
              onChange={(e) => handleFilterChange('precioMax', e.target.value)}
              min="0"
            />
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <Button
            onClick={() => {
              applyFilters();
              setIsOpen(false);
            }}
            className="w-full bg-[#044bab] hover:bg-[#033d8f] text-white font-semibold h-11"
            disabled={isPending}
          >
            <Search className="mr-2 h-4 w-4" />
            {isPending ? 'Buscando...' : 'Aplicar Filtros'}
          </Button>
          <Button
            onClick={resetFilters}
            variant="outline"
            className="w-full border-2 border-gray-300 hover:bg-gray-50 font-semibold h-11"
            disabled={isPending}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpiar Filtros
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}
