import { getUserProgram } from "@/lib/actions/conference";
import { ConferenceCard } from "@/components/conferences/conference-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function MyProgramPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        redirect("/login");
    }

    const { data: program } = await getUserProgram();

    return (
        <div className="container py-10">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-4xl font-display font-bold uppercase tracking-widest text-foreground">
                    Mon Programme
                </h1>
                <Link href="/conferences">
                    <Button variant="outline">Parcourir les conférences</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {program?.map((conf: any) => (
                    <ConferenceCard
                        key={conf.id}
                        conference={conf}
                        isInProgram={true} // By definition, they are in program
                        isLoggedIn={true}
                    />
                ))}
            </div>

            {(!program || program.length === 0) && (
                <div className="text-center py-20 border rounded-lg bg-card/50">
                    <p className="text-muted-foreground mb-4">Votre programme est vide pour le moment.</p>
                    <Link href="/conferences">
                        <Button>Découvrir le programme</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
