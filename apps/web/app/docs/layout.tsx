import { getAllDocs } from '@/lib/docs';
import { DocsSidebar } from '@/components/DocsSidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    const allDocs = getAllDocs();

    return (
        <div className="flex min-h-screen bg-[#1a120b] text-[#e5e5e5] font-sans">
            <DocsSidebar allDocs={allDocs} />
            <main className="flex-1 p-8 overflow-y-auto w-full md:w-auto">
                {children}
            </main>
        </div>
    );
}
