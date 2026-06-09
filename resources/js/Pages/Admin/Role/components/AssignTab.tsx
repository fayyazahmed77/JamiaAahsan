import React from 'react';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import type { Role, Permission } from '@/types/models';
import type { PermissionCategory } from '../Index';
import { CategoryIcon } from '../Index';

interface AssignTabProps {
    categories: PermissionCategory[];
    roleForm: {
        data: {
            name: string;
            permissions: string[];
        };
        setData: (key: string | Record<string, any>, value?: any) => void;
        errors: {
            name?: string;
        };
        processing: boolean;
    };
    selectedCategoryForAssign: number | null;
    setSelectedCategoryForAssign: (id: number | null) => void;
    handlePermissionToggle: (name: string) => void;
    toggleAllCategoryPermissions: (catId: number, check: boolean) => void;
    handleRoleSubmit: (e: React.FormEvent) => void;
    editingRole?: Role | null;
    cancelRoleEdit: () => void;
}

export default function AssignTab({
    categories,
    roleForm,
    selectedCategoryForAssign,
    setSelectedCategoryForAssign,
    handlePermissionToggle,
    toggleAllCategoryPermissions,
    handleRoleSubmit,
    editingRole,
    cancelRoleEdit,
}: AssignTabProps) {
    return (
        <form onSubmit={handleRoleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 max-w-md">
                <label className="text-sm font-semibold text-foreground">Role name</label>
                <Input
                    placeholder="e.g. Manager"
                    value={roleForm.data.name}
                    onChange={e => roleForm.setData('name', e.target.value)}
                    error={roleForm.errors.name}
                    required
                    disabled={editingRole?.name === 'Super Admin'}
                />
            </div>

            {/* Categorized Permission Selection UI */}
            <div className="flex flex-col gap-4">
                <label className="text-sm font-semibold text-foreground">Permissions Mapping</label>

                {/* Horizontal Pill Selectors */}
                <div className="flex flex-wrap gap-2 pb-2 border-b border-border">
                    {categories.map((cat) => {
                        const isActive = selectedCategoryForAssign === cat.id;
                        const catPerms = cat.permissions || [];
                        const activeCheckedCount = catPerms.filter((p: Permission) => roleForm.data.permissions.includes(p.name)).length;

                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategoryForAssign(cat.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
                                    isActive
                                        ? 'bg-primary border-primary text-white shadow-sm'
                                        : 'bg-background hover:bg-muted border-border text-muted-foreground'
                                }`}
                            >
                                <CategoryIcon iconName={cat.icon} className={`w-3.5 h-3.5 ${isActive ? 'text-white' : ''}`} />
                                <span>{cat.name}</span>
                                {activeCheckedCount > 0 && (
                                    <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                                        {activeCheckedCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Checkbox Listing Box */}
                {categories.map((cat) => {
                    if (selectedCategoryForAssign !== cat.id) return null;
                    const catPerms = cat.permissions || [];
                    const allChecked = catPerms.length > 0 && catPerms.every((p: Permission) => roleForm.data.permissions.includes(p.name));

                    return (
                        <div key={cat.id} className="border border-border rounded-xl p-4 bg-muted/10">
                            <div className="flex justify-between items-center border-b border-border/60 pb-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <CategoryIcon iconName={cat.icon} className="text-primary w-4.5 h-4.5" />
                                    <span className="font-bold text-sm text-foreground capitalize">{cat.name} permissions</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="xs"
                                    onClick={() => toggleAllCategoryPermissions(cat.id, !allChecked)}
                                >
                                    {allChecked ? 'Unselect All' : 'Select All'}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {catPerms.map((perm: Permission) => {
                                    const isChecked = roleForm.data.permissions.includes(perm.name);
                                    return (
                                        <label
                                            key={perm.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                                                isChecked
                                                    ? 'border-primary bg-primary/5 shadow-sm'
                                                    : 'border-border bg-card hover:bg-muted/30'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handlePermissionToggle(perm.name)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary h-4.5 w-4.5"
                                            />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-semibold text-foreground truncate">
                                                    {perm.name.split(' ')[0]} {cat.name}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground font-mono truncate">
                                                    {perm.name}
                                                </span>
                                            </div>
                                        </label>
                                    );
                                })}
                                {catPerms.length === 0 && (
                                    <div className="col-span-full text-center py-6 text-muted-foreground italic">
                                        No permissions configured in this category.
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end border-t border-border pt-4 mt-2">
                {editingRole && (
                    <Button type="button" variant="secondary" onClick={cancelRoleEdit}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" variant="primary" loading={roleForm.processing}>
                    {editingRole ? 'Save' : 'Create Role'}
                </Button>
            </div>
        </form>
    );
}
