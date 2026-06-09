import React from 'react';
import { ExternalLink, Calendar, BookOpen, User } from 'lucide-react';
import type { ClassSession } from '@/types/models';
import { cn } from '@/lib/utils';

const YoutubeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

interface SessionTableProps {
    sessions: ClassSession[];
    isUrdu: boolean;
}

export default function SessionTable({ sessions, isUrdu }: SessionTableProps) {
    if (!sessions || sessions.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl">
                <p className={cn("text-stone-500 dark:text-stone-400 text-sm", isUrdu && "font-urdu")}>
                    {isUrdu ? 'اس وقت کوئی فعال کلاسز دستیاب نہیں ہیں۔' : 'No active sessions or classes found for this program.'}
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border border-stone-200/60 dark:border-stone-800/80 rounded-2xl bg-card shadow-sm">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="bg-stone-50 dark:bg-sapphire-950/40 border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-xs font-black uppercase tracking-wider">
                        <th className={cn("py-4 px-6", isUrdu && "font-urdu text-right text-xs")}>
                            {isUrdu ? 'کتاب / مضمون' : 'Book / Subject'}
                        </th>
                        <th className={cn("py-4 px-6", isUrdu && "font-urdu text-right text-xs")}>
                            {isUrdu ? 'استاد / مدرس' : 'Teacher'}
                        </th>
                        <th className={cn("py-4 px-6", isUrdu && "font-urdu text-right text-xs")}>
                            {isUrdu ? 'تعلیمی سال' : 'Academic Year'}
                        </th>
                        <th className={cn("py-4 px-6 text-center", isUrdu && "font-urdu text-center text-xs")}>
                            {isUrdu ? 'لیکچرز / ویڈیوز' : 'Lectures'}
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
                    {sessions.map((session) => (
                        <tr 
                            key={session.id} 
                            className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors"
                        >
                            {/* Book Column */}
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-sapphire-500/10 text-sapphire-500 flex items-center justify-center shrink-0">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-stone-900 dark:text-white">
                                            {isUrdu && session.book?.urdu_name ? session.book.urdu_name : session.book?.name}
                                        </div>
                                        {session.book?.urdu_name && !isUrdu && (
                                            <div className="text-[11px] text-stone-400 font-medium font-urdu mt-0.5">
                                                {session.book.urdu_name}
                                            </div>
                                        )}
                                        {session.book?.name && isUrdu && (
                                            <div className="text-[11px] text-stone-400 font-medium mt-0.5">
                                                {session.book.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>

                            {/* Teacher Column */}
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gold-500/10 text-gold-500 flex items-center justify-center shrink-0">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-stone-900 dark:text-white">
                                            {isUrdu && session.teacher?.urdu_name ? session.teacher.urdu_name : session.teacher?.name}
                                        </div>
                                        {session.teacher?.urdu_name && !isUrdu && (
                                            <div className="text-[11px] text-stone-400 font-medium font-urdu mt-0.5">
                                                {session.teacher.urdu_name}
                                            </div>
                                        )}
                                        {session.teacher?.name && isUrdu && (
                                            <div className="text-[11px] text-stone-400 font-medium mt-0.5">
                                                {session.teacher.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>

                            {/* Year Column */}
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400 font-semibold">
                                    <Calendar className="w-4 h-4 text-stone-400" />
                                    <span>{session.year?.name || '2026'}</span>
                                </div>
                            </td>

                            {/* Lecture Link Column */}
                            <td className="py-4 px-6 text-center">
                                {session.lecture_link ? (
                                    <a 
                                        href={session.lecture_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 border border-red-500/20"
                                    >
                                        <YoutubeIcon className="w-4 h-4 fill-red-500 hover:fill-white" />
                                        <span>{isUrdu ? 'لیکچرز دیکھیں' : 'Watch Playlists'}</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                ) : (
                                    <span className={cn("text-xs text-stone-400 font-medium italic", isUrdu && "font-urdu")}>
                                        {isUrdu ? 'لیکچرز دستیاب نہیں' : 'Recordings unavailable'}
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
