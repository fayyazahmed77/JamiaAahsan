import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ChartAreaInteractive } from '@/Components/chart-area-interactive';
import { DataTable } from '@/Components/data-table';
import { Badge } from "@/Components/ui/Badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/Card";
import { Headphones, Video, GraduationCap, MessageSquare, TrendingUp } from "lucide-react";
import data from "../../data.json";
import type { DashboardStats, Feedback, Audio as AudioModel } from '@/types/models';

interface Props {
    stats: DashboardStats;
    recent_feedback: Feedback[];
    latest_audio: AudioModel[];
}

export default function Dashboard({ stats, recent_feedback, latest_audio }: Props) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6">
                {/* 1. Real Database Stats Cards */}
                <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
                    {/* Card 1: Total Audio */}
                    <Card className="@container/card">
                        <CardHeader>
                            <CardDescription>Total Audio Lectures</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {stats.audio_count.toLocaleString()}
                            </CardTitle>
                            <CardAction>
                                <Badge variant="outline">
                                    <Headphones className="size-4 mr-1 text-primary" />
                                    Audio
                                </Badge>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1.5 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium">
                                Total audio views: {stats.audio_views.toLocaleString()}
                            </div>
                            <div className="text-muted-foreground">
                                Managed Islamic audio library
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Card 2: Total Videos */}
                    <Card className="@container/card">
                        <CardHeader>
                            <CardDescription>Total Video Lectures</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {stats.video_count.toLocaleString()}
                            </CardTitle>
                            <CardAction>
                                <Badge variant="outline">
                                    <Video className="size-4 mr-1 text-info" />
                                    Videos
                                </Badge>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1.5 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium">
                                Total video views: {stats.video_views.toLocaleString()}
                            </div>
                            <div className="text-muted-foreground">
                                High-quality video publications
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Card 3: Total Admissions */}
                    <Card className="@container/card">
                        <CardHeader>
                            <CardDescription>Total Student Admissions</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {stats.admissions_total.toLocaleString()}
                            </CardTitle>
                            <CardAction>
                                <Badge variant="outline">
                                    <GraduationCap className="size-4 mr-1 text-success" />
                                    Students
                                </Badge>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1.5 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium text-warning">
                                {stats.admissions_pending.toLocaleString()} pending approval
                            </div>
                            <div className="text-muted-foreground">
                                Dars-e-Nizami online applications
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Card 4: Feedback Summary */}
                    <Card className="@container/card">
                        <CardHeader>
                            <CardDescription>Avg. User Rating</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {stats.feedback_avg_rating} ★
                            </CardTitle>
                            <CardAction>
                                <Badge variant="outline">
                                    <MessageSquare className="size-4 mr-1 text-accent" />
                                    Feedback
                                </Badge>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1.5 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium">
                                Total feedback: {stats.feedback_count.toLocaleString()}
                            </div>
                            <div className="text-muted-foreground">
                                Customer review satisfaction rate
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* 2. Recharts Interactive Chart */}
                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                </div>

                {/* 3. Reorderable Data Table */}
                <DataTable data={data} />
            </div>
        </AdminLayout>
    );
}
