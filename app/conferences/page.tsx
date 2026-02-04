import { getConferences, getUserProgram } from "@/lib/actions/conference";
import { getUserTickets } from "@/lib/actions/commerce";
import { ConferenceCard } from "@/components/conferences/conference-card";
import { ConferenceFilters } from "@/components/conferences/conference-filters";
import { ConferencePagination } from "@/components/conferences/conference-pagination";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ConferencesPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams;
    const session = await auth.api.getSession({ headers: await headers() });

    const page = Number(searchParams.page || 1);
    const limit = 6;
    const theme = typeof searchParams.theme === 'string' ? searchParams.theme : undefined;
    const date = typeof searchParams.date === 'string' ? searchParams.date : undefined;
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

    const [allConferencesRes, userProgramRes, userTickets] = await Promise.all([
        getConferences({ page, limit, theme, date, search }),
        getUserProgram(),
        getUserTickets()
    ]);

    const conferences = allConferencesRes.data || [];
    const pagination = allConferencesRes.pagination || { totalPages: 1, page: 1, limit: 10, total: 0 };
    const userProgramIds = new Set(userProgramRes.data?.map((c: any) => c.id) || []);

    const allowedRanges = userTickets.map((t: any) => ({
        start: t.type.validFrom ? new Date(t.type.validFrom).getTime() : null,
        end: t.type.validUntil ? new Date(t.type.validUntil).getTime() : null
    })).filter((r: any) => r.start && r.end);

    return (
        <div className="container py-10">
            <div className="mb-10 text-center">
                <h1 className="lg:text-4xl text-2xl font-display font-bold uppercase tracking-widest text-foreground mb-4">
                    Conférences <span className="text-accent">2026</span>
                </h1>
                <p className="max-w-2xl mx-auto mb-8">
                    Découvrez les conférences disponibles.<br />
                    Ajoutez-les à votre programme personnel pour ne rien rater.
                </p>
                <ConferenceFilters />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {conferences.map((conf: any) => (
                    <ConferenceCard
                        key={conf.id}
                        conference={conf}
                        isInProgram={userProgramIds.has(conf.id)}
                        isLoggedIn={!!session?.user}
                        allowedRanges={allowedRanges}
                    />
                ))}
            </div>

            {conferences.length === 0 && (
                <div className="text-center py-20 text-foreground">
                    Aucune conférence ne correspond à vos critères.
                </div>
            )}

            <ConferencePagination totalPages={pagination.totalPages} currentPage={pagination.page} />
        </div>
    );
}
