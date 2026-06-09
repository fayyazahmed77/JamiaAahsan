import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Modal } from '@/Components/ui/Modal';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Select } from '@/Components/ui/Select';
import type { Role, Permission } from '@/types/models';
import {
    LayoutDashboard,
    Music,
    Video,
    Image as ImageIcon,
    Download,
    User,
    List,
    Calendar,
    BookOpen,
    Users,
    Book,
    GraduationCap,
    Mail,
    HelpCircle,
    Settings,
    Clock,
    FileText,
    Star,
    Shield,
    Bell,
    Plus,
} from 'lucide-react';

import CategoryTab from './components/CategoryTab';
import PermissionsTab from './components/PermissionsTab';
import AssignTab from './components/AssignTab';
import RolesTab from './components/RolesTab';

export interface PermissionCategory {
    id: number;
    name: string;
    icon: string | null;
    permissions?: Permission[];
    created_at?: string;
}

interface Props {
    roles: Role[];
    categories: PermissionCategory[];
    permissions: Permission[];
    editingRole?: Role | null;
    rolePermissions?: string[];
}

export const IconMap: Record<string, React.ComponentType<any>> = {
    Dashboard: LayoutDashboard,
    Audio: Music,
    Video: Video,
    Image: ImageIcon,
    Download: Download,
    Speaker: User,
    Category: List,
    Year: Calendar,
    Class: BookOpen,
    Teacher: Users,
    Book: Book,
    Admission: GraduationCap,
    Subscription: Mail,
    QA: HelpCircle,
    Settings: Settings,
    Prayer: Clock,
    News: FileText,
    Feedback: Star,
    Users: Users,
    Roles: Shield,
    Bell: Bell,
};

export const CategoryIcon = ({ iconName, className }: { iconName?: string | null; className?: string }) => {
    const Component = iconName && IconMap[iconName] ? IconMap[iconName] : Shield;
    return <Component className={className || "w-4 h-4"} />;
};

export default function RoleIndex({ roles, categories: initialCategories, permissions, editingRole, rolePermissions = [] }: Props) {
    const categories = React.useMemo(() => {
        return initialCategories.map(cat => ({
            ...cat,
            permissions: cat.permissions 
                ? Array.from(new Map(cat.permissions.map(p => [p.name, p])).values())
                : []
        }));
    }, [initialCategories]);

    const [activeTab, setActiveTab] = useState(editingRole ? 'assign' : 'roles');
    
    // Category Modal State
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<PermissionCategory | null>(null);
    const categoryForm = useForm({
        name: '',
        icon: '',
    });

    // Permission Modal State
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState<Permission & { category_id?: number } | null>(null);
    const permissionForm = useForm({
        name: '',
        category_id: '',
    });

    // Role Assign Form State
    const roleForm = useForm({
        name: '',
        permissions: [] as string[],
    });
    const [selectedCategoryForAssign, setSelectedCategoryForAssign] = useState<number | null>(null);

    // Delete Confirmation State
    const [deleteConfirm, setDeleteConfirm] = useState<{
        type: 'role' | 'category' | 'permission';
        id: number;
        name: string;
    } | null>(null);

    // Accordion State for Permissions Tab
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

    // Initialize/Sync Role Assign Form when editingRole changes
    useEffect(() => {
        if (editingRole) {
            roleForm.setData({
                name: editingRole.name,
                permissions: rolePermissions,
            });
            setActiveTab('assign');
        } else {
            roleForm.setData({
                name: '',
                permissions: [],
            });
        }
    }, [editingRole, rolePermissions]);

    // Select first category by default for "Assign to Role" tab
    useEffect(() => {
        if (categories.length > 0 && selectedCategoryForAssign === null) {
            setSelectedCategoryForAssign(categories[0].id);
        }
    }, [categories]);

    // Accordion toggle helper
    const toggleAccordion = (catId: number) => {
        setExpandedCategories(prev => ({
            ...prev,
            [catId]: !prev[catId]
        }));
    };

    // Category CRUD handlers
    const openAddCategory = () => {
        setEditingCategory(null);
        categoryForm.setData({ name: '', icon: 'Dashboard' });
        setIsCategoryModalOpen(true);
    };

    const openEditCategory = (cat: PermissionCategory) => {
        setEditingCategory(cat);
        categoryForm.setData({ name: cat.name, icon: cat.icon || 'Dashboard' });
        setIsCategoryModalOpen(true);
    };

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            categoryForm.put(`/admin/permission-categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setIsCategoryModalOpen(false);
                    categoryForm.reset();
                }
            });
        } else {
            categoryForm.post('/admin/permission-categories', {
                onSuccess: () => {
                    setIsCategoryModalOpen(false);
                    categoryForm.reset();
                }
            });
        }
    };

    // Permission CRUD handlers
    const openAddPermission = () => {
        setEditingPermission(null);
        permissionForm.setData({ name: '', category_id: categories[0]?.id?.toString() || '' });
        setIsPermissionModalOpen(true);
    };

    const openEditPermission = (perm: Permission & { category_id?: number }) => {
        setEditingPermission(perm);
        permissionForm.setData({
            name: perm.name,
            category_id: perm.category_id?.toString() || '',
        });
        setIsPermissionModalOpen(true);
    };

    const handlePermissionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPermission) {
            permissionForm.put(`/admin/permissions/${editingPermission.id}`, {
                onSuccess: () => {
                    setIsPermissionModalOpen(false);
                    permissionForm.reset();
                }
            });
        } else {
            permissionForm.post('/admin/permissions', {
                onSuccess: () => {
                    setIsPermissionModalOpen(false);
                    permissionForm.reset();
                }
            });
        }
    };

    // Role Assign Handlers
    const handlePermissionToggle = (pName: string) => {
        const has = roleForm.data.permissions.includes(pName);
        if (has) {
            roleForm.setData('permissions', roleForm.data.permissions.filter(p => p !== pName));
        } else {
            roleForm.setData('permissions', [...roleForm.data.permissions, pName]);
        }
    };

    const toggleAllCategoryPermissions = (catId: number, check: boolean) => {
        const cat = categories.find(c => c.id === catId);
        if (!cat || !cat.permissions) return;
        const catPermNames = cat.permissions.map(p => p.name);

        if (check) {
            // Add all
            const merged = Array.from(new Set([...roleForm.data.permissions, ...catPermNames]));
            roleForm.setData('permissions', merged);
        } else {
            // Remove all
            roleForm.setData('permissions', roleForm.data.permissions.filter(p => !catPermNames.includes(p)));
        }
    };

    const handleRoleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRole) {
            roleForm.put(`/admin/roles/${editingRole.id}`, {
                onSuccess: () => {
                    roleForm.reset();
                    router.get('/admin/roles');
                }
            });
        } else {
            roleForm.post('/admin/roles', {
                onSuccess: () => {
                    roleForm.reset();
                    setActiveTab('roles');
                }
            });
        }
    };

    const cancelRoleEdit = () => {
        roleForm.reset();
        router.get('/admin/roles');
    };

    // Generic Delete Action handler
    const confirmDelete = (type: 'role' | 'category' | 'permission', id: number, name: string) => {
        setDeleteConfirm({ type, id, name });
    };

    const handleDelete = () => {
        if (!deleteConfirm) return;
        const { type, id } = deleteConfirm;

        if (type === 'role') {
            router.delete(`/admin/roles/${id}`, {
                onSuccess: () => setDeleteConfirm(null)
            });
        } else if (type === 'category') {
            router.delete(`/admin/permission-categories/${id}`, {
                onSuccess: () => setDeleteConfirm(null)
            });
        } else if (type === 'permission') {
            router.delete(`/admin/permissions/${id}`, {
                onSuccess: () => setDeleteConfirm(null)
            });
        }
    };

    return (
        <AdminLayout title="Roles & Permissions Management">
            <Head title="Roles & Permissions" />

            <div className="flex flex-col gap-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex justify-between items-center border-b border-border pb-3 mb-2 flex-wrap gap-4">
                        <TabsList className="bg-muted p-1 rounded-lg">
                            <TabsTrigger value="category" className="px-4 py-2 text-sm font-semibold rounded-md">
                                <span className="flex items-center gap-2"><List size={16} /> Category</span>
                            </TabsTrigger>
                            <TabsTrigger value="permissions" className="px-4 py-2 text-sm font-semibold rounded-md">
                                <span className="flex items-center gap-2"><KeyIcon size={16} /> Permissions</span>
                            </TabsTrigger>
                            <TabsTrigger value="assign" className="px-4 py-2 text-sm font-semibold rounded-md">
                                <span className="flex items-center gap-2"><Shield size={16} /> Assign To Role</span>
                            </TabsTrigger>
                            <TabsTrigger value="roles" className="px-4 py-2 text-sm font-semibold rounded-md">
                                <span className="flex items-center gap-2"><Users size={16} /> Roles</span>
                            </TabsTrigger>
                        </TabsList>

                        {activeTab === 'category' && (
                            <Button variant="primary" size="sm" onClick={openAddCategory} className="flex items-center gap-1">
                                <Plus size={16} /> Add Category
                            </Button>
                        )}
                        {activeTab === 'permissions' && (
                            <Button variant="primary" size="sm" onClick={openAddPermission} className="flex items-center gap-1">
                                <Plus size={16} /> Add Permission
                            </Button>
                        )}
                    </div>

                    {/* TAB 1: Category */}
                    <TabsContent value="category">
                        <Card>
                            <CardBody className="p-0">
                                <CategoryTab
                                    categories={categories}
                                    openEditCategory={openEditCategory}
                                    confirmDelete={confirmDelete}
                                />
                            </CardBody>
                        </Card>
                    </TabsContent>

                    {/* TAB 2: Permissions */}
                    <TabsContent value="permissions">
                        <PermissionsTab
                            categories={categories}
                            expandedCategories={expandedCategories}
                            toggleAccordion={toggleAccordion}
                            openEditPermission={openEditPermission}
                            confirmDelete={confirmDelete}
                        />
                    </TabsContent>

                    {/* TAB 3: Assign To Role */}
                    <TabsContent value="assign">
                        <Card>
                            <CardBody className="p-6">
                                <AssignTab
                                    categories={categories}
                                    roleForm={roleForm}
                                    selectedCategoryForAssign={selectedCategoryForAssign}
                                    setSelectedCategoryForAssign={setSelectedCategoryForAssign}
                                    handlePermissionToggle={handlePermissionToggle}
                                    toggleAllCategoryPermissions={toggleAllCategoryPermissions}
                                    handleRoleSubmit={handleRoleSubmit}
                                    editingRole={editingRole}
                                    cancelRoleEdit={cancelRoleEdit}
                                />
                            </CardBody>
                        </Card>
                    </TabsContent>

                    {/* TAB 4: Roles */}
                    <TabsContent value="roles">
                        <Card>
                            <CardBody className="p-0">
                                <RolesTab
                                    roles={roles}
                                    confirmDelete={confirmDelete}
                                />
                            </CardBody>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* MODALS & DIALOGS */}

            {/* Category Add/Edit Modal */}
            <Modal
                open={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                title={editingCategory ? `Edit Permission Category: ${editingCategory.name}` : "Add Permission Category"}
                footer={
                    <>
                        <Button variant="secondary" size="sm" onClick={() => setIsCategoryModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleCategorySubmit} loading={categoryForm.processing}>
                            Save
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleCategorySubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-foreground">Category Name</label>
                        <Input
                            placeholder="e.g. Candidates"
                            value={categoryForm.data.name}
                            onChange={e => categoryForm.setData('name', e.target.value)}
                            error={categoryForm.errors.name}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-foreground">Sidebar Icon Mapping</label>
                        <Select
                            value={categoryForm.data.icon}
                            onChange={e => categoryForm.setData('icon', e.target.value)}
                            error={categoryForm.errors.icon}
                        >
                            {Object.keys(IconMap).map((key) => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </Select>
                    </div>
                </form>
            </Modal>

            {/* Permission Add/Edit Modal */}
            <Modal
                open={isPermissionModalOpen}
                onClose={() => setIsPermissionModalOpen(false)}
                title={editingPermission ? `Edit Permission: ${editingPermission.name}` : "Add Permission"}
                footer={
                    <>
                        <Button variant="secondary" size="sm" onClick={() => setIsPermissionModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={handlePermissionSubmit} loading={permissionForm.processing}>
                            Save
                        </Button>
                    </>
                }
            >
                <form onSubmit={handlePermissionSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-foreground">Permission Identifier (lowercase, e.g. view audio)</label>
                        <Input
                            placeholder="e.g. view candidates"
                            value={permissionForm.data.name}
                            onChange={e => permissionForm.setData('name', e.target.value)}
                            error={permissionForm.errors.name}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-foreground">Parent Category</label>
                        <Select
                            value={permissionForm.data.category_id}
                            onChange={e => permissionForm.setData('category_id', e.target.value)}
                            error={permissionForm.errors.category_id}
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                            ))}
                        </Select>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={handleDelete}
                title={`Delete ${deleteConfirm?.type}`}
                message={`Are you sure you want to delete the ${deleteConfirm?.type} "${deleteConfirm?.name}"? Associated settings and mappings may be affected. This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}

// Small custom inline key icon component
function KeyIcon({ size = 16, className = '' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 1.5 1.5M15.5 7.5 14 6" />
        </svg>
    );
}
