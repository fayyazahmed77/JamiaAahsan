import React from 'react';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { ChevronDown, Edit, Trash2 } from 'lucide-react';
import type { Permission } from '@/types/models';
import type { PermissionCategory } from '../Index';
import { CategoryIcon } from '../Index';

interface PermissionsTabProps {
    categories: PermissionCategory[];
    expandedCategories: Record<number, boolean>;
    toggleAccordion: (catId: number) => void;
    openEditPermission: (perm: Permission & { category_id?: number }) => void;
    confirmDelete: (type: 'permission', id: number, name: string) => void;
}

export default function PermissionsTab({
    categories,
    expandedCategories,
    toggleAccordion,
    openEditPermission,
    confirmDelete,
}: PermissionsTabProps) {
    return (
        <div className="flex flex-col gap-4">
            {categories.map((cat) => {
                const isExpanded = !!expandedCategories[cat.id];
                const catPerms = cat.permissions || [];

                return (
                    <div key={cat.id} className="border border-border rounded-lg overflow-hidden bg-card transition-shadow hover:shadow-sm">
                        {/* Accordion Header */}
                        <button
                            type="button"
                            onClick={() => toggleAccordion(cat.id)}
                            className="w-full flex items-center justify-between p-4 bg-muted/20 text-left outline-none cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded bg-primary/15 text-primary flex items-center justify-center">
                                    <CategoryIcon iconName={cat.icon} className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground">{cat.name}</h4>
                                    <p className="text-[11px] text-muted-foreground">{catPerms.length} permissions mapped</p>
                                </div>
                            </div>
                            <ChevronDown
                                size={18}
                                className={`text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Accordion Body */}
                        {isExpanded && (
                            <div className="border-t border-border bg-card overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead className="bg-muted/40 border-b border-border">
                                        <tr>
                                            <th className="px-4 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider">Permission Name</th>
                                            <th className="px-4 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider">Identifier</th>
                                            <th className="px-4 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider">Created By</th>
                                            <th className="px-4 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {catPerms.map((perm: Permission) => (
                                            <tr key={perm.id} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-4 py-3 font-semibold text-foreground">{perm.name}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" className="font-mono text-[10px] lowercase px-2 py-0">
                                                        {perm.name}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">System Seeder</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button 
                                                            variant="outline" 
                                                            size="icon-xs" 
                                                            onClick={() => openEditPermission({ ...perm, category_id: cat.id })}
                                                            className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                                        >
                                                            <Edit className="size-3" />
                                                        </Button>
                                                        <Button 
                                                            variant="destructive" 
                                                            size="icon-xs" 
                                                            onClick={() => confirmDelete('permission', perm.id, perm.name)}
                                                        >
                                                            <Trash2 className="size-3" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {catPerms.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center py-6 text-muted-foreground italic">
                                                    No permissions mapped to this category yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
