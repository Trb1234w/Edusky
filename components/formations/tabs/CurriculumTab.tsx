import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Book, Video, FileText, Lock } from "lucide-react";
import { normalizeArray } from "@/lib/utils/data-format";

interface CurriculumTabProps {
    curriculum: any;
}

export function CurriculumTab({ curriculum }: CurriculumTabProps) {
    const modules = normalizeArray(curriculum);

    if (modules.length === 0) return null;

    return (
        <div className="space-y-6">
            <Card className="p-6 bg-background rounded-2xl shadow-lg border-none">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Book className="h-6 w-6 text-primary" /> Curriculum
                </h3>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {modules.map((module: any, index: number) => (
                        <AccordionItem value={`item-${index}`} key={index} className="border-b-0 mb-3 last:mb-0">
                            <Card className="shadow-sm border hover:border-primary/50 transition-colors overflow-hidden">
                                <AccordionTrigger className="text-base md:text-lg font-semibold p-4 hover:no-underline bg-muted/20">
                                    <div className="flex items-center gap-3 text-left">
                                        <span className="bg-primary/10 text-primary w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        <span>{module.title || module.titre || `Module ${index + 1}`}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-0">
                                    <div className="divide-y">
                                        {module.lessons && normalizeArray(module.lessons).map((lesson: any, lessonIndex: number) => (
                                            <div key={lessonIndex} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                                                {lesson.type === 'video' ? (
                                                    <Video className="h-5 w-5 text-blue-500" />
                                                ) : lesson.type === 'quiz' ? (
                                                    <FileText className="h-5 w-5 text-orange-500" />
                                                ) : (
                                                    <FileText className="h-5 w-5 text-gray-500" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm md:text-base truncate">{lesson.title || lesson.titre || `Leçon ${lessonIndex + 1}`}</p>
                                                    {lesson.description && <p className="text-xs text-muted-foreground truncate">{lesson.description}</p>}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground whitespace-nowrap">
                                                    {lesson.duration && <span>{lesson.duration}</span>}
                                                    {lesson.isFree ? (
                                                        <span className="text-green-600 font-medium px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full">Gratuit</span>
                                                    ) : (
                                                        <Lock className="h-3 w-3" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Card>
        </div>
    );
}
