import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Badge } from '@/Components/ui/Badge';
import { DataTable } from '@/Components/ui/DataTable';
import { Modal } from '@/Components/ui/Modal';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import { StatsCard } from '@/Components/ui/StatsCard';
import { Checkbox } from '@/Components/ui/checkbox';
import type { PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';
import { 
    Building, 
    School, 
    Monitor, 
    Video, 
    Briefcase, 
    BookOpen, 
    Cpu, 
    Users, 
    Calendar,
    Compass,
    CheckCircle2, 
    XCircle, 
    Plus,
    LayoutGrid, 
    List, 
    Trash2, 
    Edit2,
    Check,
    MapPin
} from 'lucide-react';

interface ClassRoom {
    id: number;
    name: string;
    room_number: string | null;
    building_name: string;
    floor_name: string;
    capacity: number;
    room_type: 'classroom' | 'lab' | 'lecture_hall' | 'office' | 'library' | 'computer_lab' | 'meeting_room' | 'masjid';
    features: string[] | null;
    location: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Stats {
    total_rooms: number;
    total_seats: number;
    active_rooms: number;
    labs_count: number;
}

interface Props {
    classrooms: {
        data: ClassRoom[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    buildings: string[];
    filters: {
        search?: string;
        building_name?: string;
        room_type?: string;
        is_active?: string;
    };
    stats: Stats;
}

const ROOM_TYPES = [
    { value: 'classroom', label: 'Classroom', icon: School },
    { value: 'lab', label: 'Lab', icon: Monitor },
    { value: 'lecture_hall', label: 'Lecture Hall', icon: Video },
    { value: 'office', label: 'Office', icon: Briefcase },
    { value: 'library', label: 'Library', icon: BookOpen },
    { value: 'computer_lab', label: 'Computer Lab', icon: Cpu },
    { value: 'meeting_room', label: 'Meeting Room', icon: Users },
    { value: 'masjid', label: 'Prayer Room (Masjid)', icon: Compass },
];

const STANDARD_FEATURES = [
    { value: 'Projector', label: 'Projector' },
    { value: 'Smart Board', label: 'Smart Board / Multimedia' },
    { value: 'AC', label: 'Air Conditioner (AC)' },
    { value: 'Computers', label: 'Computers / Workstations' },
    { value: 'Audio System', label: 'Sound/Audio System' },
    { value: 'Wi-Fi', label: 'Wi-Fi Access' },
    { value: 'Whiteboard', label: 'Whiteboard' },
    { value: 'Prayer Mats', label: 'Prayer Mats' },
];

const FLOORS = [
    'Ground Floor',
    '1st Floor',
    '2nd Floor',
    '3rd Floor',
    '4th Floor',
    '5th Floor',
    'Basement',
];

export default function ClassRoomIndex({ classrooms, buildings, filters, stats }: Props) {
    const { hasPermission } = usePermission();
    
    // View state toggler: 'grid' (building/floor hierarchy) vs 'table' (flat page list)
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    
    // Form and modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<ClassRoom | null>(null);
    const [deletingRoom, setDeletingRoom] = useState<ClassRoom | null>(null);
    
    // Custom floor typing or selection state
    const [customFloorMode, setCustomFloorMode] = useState(false);

    // Filters state
    const [search, setSearch] = useState(filters.search ?? '');
    const [buildingFilter, setBuildingFilter] = useState(filters.building_name ?? '');
    const [typeFilter, setTypeFilter] = useState(filters.room_type ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.is_active ?? '');

    // Form setup using Inertia useForm
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        room_number: '',
        building_name: '',
        floor_name: '',
        capacity: 40,
        room_type: 'classroom',
        features: [] as string[],
        location: '',
        is_active: true,
    });

    const getRoomTypeIcon = (type: string) => {
        const typeObj = ROOM_TYPES.find(t => t.value === type);
        const IconComponent = typeObj ? typeObj.icon : School;
        return <IconComponent className="w-4 h-4" />;
    };

    const getRoomTypeLabel = (type: string) => {
        const typeObj = ROOM_TYPES.find(t => t.value === type);
        return typeObj ? typeObj.label : type;
    };

    const applyFilters = (s: string, b: string, t: string, status: string) => {
        router.get(
            '/admin/classrooms',
            {
                search: s || undefined,
                building_name: b || undefined,
                room_type: t || undefined,
                is_active: status || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, buildingFilter, typeFilter, statusFilter);
    };

    const handleResetFilters = () => {
        setSearch('');
        setBuildingFilter('');
        setTypeFilter('');
        setStatusFilter('');
        router.get('/admin/classrooms');
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/classrooms',
            {
                page,
                search: search || undefined,
                building_name: buildingFilter || undefined,
                room_type: typeFilter || undefined,
                is_active: statusFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const openAddModal = () => {
        reset();
        clearErrors();
        setEditingRoom(null);
        setCustomFloorMode(false);
        setModalOpen(true);
    };

    const openEditModal = (room: ClassRoom) => {
        clearErrors();
        setEditingRoom(room);
        
        const isStandardFloor = FLOORS.includes(room.floor_name);
        setCustomFloorMode(!isStandardFloor);

        setData({
            name: room.name,
            room_number: room.room_number ?? '',
            building_name: room.building_name,
            floor_name: room.floor_name,
            capacity: room.capacity,
            room_type: room.room_type,
            features: room.features ?? [],
            location: room.location ?? '',
            is_active: room.is_active,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRoom) {
            put(`/admin/classrooms/${editingRoom.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/classrooms', {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deletingRoom) return;
        router.delete(`/admin/classrooms/${deletingRoom.id}`, {
            onSuccess: () => setDeletingRoom(null),
        });
    };

    const toggleFeature = (feature: string) => {
        const currentFeatures = [...data.features];
        const index = currentFeatures.indexOf(feature);
        if (index > -1) {
            currentFeatures.splice(index, 1);
        } else {
            currentFeatures.push(feature);
        }
        setData('features', currentFeatures);
    };

    // Columns structure for Table View
    const columns: ColumnDef<ClassRoom>[] = [
        {
            accessorKey: 'room_number',
            header: 'Room #',
            cell: ({ row }) => (
                <span className="font-mono font-semibold text-primary">
                    {row.original.room_number || 'N/A'}
                </span>
            ),
            size: 90,
        },
        {
            accessorKey: 'name',
            header: 'Room Name',
            cell: ({ row }) => (
                <div>
                    <div className="font-semibold text-foreground">{row.original.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {row.original.location || 'No location description'}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'building_name',
            header: 'Building & Floor',
            cell: ({ row }) => (
                <div className="text-sm">
                    <span className="font-semibold text-foreground">{row.original.building_name}</span>
                    <span className="mx-1.5 text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{row.original.floor_name}</span>
                </div>
            ),
        },
        {
            accessorKey: 'room_type',
            header: 'Type',
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded bg-muted text-muted-foreground">
                        {getRoomTypeIcon(row.original.room_type)}
                    </span>
                    <span className="capitalize">{getRoomTypeLabel(row.original.room_type)}</span>
                </div>
            ),
            size: 130,
        },
        {
            accessorKey: 'capacity',
            header: 'Seats',
            cell: ({ row }) => (
                <div className="font-semibold">
                    {row.original.capacity} <span className="text-xs text-muted-foreground font-normal">seats</span>
                </div>
            ),
            size: 100,
        },
        {
            accessorKey: 'features',
            header: 'Features & Multimedia',
            cell: ({ row }) => {
                const featuresList = row.original.features || [];
                if (featuresList.length === 0) return <span className="text-xs text-muted-foreground italic">None</span>;
                return (
                    <div className="flex flex-wrap gap-1 max-w-[300px]">
                        {featuresList.map((f, i) => (
                            <Badge key={i} variant="muted" className="text-[10px] px-1.5 py-0">
                                {f}
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.original.is_active ? 'success' : 'warning'}>
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
            size: 90,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    {hasPermission('edit classes') && (
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0" onClick={() => openEditModal(row.original)}>
                            <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                    )}
                    {hasPermission('delete classes') && (
                        <Button variant="destructive" size="sm" className="h-8 w-8 p-0" onClick={() => setDeletingRoom(row.original)}>
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    )}
                </div>
            ),
            size: 100,
        },
    ];

    const meta: PageMeta = {
        current_page: classrooms.current_page,
        last_page: classrooms.last_page,
        per_page: classrooms.per_page,
        total: classrooms.total,
        from: classrooms.from,
        to: classrooms.to,
    };

    // Grouping helper for Grid view (groups all data records - usually we do it on classrooms.data, but wait, pagination limits classrooms.data to current page! Let's display the current page's rooms beautifully grouped by Building & Floor, representing a dashboard check of this block)
    const groupedClassrooms: Record<string, Record<string, ClassRoom[]>> = {};
    classrooms.data.forEach(room => {
        if (!groupedClassrooms[room.building_name]) {
            groupedClassrooms[room.building_name] = {};
        }
        if (!groupedClassrooms[room.building_name][room.floor_name]) {
            groupedClassrooms[room.building_name][room.floor_name] = [];
        }
        groupedClassrooms[room.building_name][room.floor_name].push(room);
    });

    const toolbar = (
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end w-full">
            <div className="flex-1 min-w-[200px]">
                <Input
                    placeholder="Search by Room Number or Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                />
            </div>
            <div className="w-[180px]">
                <SearchableSelect
                    value={buildingFilter}
                    onChange={(e) => {
                        setBuildingFilter(e.target.value);
                        applyFilters(search, e.target.value, typeFilter, statusFilter);
                    }}
                    options={buildings.map(b => ({ value: b, label: b }))}
                    placeholder="All Buildings"
                />
            </div>
            <div className="w-[180px]">
                <SearchableSelect
                    value={typeFilter}
                    onChange={(e) => {
                        setTypeFilter(e.target.value);
                        applyFilters(search, buildingFilter, e.target.value, statusFilter);
                    }}
                    options={ROOM_TYPES.map(t => ({ value: t.value, label: t.label }))}
                    placeholder="All Types"
                />
            </div>
            <div className="w-[140px]">
                <SearchableSelect
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        applyFilters(search, buildingFilter, typeFilter, e.target.value);
                    }}
                    options={[
                        { value: '1', label: 'Active' },
                        { value: '0', label: 'Inactive' },
                    ]}
                    placeholder="All Status"
                />
            </div>
            <Button type="submit" variant="primary">
                Search
            </Button>
            <Button type="button" variant="secondary" onClick={handleResetFilters}>
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Classrooms & Venues"
            action={
                <div className="flex gap-2 items-center">
                    <div className="flex border rounded-md p-0.5 bg-muted">
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            title="Grid layout by Building/Floor"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-sm transition-all ${viewMode === 'table' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            title="Table layout"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {hasPermission('create classes') && (
                        <Button variant="primary" onClick={openAddModal}>
                            <Plus className="w-4 h-4 mr-1.5" />
                            Add Classroom
                        </Button>
                    )}
                </div>
            }
        >
            <Head title="Classrooms & Venues Management" />

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatsCard
                    label="Total Venues / Rooms"
                    value={stats.total_rooms}
                    icon={<Building className="w-5 h-5" />}
                    iconBg="hsl(215 100% 50% / 0.1)"
                    iconColor="hsl(215 100% 50%)"
                />
                <StatsCard
                    label="Total Capacity Seats"
                    value={`${stats.total_seats} seats`}
                    icon={<Users className="w-5 h-5" />}
                    iconBg="hsl(142 76% 36% / 0.1)"
                    iconColor="hsl(142 76% 36%)"
                />
                <StatsCard
                    label="Active Rooms"
                    value={stats.active_rooms}
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    iconBg="hsl(174 84% 33% / 0.1)"
                    iconColor="hsl(174 84% 33%)"
                />
                <StatsCard
                    label="Labs & Computer Labs"
                    value={stats.labs_count}
                    icon={<Cpu className="w-5 h-5" />}
                    iconBg="hsl(271 91% 65% / 0.1)"
                    iconColor="hsl(271 91% 65%)"
                />
            </div>

            {/* Interactive Grid View (Grouped by Building/Floor) */}
            {viewMode === 'grid' && (
                <div className="flex flex-col gap-6">
                    {/* Filters embedded in a Card */}
                    <Card>
                        <CardBody className="p-4">
                            {toolbar}
                        </CardBody>
                    </Card>

                    {classrooms.data.length === 0 ? (
                        <Card>
                            <CardBody className="py-12 text-center text-muted-foreground">
                                <Building className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                                <p className="font-semibold text-lg">No classrooms found</p>
                                <p className="text-sm mt-1">Try resetting the filters or add a new classroom venue.</p>
                            </CardBody>
                        </Card>
                    ) : (
                        Object.keys(groupedClassrooms).map(buildingName => (
                            <div key={buildingName} className="space-y-4">
                                <div className="flex items-center gap-2 border-b pb-2">
                                    <Building className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-bold tracking-tight text-foreground">{buildingName}</h2>
                                    <Badge variant="secondary" className="ml-2">
                                        {Object.values(groupedClassrooms[buildingName]).reduce((acc, curr) => acc + curr.length, 0)} rooms
                                    </Badge>
                                </div>

                                <div className="space-y-6">
                                    {Object.keys(groupedClassrooms[buildingName]).map(floorName => (
                                        <div key={floorName} className="space-y-3">
                                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                                {floorName}
                                            </h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {groupedClassrooms[buildingName][floorName].map(room => (
                                                    <div
                                                        key={room.id}
                                                        className={`group relative rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${room.is_active ? 'bg-card border-border hover:border-primary/50' : 'bg-muted/55 border-border/70 opacity-80'}`}
                                                    >
                                                        {/* Top header line */}
                                                        <div className="flex justify-between items-start gap-2 mb-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="p-1.5 rounded bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                                    {getRoomTypeIcon(room.room_type)}
                                                                </span>
                                                                <div>
                                                                    <div className="font-semibold leading-tight text-foreground truncate max-w-[120px]">
                                                                        {room.name}
                                                                    </div>
                                                                    <span className="text-[10px] text-muted-foreground capitalize">
                                                                        {getRoomTypeLabel(room.room_type)}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-1.5">
                                                                {room.room_number && (
                                                                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground border">
                                                                        {room.room_number}
                                                                    </span>
                                                                )}
                                                                {!room.is_active && (
                                                                    <Badge variant="warning" className="text-[10px] px-1 py-0">
                                                                        Inactive
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Capacity & Location */}
                                                        <div className="space-y-1.5 my-3 text-xs text-muted-foreground">
                                                            <div className="flex items-center justify-between">
                                                                <span>Capacity:</span>
                                                                <span className="font-semibold text-foreground">{room.capacity} seats</span>
                                                            </div>
                                                            {room.location && (
                                                                <div className="flex items-center gap-1 text-[11px] truncate" title={room.location}>
                                                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground/75 flex-shrink-0" />
                                                                    {room.location}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Features chips */}
                                                        {room.features && room.features.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1 mt-2 mb-8">
                                                                {room.features.slice(0, 3).map((f, idx) => (
                                                                    <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-muted font-medium border border-border/40 text-muted-foreground">
                                                                        {f}
                                                                    </span>
                                                                ))}
                                                                {room.features.length > 3 && (
                                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted/80 font-medium text-muted-foreground">
                                                                        +{room.features.length - 3}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="h-6 mt-2 mb-8"></div>
                                                        )}

                                                        {/* Actions absolute bottom bar (fades in on hover) */}
                                                        <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            {hasPermission('edit classes') && (
                                                                <Button 
                                                                    variant="secondary" 
                                                                    size="sm" 
                                                                    className="h-7 px-2 text-xs" 
                                                                    onClick={() => openEditModal(room)}
                                                                >
                                                                    <Edit2 className="w-3 h-3 mr-1" />
                                                                    Edit
                                                                </Button>
                                                            )}
                                                            {hasPermission('delete classes') && (
                                                                <Button 
                                                                    variant="destructive" 
                                                                    size="sm" 
                                                                    className="h-7 px-2 text-xs" 
                                                                    onClick={() => setDeletingRoom(room)}
                                                                >
                                                                    <Trash2 className="w-3 h-3 mr-1" />
                                                                    Delete
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Visual Grid Pagination (standard pagination from Inertia pagination) */}
                    {meta.last_page > 1 && (
                        <div className="flex justify-center mt-4 border-t pt-4">
                            <div className="flex gap-1">
                                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(page => (
                                    <Button
                                        key={page}
                                        variant={meta.current_page === page ? 'primary' : 'secondary'}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Standard Table View */}
            {viewMode === 'table' && (
                <Card>
                    <CardBody>
                        <DataTable
                            columns={columns}
                            data={classrooms.data}
                            meta={meta}
                            onPageChange={handlePageChange}
                            toolbar={toolbar}
                        />
                    </CardBody>
                </Card>
            )}

            {/* Add / Edit modal */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingRoom ? 'Edit Classroom / Venue' : 'Create New Classroom'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={processing}>
                            {editingRoom ? 'Update Venue' : 'Create Venue'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Room / Venue Name"
                            required
                            placeholder="e.g. Al-Farooq Hall"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                        />
                        <Input
                            label="Room Number"
                            placeholder="e.g. F2-04"
                            value={data.room_number}
                            onChange={(e) => setData('room_number', e.target.value)}
                            error={errors.room_number}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input
                                label="Building Name"
                                required
                                placeholder="e.g. Main Academy Block"
                                value={data.building_name}
                                onChange={(e) => setData('building_name', e.target.value)}
                                error={errors.building_name}
                                list="existing-buildings"
                            />
                            <datalist id="existing-buildings">
                                {buildings.map(b => <option key={b} value={b} />)}
                            </datalist>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-semibold text-muted-foreground">Floor Name *</label>
                                <button
                                    type="button"
                                    onClick={() => setCustomFloorMode(!customFloorMode)}
                                    className="text-[10px] text-primary hover:underline"
                                >
                                    {customFloorMode ? 'Select from list' : 'Type custom floor'}
                                </button>
                            </div>
                            
                            {customFloorMode ? (
                                <Input
                                    required
                                    placeholder="e.g. 6th Floor"
                                    value={data.floor_name}
                                    onChange={(e) => setData('floor_name', e.target.value)}
                                    error={errors.floor_name}
                                />
                            ) : (
                                <SearchableSelect
                                    value={data.floor_name}
                                    onChange={(e) => setData('floor_name', e.target.value)}
                                    options={FLOORS.map(f => ({ value: f, label: f }))}
                                    placeholder="Select Floor"
                                    error={errors.floor_name}
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Capacity (Seating Students)"
                            type="number"
                            required
                            min="1"
                            max="1000"
                            value={data.capacity}
                            onChange={(e) => setData('capacity', parseInt(e.target.value) || 0)}
                            error={errors.capacity}
                        />

                        <SearchableSelect
                            label="Room / Venue Type"
                            required
                            value={data.room_type}
                            onChange={(e) => setData('room_type', e.target.value as any)}
                            options={ROOM_TYPES.map(t => ({ value: t.value, label: t.label }))}
                            error={errors.room_type}
                        />
                    </div>

                    <Input
                        label="Location/Short Description (optional)"
                        placeholder="e.g. Opposite to Admin Wing, Near main stairs"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                        error={errors.location}
                    />

                    {/* Features checklist */}
                    <div>
                        <span className="text-xs font-semibold text-muted-foreground block mb-2">
                            Amenities & Multimedia Features
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border rounded-lg p-3 bg-muted/20">
                            {STANDARD_FEATURES.map((feature) => {
                                const isChecked = data.features.includes(feature.value);
                                return (
                                    <label key={feature.value} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                                        <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={() => toggleFeature(feature.value)}
                                        />
                                        <span className={isChecked ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                                            {feature.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Status Active toggle */}
                    <div className="flex items-center gap-3 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <Checkbox
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', !!checked)}
                            />
                            <div>
                                <span className="text-sm font-semibold text-foreground block">Active Venue Status</span>
                                <span className="text-xs text-muted-foreground">In-active venues will be highlighted and unavailable in new timetables.</span>
                            </div>
                        </label>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deletingRoom}
                onClose={() => setDeletingRoom(null)}
                onConfirm={handleDelete}
                title="Delete Classroom Venue"
                message={`Are you sure you want to delete "${deletingRoom?.name}" (${deletingRoom?.room_number ?? 'N/A'})? This classroom cannot be deleted if it is already assigned to schedules or timetables. This action is irreversible.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
